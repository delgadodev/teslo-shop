"use server";

import { PaypalOrderStatusResponse } from "@/interfaces/paypal.interface";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();

  console.log({ authToken });

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener el token de autenticación",
    };
  }

  const resp = await verifyPaypalPayment(transactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: "No se pudo verificar el pago",
    };
  }

  const { status, purchase_units } = resp;
  /* const {amount,} = purchase_units[0]; */

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "El pago no se ha completado",
    };
  }

  try {
    console.log({ status, purchase_units });

    const { invoice_id: orderId } = purchase_units[0];

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    /* Revalidate path */

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
      message: "Pago verificado",
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: "500 - No se pudo verificar el pago",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const base64Token = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        ...requestOptions,
        cache: "no-store",
      }
    ).then((r) => r.json());

    return result.access_token;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resp = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
    }).then((r) => r.json());

    return resp;
  } catch (e) {
    console.log(e);
    return null;
  }
};
