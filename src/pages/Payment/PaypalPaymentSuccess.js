import { useEffect } from "react";
import "./PaypalPaymentSuccess.css";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { placeOrderAPI } from "../../api/order";
import { useCart } from "../../context/CartContext";

export const PaypalPaymentSuccess = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { resetCart } = useCart();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get("token");

    if (!orderId) {
      toast.error("Invalid PayPal Response");
      return;
    }

    const capturePayment = async () => {
      try {
        const res = await http.post("/paypal/capture-order", {
          order_id: orderId,
        });

        const transactionId =
          res?.data?.purchase_units?.[0]?.payments?.captures?.[0]?.id || res?.data?.id || null;


        if (!transactionId) {

          toast.error("Transaction ID not found in PayPal response");
          return;
        }

        const shippingFinalAddress = JSON.parse(localStorage.getItem("shipping_address"));
        const billingFinalAddress = JSON.parse(localStorage.getItem("billing_address"));
        const amount = localStorage.getItem("final_total");
        const shipping_charge = localStorage.getItem("shipping_charge");

        const countryData = JSON.parse(localStorage.getItem("selectedCurrency"));
        const country = countryData.country_name;

        const coupon_code = localStorage.getItem("coupon_code");
        const coupon_discount = localStorage.getItem("coupon_discount");
        const is_gift = localStorage.getItem("is_gift");
        const gstNumber = localStorage.getItem("gst_number");

        const placeOrderResponse = await placeOrderAPI({
          token,
          payment_method: "pay_pal",
          shipping_address: shippingFinalAddress,
          billing_address: billingFinalAddress,
          country: country,
          coupon_code: coupon_code,
          coupon_discount: coupon_discount,
          paypal_transaction_id: transactionId,
          amount_payable: amount,
          shipping_charge: shipping_charge,
          is_gift: is_gift ? 1 : 0,
          gst_number: gstNumber,
        });

        if (placeOrderResponse?.success) {
            resetCart(); // ← THIS CLEARS CART, COUPON, EVERYTHING
            navigate("/thank-you");
        }

      } catch (err) {
        console.error(err);
        toast.error("Payment capture failed");
      }
    };

    capturePayment();
  }, [token, resetCart, navigate]);

  return (
    <div class="payment-success-wrapper">
      <div class="payment-success-box">
        <div class="icon">✔</div>
        <h2>Payment Successful</h2>
        <p>Your transaction was completed successfully.</p>
      </div>
    </div>
  );
};
