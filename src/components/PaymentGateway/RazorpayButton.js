import http from "../../http";

const RazorpayButton = ({ amount, token, onSuccess }) => {

    // Load fresh Razorpay script every time
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const oldScript = document.getElementById("razorpay-script");

            if (oldScript) {
                oldScript.remove();
            }

            const script = document.createElement("script");
            script.id = "razorpay-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const loadRazorpay = async (orderId) => {
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert("Razorpay failed to load");
            return;
        }

        const options = {
            key: "rzp_test_SXQjhHDXKM4Rgu",
            amount: amount * 100,
            currency: "INR",
            name: "Vinham Fashion",
            description: "Order Payment",
            order_id: orderId,

            handler: async function (response) {
                try {
                    const verifyRes = await http.post(
                        "/razorpay/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (verifyRes.data.success) {
                        onSuccess(response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Something went wrong");
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const createRazorpayOrder = async () => {
        try {
            const res = await http.post(
                "/razorpay/create-order",
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                loadRazorpay(res.data.order_id);
            } else {
                alert("Order creation failed");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <button className="btn btn-main w-100" onClick={createRazorpayOrder}>
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;