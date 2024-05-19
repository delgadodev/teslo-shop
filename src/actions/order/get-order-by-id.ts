"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debn estar autenticado para realizar esta acción",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw `${id} no existe`;
    }

    if (session.user.role === "user") {
      if (order.userId !== session.user.id) {
        throw `${id} no es de ese usuario `;
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (e) {
    return {
      ok: false,
      message: `Orden no existe`,
    };
  }
};
