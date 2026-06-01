import { PayPalButtons } from "@paypal/react-paypal-js";
import http from "../../http";
import { toast } from "react-toastify";

const PayPalButton = ({ amount, token, onSuccess }) => {

    // ✅ Create PayPal order
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: amount.toString() }
                }
            ]
        });
    };

    // ✅ Capture payment safely
    const onApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();  // FULL CAPTURE DATA

            const transactionId =
                details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

            if (!transactionId) {
                toast.error("Payment captured, but transaction ID missing.");
                return;
            }

            // ✅ Send orderID to backend for verification
            const res = await http.post(
                "/paypal/capture",
                { orderID: data.orderID },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.data.success) {
                toast.error("Payment capture failed on server.");
                return;
            }

            // ✅ Safe: send transactionId back to Checkout page
            onSuccess(transactionId);

        } catch (error) {
            toast.error("Payment failed. Try again.");
        }
    };

    // ✅ Popup closed
    const onCancel = () => {
        toast.error("Payment cancelled.");
    };

    // ✅ PayPal internal error
    const onError = (err) => {
        toast.error("Payment error. Try again.");
    };

    return (
        <PayPalButtons
            style={{
              layout: "vertical",
              shape: "rect",
              height: 45
          }}

          fundingSource="card"    // ✅ Show only Debit/Credit Card button

          funding={{
              allowed: ["card"], 
              disallowed: ["paypal", "paylater", "venmo"]  // ✅ Hide PayPal button and others
          }}

          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onError}
        />
    );
};

export default PayPalButton;
