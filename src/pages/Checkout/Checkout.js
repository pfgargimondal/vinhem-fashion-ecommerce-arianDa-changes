import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./Css/Checkout.css";
import "swiper/css";
import RecentlyViewed from "../../hooks/RecentlyViewed";
import TrandingProduct from "../../hooks/TrandingProduct";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useCurrency } from "../../context/CurrencyContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

// ✅ NEW: PayPal button component
import RazorpayButton from "../../components/PaymentGateway/RazorpayButton";
import PayPalButton from "../../components/PaymentGateway/PayPalButton";
import { optimizeImage } from "../../utils/optimizeImage";


export const Checkout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [biToggle, setBiToggle] = useState(true);
  const [onChecked, setOnChecked] = useState(false);
  const { selectedCurrency } = useCurrency();
  const [couponItems, setcouponItems] = useState([]);
  const [cartItems, setcartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState([]);
  const { setCartCount } = useCart();
  const [selectedCoupon, setSelectedCoupon] = useState("");
  // eslint-disable-next-line
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // ------------------------------
  // Load coupons
  // ------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchCoupon = async () => {
      try {
        const res = await http.get("/user/get-all-coupon", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setcouponItems(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch coupon list", error);
      }
    };

    fetchCoupon();
  }, [token]);

  // ------------------------------
  // Helpers
  // ------------------------------
  const ValidityDate = (expiryDate) => {
    const date = new Date(expiryDate);
    const options = { month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}`;
  };

  const fetchCartProduct = useCallback(async () => {
    if (!token || !selectedCurrency) return;

    try {
      const res = await http.post(
        "/user/get-cart-allProduct",
        { country: selectedCurrency.country_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setcartItems(res.data.data || []);
      settotalPrice(res.data.total_cart_price || "");
    } catch (error) {
      console.error("Failed to fetch cart list", error);
    }
  }, [token, selectedCurrency]);

  useEffect(() => {
    fetchCartProduct();
  }, [fetchCartProduct]);

  const handleChecked = (e) => {
    setOnChecked(e.target.checked);
  };

  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!token) return;

    try {
      await http.post(
        "/user/remove-product-from-cart",
        { cart_item_id: cartItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove locally from state
      setcartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      fetchCartProduct();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [billing, setBilling] = useState({
    billingName: "",
    billingEmail: "",
    billingNumber: "",
    billingPinCode: "",
    billingCity: "",
    billingState: "",
    billingCountry: "",
    billingFullAddress: "",
  });

  const [shipping, setShipping] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingNumber: "",
    shippingPinCode: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "",
    shippingFullAddress: "",
  });

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Billing validation
    if (!billing.billingName.trim()) newErrors.billingName = "Full name is required";
    if (!billing.billingEmail.trim()) {
      newErrors.billingEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(billing.billingEmail)) {
      newErrors.billingEmail = "Email is invalid";
    }
    if (!billing.billingNumber.trim()) {
      newErrors.billingNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(billing.billingNumber)) {
      newErrors.billingNumber = "Phone number must be 10 digits";
    }
    if (!billing.billingPinCode.trim()) newErrors.billingPinCode = "Pincode is required";
    if (!billing.billingCity.trim()) newErrors.billingCity = "City is required";
    if (!billing.billingState.trim()) newErrors.billingState = "State is required";
    if (!billing.billingCountry.trim()) newErrors.billingCountry = "Country is required";
    if (!billing.billingFullAddress.trim()) newErrors.billingFullAddress = "Address is required";

    // Shipping validation if checked
    if (onChecked) {
      if (!shipping.shippingName.trim()) newErrors.shippingName = "Full name is required";
      if (!shipping.shippingEmail.trim()) {
        newErrors.shippingEmail = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(shipping.shippingEmail)) {
        newErrors.shippingEmail = "Email is invalid";
      }
      if (!shipping.shippingNumber.trim()) {
        newErrors.shippingNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(shipping.shippingNumber)) {
        newErrors.shippingNumber = "Phone number must be 10 digits";
      }
      if (!shipping.shippingPinCode.trim()) newErrors.shippingPinCode = "Pincode is required";
      if (!shipping.shippingCity.trim()) newErrors.shippingCity = "City is required";
      if (!shipping.shippingState.trim()) newErrors.shippingState = "State is required";
      if (!shipping.shippingCountry.trim()) newErrors.shippingCountry = "Country is required";
      if (!shipping.shippingFullAddress.trim()) newErrors.shippingFullAddress = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // ✅ Payable amount (for UI & PayPal)
  // PayPal expects a string number. We ensure 2-decimals.
  // ------------------------------
  const payableAmount = useMemo(() => {
    const total =
      Number(totalPrice?.total_selling_price || 0) +
      Number(totalPrice?.total_add_on_charges || 0) +
      Number(totalPrice?.shipping_charges || 0) -
      Number(appliedDiscount || 0);

    // Ensure not negative and 2 decimals as string
    return Math.max(total, 0).toFixed(2);
  }, [totalPrice, appliedDiscount]);

  // ------------------------------
  // ✅ Place Order (called directly for NON-PayPal; or after PayPal success)
  // If PayPal success: pass transaction id
  // ------------------------------
  const handlePlaceOrder = async (method = null, transactionId = null) => {

    // const finalPaymentMethod = paypalTransactionId ? "pay_pal" : paymentMethod;

    const finalPaymentMethod = method || paymentMethod;

    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix all the errors");
      return;
    }

    if (!paymentMethod && !method) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      const res = await http.post(
        "/user/placed-order",
        {
          billing,
          shipping: onChecked ? shipping : billing,
          payment_method: finalPaymentMethod,
          country: selectedCurrency.country_name,
          coupon_code: couponApplied ? selectedCoupon : null,
          coupon_discount: couponApplied ? appliedDiscount : 0,
          // ✅ NEW: include PayPal transaction id (if available)
          // paypal_transaction_id: paypalTransactionId,

          paypal_transaction_id:
          finalPaymentMethod === "pay_pal" ? transactionId : null,

        // ✅ Razorpay ID
          razorpay_payment_id:
          finalPaymentMethod === "razorpay" ? transactionId : null,

          // (Optional) include total amount you charged
          amount_payable: payableAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Order placed successfully!");

        setcartItems([]);
        setCartCount(0);

        setSelectedCoupon("");
        setSelectedDiscount(0);
        setAppliedDiscount(0);
        setCouponApplied(false);

        navigate("/thank-you");
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order failed", error);
      toast.error("Something went wrong while placing order");
    }
  };

  return (
    <div>
      <div className="cart-wrapper container-fluid py-4">
        <h2 className="chkout-heading text-center mb-3">ONE STEP CHECKOUT</h2>

        <div className="row justify-content-between">
          <div className="col-lg-7">
            <div className="diwebjrwert_left">
              <div className="djikewirwerwer">
                <div className="inmoijjrwerwe mb-4">
                  <div className="jbdjnewnllr d-flex align-items-center justify-content-between">
                    <h4 className="mb-3">Billing Information</h4>

                    <i
                      onClick={() => setBiToggle(!biToggle)}
                      className={`fa-solid ${!biToggle ? "fa-angle-down" : "fa-angle-up"}`}
                    ></i>
                  </div>

                  {biToggle && (
                    <div className="iudghweewr">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Recipients Name</label>

                          <input
                            type="text"
                            name="billingName"
                            value={billing.billingName}
                            onChange={handleBillingChange}
                            placeholder="Enter Full Name"
                            className={`form-control ${errors.billingName ? "is-invalid" : ""}`}
                          />
                          {errors.billingName && <div className="invalid-feedback">{errors.billingName}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email</label>

                          <input
                            type="email"
                            name="billingEmail"
                            value={billing.billingEmail}
                            onChange={handleBillingChange}
                            placeholder="Enter Email"
                            className={`form-control ${errors.billingEmail ? "is-invalid" : ""}`}
                          />
                          {errors.billingEmail && <div className="invalid-feedback">{errors.billingEmail}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>

                          <input
                            type="text"
                            className={`form-control ${errors.billingNumber ? "is-invalid" : ""}`}
                            name="billingNumber"
                            value={billing.billingNumber}
                            onChange={handleBillingChange}
                            maxLength={10}
                            placeholder="Enter Phone Number"
                          />
                          {errors.billingNumber && <div className="invalid-feedback">{errors.billingNumber}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Pincode</label>

                          <input
                            type="text"
                            className={`form-control ${errors.billingPinCode ? "is-invalid" : ""}`}
                            name="billingPinCode"
                            value={billing.billingPinCode}
                            onChange={handleBillingChange}
                            maxLength={6}
                            placeholder="Enter Pin Code"
                          />
                          {errors.billingPinCode && <div className="invalid-feedback">{errors.billingPinCode}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">City</label>

                          <input
                            type="text"
                            className={`form-control ${errors.billingCity ? "is-invalid" : ""}`}
                            name="billingCity"
                            value={billing.billingCity}
                            onChange={handleBillingChange}
                            placeholder="Enter City"
                          />
                          {errors.billingCity && <div className="invalid-feedback">{errors.billingCity}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">State</label>

                          <input
                            type="text"
                            className={`form-control ${errors.billingState ? "is-invalid" : ""}`}
                            name="billingState"
                            value={billing.billingState}
                            onChange={handleBillingChange}
                            placeholder="Enter State"
                          />
                          {errors.billingState && <div className="invalid-feedback">{errors.billingState}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Country</label>

                          <input
                            type="text"
                            className={`form-control ${errors.billingCountry ? "is-invalid" : ""}`}
                            name="billingCountry"
                            value={billing.billingCountry}
                            onChange={handleBillingChange}
                            placeholder="Enter Country"
                          />
                          {errors.billingCountry && <div className="invalid-feedback">{errors.billingCountry}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Full Address</label>

                          <textarea
                            className={`form-control ${errors.billingFullAddress ? "is-invalid" : ""}`}
                            name="billingFullAddress"
                            value={billing.billingFullAddress}
                            onChange={handleBillingChange}
                            placeholder="Enter Address"
                          ></textarea>
                          {errors.billingFullAddress && (
                            <div className="invalid-feedback">{errors.billingFullAddress}</div>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <div className="inmoijjrwerwe dfghbefestewerr mb-4">
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input ihdinwehwwwee"
                      onChange={handleChecked}
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />

                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      <h6 className="mb-0">Check if shipping address is different</h6>
                    </label>
                  </div>

                  {onChecked && (
                    <div className="iudghweewr">
                      <h4 className="mb-3 text-uppercase">Shipping Details</h4>

                      <form>
                        <div className="mb-3">
                          <label className="form-label">Recipients Name</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingName ? "is-invalid" : ""}`}
                            name="shippingName"
                            value={shipping.shippingName}
                            onChange={handleShippingChange}
                            placeholder="Enter Full Name"
                          />
                          {errors.shippingName && <div className="invalid-feedback">{errors.shippingName}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Email</label>

                          <input
                            type="email"
                            className={`form-control ${errors.shippingEmail ? "is-invalid" : ""}`}
                            name="shippingEmail"
                            value={shipping.shippingEmail}
                            onChange={handleShippingChange}
                            placeholder="Enter Email"
                          />
                          {errors.shippingEmail && <div className="invalid-feedback">{errors.shippingEmail}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingNumber ? "is-invalid" : ""}`}
                            name="shippingNumber"
                            value={shipping.shippingNumber}
                            onChange={handleShippingChange}
                            maxLength={10}
                            placeholder="Enter Phone Number"
                          />
                          {errors.shippingNumber && <div className="invalid-feedback">{errors.shippingNumber}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Pincode</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingPinCode ? "is-invalid" : ""}`}
                            name="shippingPinCode"
                            value={shipping.shippingPinCode}
                            onChange={handleShippingChange}
                            maxLength={6}
                            placeholder="Enter Pin Code"
                          />
                          {errors.shippingPinCode && <div className="invalid-feedback">{errors.shippingPinCode}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">City</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingCity ? "is-invalid" : ""}`}
                            name="shippingCity"
                            value={shipping.shippingCity}
                            onChange={handleShippingChange}
                            placeholder="Enter City"
                          />
                          {errors.shippingCity && <div className="invalid-feedback">{errors.shippingCity}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">State</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingState ? "is-invalid" : ""}`}
                            name="shippingState"
                            value={shipping.shippingState}
                            onChange={handleShippingChange}
                            placeholder="Enter State"
                          />
                          {errors.shippingState && <div className="invalid-feedback">{errors.shippingState}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Country</label>

                          <input
                            type="text"
                            className={`form-control ${errors.shippingCountry ? "is-invalid" : ""}`}
                            name="shippingCountry"
                            value={shipping.shippingCountry}
                            onChange={handleShippingChange}
                            placeholder="Enter Country"
                          />
                          {errors.shippingCountry && <div className="invalid-feedback">{errors.shippingCountry}</div>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Full Address</label>

                          <textarea
                            className={`form-control ${errors.shippingFullAddress ? "is-invalid" : ""}`}
                            name="shippingFullAddress"
                            value={shipping.shippingFullAddress}
                            onChange={handleShippingChange}
                            placeholder="Enter Address"
                          ></textarea>
                          {errors.shippingFullAddress && (
                            <div className="invalid-feedback">{errors.shippingFullAddress}</div>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* ------------------------------ */}
              {/* Payment Methods */}
              {/* ------------------------------ */}
              <div className="omweojuirhwerrr pt-4">
                <h4 className="mb-3">SELECT PAYMENT METHOD</h4>

                <div className="doiweuijrwerwer">
                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-26sda">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-26sda"
                          type="radio"
                          name="payment_method"
                          value="upi"
                          checked={paymentMethod === "upi"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <div className="ms-2">
                          <span className="title">UPI (Gpay, PhonePe, Paytm etc)</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-26sweda">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-26sweda"
                          type="radio"
                          name="payment_method"
                          value="credit_card"
                          checked={paymentMethod === "credit_card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Credit Card</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-sdsd">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-sdsd"
                          type="radio"
                          name="payment_method"
                          value="debit_card"
                          checked={paymentMethod === "debit_card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Debit Card</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-sddsw">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-sddsw"
                          type="radio"
                          name="payment_method"
                          value="net_banking"
                          checked={paymentMethod === "net_banking"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Netbanking</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-sader">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-sader"
                          type="radio"
                          name="payment_method"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Razor Pay</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-rerr">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-rerr"
                          type="radio"
                          name="payment_method"
                          value="pay_pal"
                          checked={paymentMethod === "pay_pal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Pay Pal</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="radio-wrapper-26 mb-3">
                    <label htmlFor="example-rerrfdbv">
                      <div className="inputAndLeftText d-flex">
                        <input
                          id="example-rerrfdbv"
                          type="radio"
                          name="payment_method"
                          value="cash_on_delivery"
                          checked={paymentMethod === "cash_on_delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        <div className="ms-2">
                          <span className="title">Cash On Delivery</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ✅ Terms & Conditions */}
                <div className="dfiwehrwerwe mb-5">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultValue="" id="flexCheckDefasadsult" />

                    <label className="form-check-label" htmlFor="flexCheckDefasadsult">
                      I agree to the terms and conditions (read T&C)
                    </label>
                  </div>
                </div>

                {/* ✅ PayPal button shows ONLY when PayPal is selected */}
                {/* {paymentMethod === "pay_pal" && cartItems?.length > 0 && (
                  <div className="my-3">
                    <PayPalButton
                      amount={payableAmount} // string with 2-decimals
                      token={token}
                      onSuccess={(transactionId) => handlePlaceOrder(transactionId)}
                    />
                  </div>
                )} */}
              </div>

              {/* Footer actions (Back / Continue) */}
              <div className="uiwdhiwerwerwer d-flex align-items-center justify-content-between aksbdjbererre dojweirkwejirwer">
                <Link to={"/cart"}>
                  <button className="btn px-3 me-2 btn-main">
                    <i className="fa-solid me-1 fa-arrow-left"></i> Back To Cart
                  </button>
                </Link>
                <Link to={"/all-products"}>
                  <button className="btn px-3 btn-main">Continue Shopping</button>
                </Link>
              </div>

              <div className="dweihriwerwerw mt-4">
                <p className="mb-1">*Once your order has been placed no subsequent changes can be made in it.</p>

                <p className="mb-1">*Shipping cost may vary depending on the delivery destination.</p>

                <p className="mb-1">*Please check the final amount on the order summary page before completing the payment.</p>

                <p className="mb-1">*An item's price may vary according to the size selected.</p>

                <ul className="mb-0 ps-0">
                  <li>
                    <Link to="/shipping-policy">Shipping Policy</Link>
                  </li>

                  <li>
                    <Link to="/">Help</Link>
                  </li>

                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-5">
            <div className="diwebjrwert_right sticky-top">
              <div className="oiasmdjweijrwerwer">
                <h4>Coupon Code</h4>

                {couponItems?.map((couponItemsVal) => (
                  <div className="jidnwenjrwerwer mb-3" key={couponItemsVal.code}>
                    <input
                      id={couponItemsVal.code}
                      name="coupon"
                      type="radio"
                      className="d-none position-absolute"
                      checked={selectedCoupon === couponItemsVal.code}
                      disabled={couponApplied}
                      onChange={() => {
                        setSelectedCoupon(couponItemsVal.code);
                        setSelectedDiscount(parseInt(couponItemsVal.value));
                        setAppliedDiscount(parseInt(couponItemsVal.value));
                      }}
                    />

                    <label htmlFor={couponItemsVal.code} className="w-100 position-relative">
                      <div className="coupon">
                        <div className="left">
                          <div>Coupon</div>
                        </div>

                        <div className="center">
                          <div>
                            <h3>Get Extra</h3>

                            <h2 className="mb-0">
                              <i className="bi bi-currency-rupee"></i>
                              {parseInt(couponItemsVal.value)} OFF
                            </h2>

                            <small>Valid until {ValidityDate(couponItemsVal.expiry_date)}</small>
                          </div>
                        </div>

                        <div className="right">
                          <div>{couponItemsVal.code}</div>
                        </div>
                      </div>

                      <i className="bi copn-checked-icon position-absolute bi-check-circle-fill"></i>
                    </label>
                  </div>
                ))}

                <div className="dewuihrwe position-relative mt-4">
                  <input
                    type="text"
                    name="coupon_code"
                    className="form-control"
                    placeholder="Enter Coupon Code"
                    value={selectedCoupon}
                    onChange={(e) => {
                      setSelectedCoupon(e.target.value);

                      const coupon = couponItems.find((c) => c.code === e.target.value);
                      if (coupon) {
                        setSelectedDiscount(parseInt(coupon.value));
                        setAppliedDiscount(parseInt(coupon.value));
                      } else {
                        setSelectedDiscount(0);
                        setAppliedDiscount(0);
                      }
                    }}
                    disabled={couponApplied}
                  />

                  {!couponApplied ? (
                    <button
                      type="button"
                      className="btn position-absolute btn-main"
                      onClick={() => setCouponApplied(true)}
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn position-absolute btn-main"
                      onClick={() => {
                        setSelectedCoupon("");
                        setSelectedDiscount(0);
                        setAppliedDiscount(0);
                        setCouponApplied(false);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4 mb-3 align-items-center">
                <h4 className="mb-0">
                  Order Details - <span>{cartItems?.length} Item(s)</span>
                </h4>

                <i className="fa-solid fa-angle-up"></i>
              </div>

              {cartItems?.map((cartItemsVal) => (
                <div className="doiwehirhweker p-2" key={cartItemsVal.id}>
                  <Link to={`/products/${cartItemsVal.slug}-${cartItemsVal.PID}`}>
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="idjkewerr_left">
                          <img src={optimizeImage(cartItemsVal.encoded_image_url_1)} alt="" />
                        </div>
                      </div>

                      <div className="col-lg-9">
                        <div className="idjkewerr_right">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h4 className="mb-0">{cartItemsVal.designer}</h4>

                            <div className="asojerdmjer">
                              <i
                                onClick={() => toggleWishlist(cartItemsVal.PID)}
                                className={
                                  wishlistIds.includes(cartItemsVal.PID)
                                    ? "fa-solid me-3 fa-heart"
                                    : "fa-regular me-3 fa-heart"
                                }
                                style={{ cursor: "pointer" }}
                              ></i>

                              <i
                                className="fa-regular me-3 fa-trash-can"
                                onClick={() => handleRemoveItem(cartItemsVal.id)}
                              ></i>
                            </div>
                          </div>

                          <p className="mb-1">{cartItemsVal.product_name}</p>

                          <div className="d-flex align-items-center">
                            <p className="mb-1">
                              Color: <span>{cartItemsVal.color}</span>
                            </p>
                            &nbsp;&nbsp;&nbsp;
                            <p className="mb-1">
                              {" "}
                              Size: <span>{cartItemsVal.size}</span>
                            </p>
                          </div>

                          <p className="mb-1">
                            Price:{" "}
                            <span>
                              <i className="fa-solid fa-indian-rupee-sign"></i> {cartItemsVal.actual_price}
                            </span>
                          </p>

                          <p>
                            <i className="bi me-1 bi-truck"></i>
                            {cartItemsVal?.non_returnable}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              <div className="dweoihrwerwer sdverewerrr p-2 my-4">
                <h4 className="mb-2 pb-2">Price Details</h4>

                <Table responsive>
                  <tbody>
                    <tr>
                      <td>Bag Total</td>

                      <td>
                        <i className="bi bi-currency-rupee"></i>
                        {totalPrice.total_selling_price}
                      </td>
                    </tr>

                    <tr>
                      <td>Add On Charges</td>

                      <td>
                        <i className="bi bi-currency-rupee"></i>
                        {totalPrice.total_add_on_charges}
                      </td>
                    </tr>

                    <tr>
                      <td>Shipping Charges</td>

                      <td>
                        <i className="bi bi-currency-rupee"></i>
                        {totalPrice.shipping_charges}
                      </td>
                    </tr>

                    {appliedDiscount > 0 && (
                      <tr>
                        <td className="sjkdrvgnhbjkdf">Coupon Discount</td>

                        <td className="sjkdrvgnhbjkdf">
                          {" "}
                          (-) <i className="bi bi-currency-rupee"></i>
                          {appliedDiscount}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div className="sfdvsrfewewerer">
                  <div className="oiasmdjweijrwerwer pt-2 cvsdfeerrr mb-2 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                    <h4 className="mb-0">TOTAL PAYABLE</h4>

                    <h4 className="mb-0">
                      <i className="bi bi-currency-rupee"></i>
                      {payableAmount}
                    </h4>
                  </div>

                  <div className="oiasmdjweijrwerwer fsdgwederetert pt-2 fdgreerewwr mb-2 d-flex align-items-center justify-content-between zsdvfdesdeadfrer">
                    <h4 className="mb-0">YOUR TOTAL SAVINGS</h4>

                    <h4 className="mb-0">
                      <i className="bi bi-currency-rupee"></i>
                      {Number(totalPrice.total_discount_price || 0) + Number(appliedDiscount || 0)}
                    </h4>
                  </div>
                </div>
              </div>

              {/* ✅ For NON-PayPal methods, show the Place Order button */}
              
                <div className="fregrwrget">
                {cartItems?.length > 0 && (
                <>
                    {paymentMethod === "pay_pal" && (
                    <div className="my-3">
                        <PayPalButton
                          amount={
                              (Number(totalPrice.total_selling_price) +
                              Number(totalPrice.total_add_on_charges) +
                              Number(totalPrice.shipping_charges)) - appliedDiscount
                          }
                          token={token}
                          onSuccess={(transactionId) => handlePlaceOrder("pay_pal", transactionId)}
                        />
                    </div>
                    )}

                    {paymentMethod === "razorpay" && (
                      <div className="my-3">
                        <RazorpayButton
                            amount={(Number(totalPrice.total_selling_price) +
                                    Number(totalPrice.total_add_on_charges) +
                                    Number(totalPrice.shipping_charges)) - appliedDiscount}
                            token={token}
                            onSuccess={(paymentId) => handlePlaceOrder("razorpay", paymentId)}
                        />
                      </div>
                    )}

                    {/* Hide Place Order button for PayPal (optional) */}
                    {paymentMethod === "cash_on_delivery" && (
                      <div className="my-3">
                        <button
                            className="btn btn-main w-100 mb-3"
                            onClick={() => handlePlaceOrder("cash_on_delivery")}
                        >
                            Place Order
                        </button>
                      </div>
                    )}
                </>
                )}
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="diweurbhwer_inner container-fluid mt-4">
          <TrandingProduct />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="diweurbhwer_inner container-fluid mt-4">
          <RecentlyViewed />
        </div>
      </div>

    </div>
  );
};

export default Checkout;
