"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();

  const userId = session?.user?.id;

  /* Verificar sesion de usuario */
  if (!userId) {
    return {
      ok: false,
      message: "User not found",
      code: 500,
    };
  }
  /* Obtener info de los productos */
  /* Se puede llevar dos o mas productos con el mismo id */

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  /* Calcular los montos */

  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error("Product not found");

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  /* Crear la transaccion de base de datos */

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      /* 1. Actualizar el stock  */

      const updatedProductsPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((count, p) => count + p.quantity, 0);

        if (productQuantity === 0) {
          throw new Error("Product quantity is 0");
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      /* Verificar valores negativos en la existencia = no hay stock */
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`Product ${product.title} is out of stock`);
        }
      });

      /* 2. Crear la orden - encabezado - detalle */
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      /* Validad si el price es 0 lanzar error */

      /* 3. Crear la direccion de la orden */

      const { country, ...restAddress } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        orderAddress: orderAddress,
        updatedProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
