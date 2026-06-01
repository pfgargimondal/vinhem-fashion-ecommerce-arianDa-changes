import { useEffect, useRef } from "react";
import "./PaypalPaymentSuccess.css";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { placeOrderAPI } from "../../api/order";
import { useCart } from "../../context/CartContext";

export const RazorpayPaymentSuccess = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { resetCart } = useCart();
  const hasRun = useRef(false);   // 🔥 Guard

  useEffect(() => {
    if (hasRun.current) return;   // Prevent multiple calls
    hasRun.current = true;

    const query = new URLSearchParams(window.location.search);

    const razorpay_payment_id = query.get("razorpay_payment_id");
    const razorpay_order_id = query.get("razorpay_order_id");
    const razorpay_signature = query.get("razorpay_signature");
    const method = query.get("method");

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      toast.error("Invalid Razorpay response");
      return;
    }

    const verifyPayment = async () => {
      try {
        const verifyRes = await http.post("/razorpay/verify-payment", {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

        if (!verifyRes?.data?.success) {
          toast.error("Payment verification failed");
          return;
        }

        const resp = await placeOrderAPI({
          token,
          payment_method: method || "razorpay",
          shipping_address: JSON.parse(localStorage.getItem("shipping_address")),
          billing_address: JSON.parse(localStorage.getItem("billing_address")),
          country: JSON.parse(localStorage.getItem("selectedCurrency"))?.country_name ?? "",
          coupon_code: localStorage.getItem("coupon_code"),
          coupon_discount: localStorage.getItem("coupon_discount"),
          razorpay_payment_id,
          razorpay_signature,
          razorpay_order_id,
          amount_payable: localStorage.getItem("final_total"),
          shipping_charge: localStorage.getItem("shipping_charge"),
          is_gift: localStorage.getItem("is_gift") ? 1 : 0,
          gst_number: localStorage.getItem("gst_number"),
        });

        if (resp?.success) {
          resetCart();
          navigate("/thank-you");
        }

      } catch (error) {
        toast.error("Razorpay payment verification failed");
      }
    };

    verifyPayment();
  }, [token, navigate, resetCart]);   // ✅ Empty dependency

  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-box">
        <div className="icon">✔</div>
        <h2>Payment Successful</h2>
        <p>Your Razorpay transaction was completed successfully.</p>
      </div>
    </div>
  );
};