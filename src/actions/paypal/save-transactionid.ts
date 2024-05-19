"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  transactionId: string,
  orderId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `No se encontró la orden con el id ${orderId}`,
      };
    }

    return {
      ok: true,
      message: "TransactionId guardado correctamente",
    };
  } catch (e) {
    console.log({ e });

    return {
      ok: false,
      message: "Error al guardar el transactionId",
    };
  }
};
