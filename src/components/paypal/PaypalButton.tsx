"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionId } from "@/actions/paypal/save-transactionid";
import { paypalCheckPayment } from "@/actions/paypal/paypal-check-payments";

interface Props {
  orderId: string;
  amount: number;
}

const PayPayButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending)
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded"></div>
      </div>
    );

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: roundedAmount.toString(),
          },
        },
      ],
    });

    console.log({ transactionId });

    const { ok } = await setTransactionId(transactionId, orderId);

    if (!ok) {
      throw new Error("No se pudo guardar la transacción");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) return;

    await paypalCheckPayment(details.id);
  };

  return (
    <div className="relative z-0">
      {/* Para evitar pagos */}
     {/*  <PayPalButtons createOrder={createOrder} onApprove={onApprove} /> */}
    </div>
  );
};

export default PayPayButton;
