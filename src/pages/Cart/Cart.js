import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./Css/Cart.css";
import "swiper/css";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useWishlist } from "../../context/WishlistContext";
import TrandingProduct from "../../hooks/TrandingProduct";
import { useCurrency } from "../../context/CurrencyContext";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ShippingAddress } from "./Components/ShippingAddress";
import { useCart } from "../../context/CartContext";
import { BillingAddress } from "./Components/BillingAddress";
import { placeOrderAPI } from "../../api/order";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";


export const Cart = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { user } = useAuth();

  const [gstNumber, setGstNumber] = useState("");
  const [gstSaved, setGstSaved] = useState(false);
  const [gstError, setGstError] = useState("");

  const [cartItems, setcartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState([]);
    // eslint-disable-next-line
  const [productCoupon, setproductCoupon] = useState([]);
  const [shippingCountry, setShippingCountry] = useState([]);
  const [couponItems, setcouponItems] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  // eslint-disable-next-line
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [key, setKey] = useState('cart');
  const [couponModal, setCouponModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [billingAddressModal, setBillingAddressModal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { setCartCount } = useCart();
  const { resetCart } = useCart();
  const { formatPrice } = useCurrency();
  const [hideDBAddress, setHideDBAddress] = useState(false);
  // eslint-disable-next-line
  const [hideDBBillingAddress, setHideDBBillingAddress] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [isGift, setIsGift] = useState(false);
  const [pymntSmmryDrpdwn, setPymntSmmryDrpdwn] = useState(true);
  const [pageMetaData, setPageMetaData] = useState([]);
                        
  const pathName = useLocation().pathname;

  console.log(selectedDiscount, 'selectedDiscount');
  // console.log(localStorage.getItem("selectedCurrency"), 'selectedCurrency');

  const fetchCartlist = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await http.post(
        "/user/get-cart-user",
        // { country: selectedCurrency.country_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setcartItems(res.data.data || []);
      settotalPrice(res.data.total_cart_price || "");
      setproductCoupon(res.data.all_productCoupon || []);
      setShippingCountry(res.data.shipping_country || []);
    } catch (error) {
      console.error("Failed to fetch cart list", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCartlist();
  }, [fetchCartlist]);

  const getShippingCharge = useCallback((countryName, weight) => {
    const selected = shippingCountry.find(
      (item) => item.country_name === countryName
    );

    if (!selected) return 0;

    let charge;

    if (weight <= 999) {
      charge = selected["0_999gms"];
    } else if (weight <= 5000) {
      charge = selected["1000_5000gms"];
    } else {
      charge = selected["5000_plus"];
    }

    // Normalize
    if (typeof charge === "string" && charge.toLowerCase().includes("free")) {
      return 0;
    }

    return Number(charge) || 0;
  }, [shippingCountry]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const fetchCoupon = async () => {
      try {
        const res = await http.get("/user/get-all-coupon", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setcouponItems(res.data.data || []);
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
      } catch (error) {
        console.error("Failed to fetch cart list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [token]);

  const matchedMeta = pageMetaData.find((item) => {
      const slug = item.page_name
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

      return `/${slug}` === pathName;
  });

  useMetaData({
      meta_title: matchedMeta?.meta_title || "Vinhem Fashion",
      meta_description: matchedMeta?.meta_description || "",
      meta_keyword: matchedMeta?.meta_keyword || ""
  });

  const getEstimatedShippingDate = (shipping_time) => {
    if (!shipping_time) return "";

    const timeStr = shipping_time.toString().toLowerCase().trim();
    const now = new Date();

    let days = 0;
    let hours = 0;

    // Detect if time is in hours or days
    if (timeStr.includes("hour") || timeStr.includes("hr") || timeStr.includes("h")) {
      const hourVal = parseInt(timeStr);
      if (!isNaN(hourVal)) hours = hourVal;
    } else if (timeStr.includes("day") || timeStr.includes("d")) {
      const dayVal = parseInt(timeStr);
      if (!isNaN(dayVal)) days = dayVal;
    } else {
      // Default to days if unit is missing
      const val = parseInt(timeStr);
      if (!isNaN(val)) days = val;
    }

    // Add time
    now.setDate(now.getDate() + days);
    now.setHours(now.getHours() + hours);

    // Format date nicely
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();


    return ` ${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  // Helper for suffix
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ValidityDate = (expiryDate) => {
    const date = new Date(expiryDate);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate}`;
  };
  const { loading: wishlistLoading, wishlistIds, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ from context

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!token) return;
    setLoading(true);
    try {
      await http.post(
        "/user/remove-product-from-cart",
        { cart_item_id: cartItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove locally from state
      setcartItems((prev) => {
        const updated = prev.filter((item) => item.id !== cartItemId);
        setCartCount(updated.length);   // update count correctly
        return updated;
      });
      fetchCartlist();
    } catch (error) {
      console.error("Failed to remove item", error);
    } finally {
      setLoading(false);
    }
  };


  const handleProceed = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setKey("shipping");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCheckoutPayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true); 

    try {
      let shippingData = localStorage.getItem("shipping_address");
      let billingData = localStorage.getItem("billing_address");

      try {
        shippingData = shippingData ? JSON.parse(shippingData) : null;
      } catch {
        shippingData = null;
      }

      try {
        billingData = billingData ? JSON.parse(billingData) : null;
      } catch {
        billingData = null;
      }

      if (!shippingData || Object.keys(shippingData).length === 0) {
        toast.error("Please Add Shipping Address Before Checkout");
        setLoading(false);
        return;
      }
      if (!billingData || Object.keys(billingData).length === 0) {
        toast.error("Please Add Billing Address Before Checkout");
        setLoading(false); 
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setKey("payment");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCart = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setKey("cart");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCouponToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setCouponModal(!couponModal);
  };
  const handleCouponClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setCouponModal(false);
  };
  const handleAddressToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setAddressModal(!addressModal);
  };
  const handleAddressClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setAddressModal(false);
  };
  const handleBillingAddressToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setBillingAddressModal(!billingAddressModal);
  };
  const handleBillingAddressClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setBillingAddressModal(false);
  };

  const [previousAddress, setPreviousAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isMobileInvalid, setIsMobileInvalid] = useState(false);
  const [errors, setErrors] = useState({});

  const [activeDropdown, setActiveDropdown] = useState(null);
  const countryOptions = useMemo(() => {
    return shippingCountry.map((item) => item.country_name);
  }, [shippingCountry]);


  // -------------------------------
  // 1️⃣ SHIPPING DATA STATE
  // -------------------------------
  const [shippingData, setShippingData] = useState({
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_country: "India",
    shipping_pincode: "",
    shipping_aptNo: "",
    shipping_street_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_landmark: "",
    shipping_mobileCode: "+91",
    shipping_mobile_number: "",
    shipping_email: "",
    shipping_address_as: "",
    shipping_default_addrss: false,
  });

  // -------------------------------
  // 2️⃣ FORMAT DATA (for UI)
  // -------------------------------
  const formatShippingAddress = (data) => ({
    shippingName: `${data.shipping_first_name} ${data.shipping_last_name}`,
    shippingFullAddress: `${data.shipping_aptNo}, ${data.shipping_street_address}`,
    shippingCity: data.shipping_city,
    shippingPinCode: data.shipping_pincode,
    shippingState: data.shipping_state,
    shippingLandmark: data.shipping_landmark,
    shippingCountry: data.shipping_country,
    shippingNumber: `${data.shipping_mobileCode} ${data.shipping_mobile_number}`,
    shippingEmail: data.shipping_email,
    shippingAddressAs: data.shipping_address_as,
  });

  useEffect(() => {
    if (!token) return;
    setLoading(true); 
    const fetchPreviousAddress = async () => {
      try {
        const res = await http.get("/user/get-previous-address", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData = res.data.data;

        if (apiData) {
          // eslint-disable-next-line
          // const formatted = formatShippingAddress(apiData);
          setPreviousAddress(apiData);
          // setShippingAddress(apiData);

          // setBillingAddress(apiData); // billing from database
          // setSameAsShipping(false);

          // localStorage.setItem("shipping_address", JSON.stringify(apiData));
          // localStorage.setItem("billing_address", JSON.stringify(apiData));

          const charge = getShippingCharge(
            apiData.shippingCountry,
            totalPrice?.cart_totalWeight
          );
          setShippingCharge(charge);

          if(freeShipping){
            localStorage.setItem("shipping_charge", 0);
          }else{
            localStorage.setItem("shipping_charge", charge);
          }

          const formattedShipping = formatShippingAddress(apiData);
          const formattedBilling = formatBillingAddress(apiData);

          setShippingAddress(apiData);
          setBillingAddress(apiData);

          localStorage.setItem("shipping_address", JSON.stringify(apiData));
          localStorage.setItem("billing_address", JSON.stringify(apiData));

          // ✅ AUTO CHECK SAME AS SHIPPING
          const same = isSameAddress(formattedShipping, formattedBilling);
          setSameAsShipping(same);
          

        }
      } catch (error) {
        console.error("Failed to fetch address", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchPreviousAddress();
  }, [token,getShippingCharge,totalPrice?.cart_totalWeight, freeShipping]);

  // console.log(previousAddress, 'previousAddress');
  // console.log(shippingCharge, 'shippingCharge');

  const isSameAddress = (shipping, billing) => {
    if (!shipping || !billing) return false;

    return (
      shipping.shippingName === billing.shippingName &&
      shipping.shippingFullAddress === billing.shippingFullAddress &&
      shipping.shippingCity === billing.shippingCity &&
      shipping.shippingPinCode === billing.shippingPinCode &&
      shipping.shippingState === billing.shippingState &&
      shipping.shippingCountry === billing.shippingCountry &&
      shipping.shippingNumber === billing.shippingNumber &&
      shipping.shippingEmail === billing.shippingEmail
    );
  };

  useEffect(() => {
    if (sameAsShipping && shippingAddress) {
      setBillingAddress(shippingAddress);
      localStorage.setItem(
        "billing_address",
        JSON.stringify(shippingAddress)
      );
    }
  }, [shippingAddress, sameAsShipping]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === "shipping_mobile_number") {
      newValue = value.replace(/\D/g, "");

      newValue = newValue.slice(0, 10);
    }

    if (name === "shipping_pincode") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    setShippingData({
      ...shippingData,
      [name]: type === "checkbox" ? checked : newValue,
    });

    if (name === "shipping_country") {
      const charge = getShippingCharge(value, totalPrice.cart_totalWeight);
      setShippingCharge(charge);

      if(freeShipping){
        localStorage.setItem("shipping_charge", 0);
      }else{
        localStorage.setItem("shipping_charge", charge);
      }
    }

  };

  useEffect(() => {
    const savedCharge = localStorage.getItem("shipping_charge");
    if (savedCharge) {
      setShippingCharge(savedCharge);
    }
  }, []);

  const handleInvalidMobile = (invalid) => {
    setIsMobileInvalid(invalid);
  };


  const validateForm = () => {
    let newErrors = {};

    if (!shippingData.shipping_first_name.trim())
      newErrors.shipping_first_name = "First name is required";

    if (!shippingData.shipping_last_name.trim())
      newErrors.shipping_last_name = "Last name is required";

    if (!shippingData.shipping_pincode.trim())
      newErrors.shipping_pincode = "Pin code is required";

    if (!shippingData.shipping_aptNo.trim())
      newErrors.shipping_aptNo = "Apt / Building is required";

    if (!shippingData.shipping_street_address.trim())
      newErrors.shipping_street_address = "Street address is required";

    if (!shippingData.shipping_city.trim())
      newErrors.shipping_city = "City is required";

    if (!shippingData.shipping_state.trim())
      newErrors.shipping_state = "State is required";

    if (!shippingData.shipping_landmark.trim())
      newErrors.shipping_landmark = "Landmark is required";

    if (!shippingData.shipping_address_as)
      newErrors.shipping_address_as = "Select address type";

    if (!shippingData.shipping_mobile_number.trim()) {
      newErrors.shipping_mobile_number = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(shippingData.shipping_mobile_number)) {
      newErrors.shipping_mobile_number = "Mobile number must be 10 digits";
    }

    if (!shippingData.shipping_email.trim()) {
      newErrors.shipping_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.shipping_email)) {
      newErrors.shipping_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // 6️⃣ SAVE SHIPPING ADDRESS
  // -------------------------------
  const handleSaveShipping = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formatted = formatShippingAddress(shippingData);
    localStorage.setItem("shipping_address", JSON.stringify(formatted));
    setShippingAddress(formatted);
    handleAddressClose();
  };

  // -------------------------------
  // 7️⃣ LOAD SAVED ADDRESS FROM LOCALSTORAGE
  // -------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("shipping_address");
    if (saved) {
      setShippingAddress(JSON.parse(saved));
    }
  }, []);

  const handleRemoveAddress = () => {
    localStorage.removeItem("shipping_address");
    setShippingAddress(null);
    setHideDBAddress(true);    
  };

  const handleEditAddress = () => {
  if (!shippingAddress) return;

  setShippingData({
      shipping_first_name: shippingAddress.shippingName.split(" ")[0] || "",
      shipping_last_name: shippingAddress.shippingName.split(" ")[1] || "",
      shipping_country: shippingAddress.shippingCountry,
      shipping_pincode: shippingAddress.shippingPinCode,
      shipping_aptNo: shippingAddress.shippingFullAddress.split(",")[0] || "",
      shipping_street_address: shippingAddress.shippingFullAddress.split(",")[1] || "",
      shipping_city: shippingAddress.shippingCity,
      shipping_landmark: shippingAddress.shippingLandmark,
      shipping_state: shippingAddress.shippingState,
      shipping_mobileCode: shippingAddress.shippingNumber.split(" ")[0],
      shipping_mobile_number: shippingAddress.shippingNumber.split(" ")[1],
      shipping_email: shippingAddress.shippingEmail,
      shipping_address_as: "HOME",
    });

    // Open the modal
    handleAddressToggle();
  };


  // Billing Data Store start

  const [billingData, setBillingData] = useState({
    billing_first_name: "",
    billing_last_name: "",
    billing_country: "India",
    billing_pincode: "",
    billing_aptNo: "",
    billing_street_address: "",
    billing_city: "",
    billing_state: "",
    billing_landmark: "",
    billing_mobileCode: "+91",
    billing_mobile_number: "",
    billing_email: "",
    billing_address_as: "",
  });


  const formatBillingAddress = (data) => {
    return {
      shippingName: `${data.billing_first_name} ${data.billing_last_name}`,
      shippingFullAddress: `${data.billing_aptNo}, ${data.billing_street_address}`,
      shippingCity: data.billing_city,
      shippingPinCode: data.billing_pincode,
      shippingState: data.billing_state,
      shippingLandmark: data.billing_landmark,
      shippingCountry: data.billing_country,
      shippingNumber: `${data.billing_mobileCode} ${data.billing_mobile_number}`,
      shippingEmail: data.billing_email,
      shippingAddressAs: data.billing_address_as,
    };
  };

  const handleInputChangeBilling = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === "billing_mobile_number") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "billing_pincode") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    setBillingData({
      ...billingData,
      [name]: type === "checkbox" ? checked : newValue,
    });
  };


  const validateFormBilling = () => {
    let newErrors = {};

    if (!billingData.billing_first_name.trim())
      newErrors.billing_first_name = "First name is required";

    if (!billingData.billing_last_name.trim())
      newErrors.billing_last_name = "Last name is required";

    if (!billingData.billing_pincode.trim())
      newErrors.billing_pincode = "Pin code is required";

    if (!billingData.billing_aptNo.trim())
      newErrors.billing_aptNo = "Apt / Building is required";

    if (!billingData.billing_street_address.trim())
      newErrors.billing_street_address = "Street address is required";

    if (!billingData.billing_city.trim())
      newErrors.billing_city = "City is required";

    if (!billingData.billing_state.trim())
      newErrors.billing_state = "State is required";

    if (!billingData.billing_landmark.trim())
      newErrors.billing_landmark = "Landmark is required";

    if (!billingData.billing_address_as)
      newErrors.billing_address_as = "Select address type";

    if (!billingData.billing_mobile_number.trim()) {
      newErrors.billing_mobile_number = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(billingData.billing_mobile_number)) {
      newErrors.billing_mobile_number = "Mobile number must be 10 digits";
    }

    if (!billingData.billing_email.trim()) {
      newErrors.billing_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.billing_email)) {
      newErrors.billing_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSaveBilling = (e) => {
    e.preventDefault();

    if (!validateFormBilling()) return;

    const formatted = formatBillingAddress(billingData);
    localStorage.setItem("billing_address", JSON.stringify(formatted));
    setBillingAddress(formatted);
    handleBillingAddressClose();
 }

  useEffect(() => {
    const saved = localStorage.getItem("billing_address");
    if (saved) {
      setBillingAddress(JSON.parse(saved));
    }
  }, []);

  const handleEditBillingAddress = () => {
    if (!billingAddress) return;

    setBillingData({
        billing_first_name: billingAddress.shippingName.split(" ")[0] || "",
        billing_last_name: billingAddress.shippingName.split(" ")[1] || "",
        billing_country: billingAddress.shippingCountry,
        billing_pincode: billingAddress.shippingPinCode,
        billing_aptNo: billingAddress.shippingFullAddress.split(",")[0] || "",
        billing_street_address: billingAddress.shippingFullAddress.split(",")[1] || "",
        billing_city: billingAddress.shippingCity,
        billing_state: billingAddress.shippingState,
        billing_landmark: billingAddress.shippingLandmark,
        billing_mobileCode: billingAddress.shippingNumber.split(" ")[0],
        billing_mobile_number: billingAddress.shippingNumber.split(" ")[1],
        billing_email: billingAddress.shippingEmail,
        billing_address_as: billingAddress.shippingAddressAs,
    });

    handleBillingAddressToggle();
  };

  const handleRemoveBillingAddress = () => {
    localStorage.removeItem("billing_address");
    setBillingAddress(null); 
    setHideDBBillingAddress(true);
  };

  const validateGST = (gst) => {
    const regex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    return regex.test(gst);
  };

  useEffect(() => {
    const savedGst = localStorage.getItem("gst_number");

    if (savedGst) {
      setGstNumber(savedGst);
      setGstSaved(true);
    }
  }, []);

  const saveGstNumber = async () => {
    if (!gstNumber.trim()) {
      setGstError("GST number is required");
      return;
    }

    if (!validateGST(gstNumber)) {
      setGstError("Invalid GST number");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("gst_number", gstNumber);
      setGstError("");
      setGstSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  // const finalTotal =
  // (
  //   (Number(totalPrice.total_selling_price) - appliedDiscount)+ 
  //   Number(totalPrice.total_add_on_charges) + 
  //   Number(totalPrice.custom_fit_charges) + 
  //   Number(totalPrice.stiching_charges) + 
  //   Number(shippingCharge));

    const baseTotal =
    Number(totalPrice.total_selling_price) +
    Number(totalPrice.total_add_on_charges) +
    Number(totalPrice.custom_fit_charges) +
    Number(totalPrice.stiching_charges);

    
    const finalTotal = freeShipping
    ? Number(baseTotal || 0) - Number(appliedDiscount || 0)
    : Number(baseTotal || 0) + Number(shippingCharge || 0) - Number(appliedDiscount || 0);

    localStorage.setItem("final_total", finalTotal);
    localStorage.setItem("coupon_code", couponApplied ? selectedCoupon : null);
    localStorage.setItem("coupon_discount", couponApplied ? appliedDiscount : 0);
    

    const countryData = JSON.parse(localStorage.getItem("selectedCurrency"));
    const country = countryData?.country_name;
    const currency_code = countryData?.currency_code;

    useEffect(() => {
      const savedGift = localStorage.getItem("is_gift");
      if (savedGift) setIsGift(savedGift === "true");
    }, []);

    useEffect(() => {
      localStorage.setItem("is_gift", isGift);
    }, [isGift]);


  const handlePaymentFlow = async () => {
    if (paymentMethod === "cash_on_delivery") {
      return handlePlacedOrder("cash_on_delivery");
    }

    if (paymentMethod === "pay_pal") {
      return createPayPalOrder();
    }

    if (paymentMethod === "razorpay") {
      return createRazorpayOrder(paymentMethod);
    }

    if (paymentMethod === "upi") {
      return createRazorpayOrder(paymentMethod);
    }

    if (paymentMethod === "credit_card") {
      return createRazorpayOrder(paymentMethod);
    }

    if (paymentMethod === "debit_card") {
      return createRazorpayOrder(paymentMethod);
    }

    if (paymentMethod === "net_banking") {
      return createRazorpayOrder(paymentMethod);
    }




  };

  const createPayPalOrder = async () => {

    try {
      setLoading(true); 
      const rawAmount = Number(finalTotal) || 0;
      const amountForPayPal = rawAmount.toFixed(2);

      const res = await http.post("/paypal/create-order", {
        currency_code: currency_code,      // dynamic
        amount: amountForPayPal,           // numeric string, no commas
      });

      if (!res.data || !res.data.links) {
        return toast.error("PayPal not responding");
      }

      const approval = res.data.links.find((l) => l.rel === "approve");

      if (approval) {
        window.location.href = approval.href; // Redirect to PayPal
      } else {
        toast.error("PayPal approval link missing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start PayPal payment");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };


  const createRazorpayOrder = async (method) => {
    try {
      setLoading(true); 
      const res = await http.post("/razorpay/create-order", {
        amount: finalTotal,        // amount in rupees
        currency: currency_code,   // e.g. INR, USD
      });

      // console.log(res, 'response'); 

      if (!res.data || !res.data.order_id) {
        return toast.error("Razorpay order creation failed");
      }

      openRazorpayCheckout(res.data, method);
    } catch (error) {
      console.error(error);
      toast.error("Unable to start Razorpay payment");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  const openRazorpayCheckout = (order, method) => {
    const options = {
      key: "rzp_test_SXQjhHDXKM4Rgu",
      amount: order.amount,
      currency: order.currency,
      name: user.name,
      description: "Order Payment",
      order_id: order.order_id,

      handler: function (response) {
        window.location.href =
          "/razorpay-payment-success?" +
          "razorpay_payment_id=" + response.razorpay_payment_id +
          "&razorpay_order_id=" + response.razorpay_order_id +
          "&razorpay_signature=" + response.razorpay_signature +
          "&method=" + method;
      },

      theme: { color: "#3399cc" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };



  const handlePlacedOrder = async(method = null, transactionId = null) => {
    setLoading(true);

    // console.log(method, 'method');

    if (!agreeTerms) {
      toast.error("You must agree to the Terms & Conditions before continuing.");
      return;
    }

    const finalPaymentMethod = method || paymentMethod;

    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    if (!paymentMethod && !method) {
      toast.error("Please select a payment method");
      return;
    }

    let shippingFinalAddress = localStorage.getItem("shipping_address");
    let billingFinalAddress = localStorage.getItem("billing_address");
    let gstNumber = localStorage.getItem("gst_number");

    try {
      shippingFinalAddress = JSON.parse(shippingFinalAddress);
      billingFinalAddress = JSON.parse(billingFinalAddress);
    } catch(e) {
      console.error("Invalid address in localStorage", e);
    }

    try {

      const response = await placeOrderAPI({
        token,
        payment_method: finalPaymentMethod,
        shipping_address: shippingFinalAddress,
        billing_address: billingFinalAddress,
        country: country,
        coupon_code: couponApplied ? selectedCoupon : null,
        coupon_discount: couponApplied ? appliedDiscount : 0,
        paypal_transaction_id: finalPaymentMethod === "pay_pal" ? transactionId : null,
        amount_payable: finalTotal,
        shipping_charge: shippingCharge,
        is_gift: isGift ? 1 : 0,
        gst_number: gstNumber,
      });

      // console.log(response, 'response_place_order');

      // const response = await http.post(
      //   "/user/placed-order",
      //   {
      //     payment_method: finalPaymentMethod,
      //     shipping_address: shippingFinalAddress,
      //     billing_address: billingFinalAddress,
      //     coupon_code: couponApplied ? selectedCoupon : null,
      //     coupon_discount: couponApplied ? appliedDiscount : 0,
      //     paypal_transaction_id:
      //       finalPaymentMethod === "pay_pal" ? transactionId : null,
      //     amount_payable: finalTotal,
      //   },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      if (response?.success) {
        toast.success("Order placed successfully!");

        resetCart();

        // setcartItems([]);
        // setCartCount(0);

        // setSelectedCoupon("");
        // setSelectedDiscount(0);
        // setAppliedDiscount(0);
        // setCouponApplied(false);

        navigate("/thank-you");

      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order failed", error);
      toast.error("Something went wrong while placing order");
    }

    setLoading(false);
  };

  if (loading || wishlistLoading) {
    return <Loader/>;
  }


  const SearchableSelect = ({
    name,
    value,
    options = [],
    onChange,
    placeholder = "--Select Here--",
    activeDropdown,
    setActiveDropdown
  }) => {
  const [search, setSearch] = useState("");
  const ref = useRef();

  const isOpen = activeDropdown === name;

  // ✅ Filter options
  const filteredOptions = useMemo(() => {
    return options
      .filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 100); // limit for performance
  }, [search, options]);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".searchable-dropdown")) return;
      setActiveDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveDropdown]);

  return (
    <div ref={ref} className="searchable-dropdown position-relative">
      <input
        type="text"
        className={`form-control ${isOpen ? "active-input" : ""}`}
        placeholder={placeholder}
        value={isOpen ? search : value || ""}
        onChange={(e) => {
          setSearch(e.target.value);
          setActiveDropdown(name);
        }}
        onFocus={() => {
          setSearch(value || "");
          setActiveDropdown(name);
        }}
      />

      {isOpen && (
        <ul className="dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  onChange({
                    target: {
                      name,
                      value: item,
                      type: "select-one"
                    }
                  });

                  setSearch("");
                  setActiveDropdown(null);
                }}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="no-result">No result found</li>
          )}
        </ul>
      )}
    </div>
  );
};

  return (
    <div>
      <div className="cart-wrapper py-4">
        <div className="container-fluid">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            // onSelect={(k) => setKey(k)}
            onSelect={() => {}}
            className="crt-top-tabs justify-content-center mb-3 drehbfsxgnfgn"
          >
            <Tab eventKey="cart" title="CART">
              <div className="row justify-content-between">
                <div className="col-lg-8">
                  <div className="diwebjrwert_left">
                    <p className="mt-1 sdfwsdqfgtttt d-none mb-3 text-center" style={{fontSize: "1.2rem"}}>
                        To get additional offers on your order or to know more</p>

                    <div className="odnwejirhwerwer py-0 px-3 d-flex" style={{marginTop: "0.1rem"}}>
                      <h4 className="mb-1 mt-2" style={{paddingTop: "2px"}}>YOUR SHOPPING CART &nbsp;|&nbsp;</h4>
                      <p className="mb-1 mt-1 d-flex align-items-center" style={{paddingLeft: "11px"}}>
                        <span className="asoijdwjoiejrr">To get additional offers on your order or to know more</span>

                        <a
                            href="https://wa.me/917003672926"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="btn ms-2 btn-main">
                              <i class="bi me-1 bi-whatsapp"></i> Chat With Us
                            </button>
                        </a>
                      </p>
                    </div>

                    <div className="dowejroihwrt_wrapper mt-4">
                      {cartItems?.length === 0 && <p>No items in cart</p>}
                      {cartItems?.map((cartItemsVal) => {

                        const discountPercent = Number(cartItemsVal?.discount) || 0;

                        const calculateMRP = (price) =>
                          discountPercent > 0
                            ? Math.round(price / (1 - discountPercent / 100))
                            : price;
                        return (
                        <div className="dfgjhbdfg position-relative p-3 mb-4">
                          <div className="row freweerqeweqwe">
                            <div className="col-2">
                              <div className="donweihrwewer">
                                <Link to={`/products/${cartItemsVal.slug}-${cartItemsVal.PID}`}>
                                  <img
                                    src={optimizeImage(cartItemsVal?.encoded_image_url_1 || "/images/no-preview.jpg")}
                                    alt={cartItemsVal.product_name}
                                  />
                                </Link>
                              </div>
                            </div>

                            <div className="col-8 svgdgwefrewrwrr d-block d-lg-none d-md-none">
                              <div className="dlejworjwejriwr d-flex text-end h-100">
                                <h5 className="mb-0">
                                  {cartItemsVal.belongsTo === 'filter_size' ? (
                                    <>
                                      <span className="old-price">
                                        {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                      </span>&nbsp;
                                      <span>
                                        {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                      </span>
                                    </>
                                  ) : cartItemsVal.belongsTo === 'plus_sizes' ? (
                                    <>
                                      <span className="old-price">
                                        {formatPrice(calculateMRP(cartItemsVal.plus_sizes_charges), { showDecimals: true })}
                                      </span>&nbsp;
                                      <span>
                                        {formatPrice(cartItemsVal.plus_sizes_charges, { showDecimals: true })}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="old-price">
                                        {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                      </span>&nbsp;
                                      <span>
                                        {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                      </span>
                                    </>
                                  )}
                                  
                                </h5>

                                <div className="dewhrowerwer d-flex align-items-center">
                                  <div className="doijerewr d-flex align-items-center pe-2" style={{borderRight:"1px solid #616161"}} onClick={() =>
                                      toggleWishlist(
                                        cartItemsVal.PID
                                      )
                                    }>
                                    <i
                                      className={
                                        wishlistIds.includes(
                                          cartItemsVal.products_table_id
                                        )
                                          ? "fa-solid me-1 fa-heart"
                                          : "fa-regular me-1 fa-heart"
                                      }
                                      style={{ cursor: "pointer" }}
                                    ></i>

                                    <p className="mb-0">Move to Wishlist</p>
                                  </div>

                                  <div className="doijerewr d-flex align-items-center ps-2" onClick={() => handleRemoveItem(cartItemsVal.id)}>
                                    <i className="bi me-1 bi-trash3"></i>
                                    <p className="mb-0">Remove</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-10">
                              <div className="dowehriwerwer sdfefrqqqee">
                                <div className="dknwekhwe py-2">
                                  <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <h4 className="mb-0">
                                      {cartItemsVal.product_name} 
                                    </h4>

                                    <h5 className="mb-0">
                                      {cartItemsVal.belongsTo === 'filter_size' ? (
                                        <>
                                          <span className="old-price">
                                            {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                          </span>&nbsp;
                                          <span>
                                            {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                          </span>
                                        </>
                                      ) : cartItemsVal.belongsTo === 'plus_sizes' ? (
                                        <>
                                          <span className="old-price">
                                            {formatPrice(calculateMRP(cartItemsVal.plus_sizes_charges), { showDecimals: true })}
                                          </span>&nbsp;
                                          <span>
                                            {formatPrice(cartItemsVal.plus_sizes_charges, { showDecimals: true })}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="old-price">
                                            {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                          </span>&nbsp;
                                          <span>
                                            {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                          </span>
                                        </>
                                      )}
                                      
                                    </h5>
                                  </div>
                                
                                  <span className="dscnt-offr text-white position-absolute py-1 px-2">
                                    {cartItemsVal.discount}% OFF
                                  </span>
                                </div>

                                <div className="dnweghbjewrwer">
                                  <p className="mb-1">ITEM ID: {cartItemsVal.item_id}</p>
                                  <p className="mb-1">Colour: {cartItemsVal.color}</p>
                                  {cartItemsVal.actual_stitch_option !== 'Ready To Wear' && (
                                    <p className="mb-1">
                                      Stitching Option : {cartItemsVal.actual_stitch_option}
                                      {cartItemsVal.size === null && ` | Qty : ${cartItemsVal.quantity}`}
                                    </p>
                                  )} 
                                  {cartItemsVal.size !== null && (
                                    <p className="mb-1">Size : {cartItemsVal.size} | Qty : 
                                    
                                    <div className="dgdsgee d-inline-flex ms-2">
                                      <select
                                        name="product_quantity"
                                        id="product_quantity"
                                        disabled=""
                                        className="form-select weqwthyuytredfgw cbgdrfsfewerrr select-form-drpdwn"
                                      >
                                        <option value="">1</option>

                                        <option value="">2</option>

                                        <option value="">3</option>

                                        <option value="">4</option>

                                        <option value="">5</option>
                                      </select>
                                    </div>
                                    {/* {cartItemsVal.quantity} */}
                                    </p>
                                  )}
                                  {(
                                    cartItemsVal.turban_selected === "1" ||
                                    cartItemsVal.mojri_selected === "1" ||
                                    cartItemsVal.stole_selected === "1"
                                  ) && (
                                    <div className="">

                                      {/* FIRST LINE */}
                                      <p className="mb-1">
                                        Add On :
                                        {cartItemsVal.turban_selected === "1" && ` Matching Turban | Qty : 1`}
                                        {cartItemsVal.mojri_selected === "1" && cartItemsVal.turban_selected !== "1" && 
                                          ` Matching Mojri | Qty : 1`}
                                        {cartItemsVal.stole_selected === "1" && 
                                          cartItemsVal.turban_selected !== "1" &&
                                          cartItemsVal.mojri_selected !== "1" &&
                                          ` Matching Stole | Qty : 1`}
                                      </p>

                                      {cartItemsVal.mojri_selected === "1" && cartItemsVal.turban_selected === "1" && (
                                        <p className="mb-1">Matching Mojri | Qty : 1</p>
                                      )}

                                      {cartItemsVal.stole_selected === "1" && 
                                        (cartItemsVal.turban_selected === "1" || cartItemsVal.mojri_selected === "1") && (
                                        <p className="mb-1">Matching Stole | Qty : 1</p>
                                      )}

                                    </div>
                                  )}


                                  <div className="doewrwerwer">
                                    <div className="row">
                                      <div className="col-lg-3 mb-3">
                                        <div className="deiwnriwehrwer">
                                        {/* 
                                         {cartItemsVal.stitch_option === 'customFit' &&(
                                            <p className="mb-1">Stitching Option : {cartItemsVal.actual_stitch_option}</p>
                                          )} */}
                                          
                                          {/* <select
                                            name="product_size"
                                            className="form-select py-1"
                                            id={`product_size_${cartItemsVal.id}`}
                                            value={cartItemsVal.product_size || ""}
                                            onChange={(e) =>
                                              handleSizeChange(
                                                cartItemsVal.id,
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value={""}>Choose Size</option>
                                            {cartItemsVal.size_chart?.map(
                                              (sizeChartVal) => (
                                                <option
                                                  value={sizeChartVal.size_name}
                                                >
                                                  {sizeChartVal.size_name}
                                                </option>
                                              )
                                            )}
                                          </select> */}
                                        </div>
                                      </div>

                                      {/* <div className="col-lg-3 mb-3">
                                        <div className="deiwnriwehrwer">
                                          <label htmlFor="" className="form-label mb-1">Quantity:</label>

                                          <input type="text" className="form-control" placeholder={cartItemsVal.quantity} disabled />
                                        </div>
                                      </div> */}
                                    </div>
                                  </div>

                                  <div className="djkwehrwerwer d-flex align-items-center justify-content-between">
                                    <h6 className="mb-0 drthsftjh">
                                      <i class="bi me-1 bi-calendar-week"></i>
                                      Standard Delivery by
                                        {getEstimatedShippingDate(
                                          cartItemsVal.shipping_time
                                        )}.
                                    </h6>

                                    <div className="dewhrowerwer ghtrerwrghergedefrf d-flex align-items-center">
                                      <div className="doijerewr d-flex align-items-center pe-2" style={{borderRight:"1px solid #616161"}} onClick={() =>
                                            toggleWishlist(
                                              cartItemsVal.PID
                                            )
                                          }>
                                        <i
                                          className={
                                            wishlistIds.includes(
                                              cartItemsVal.products_table_id
                                            )
                                              ? "fa-solid me-1 fa-heart"
                                              : "fa-regular me-1 fa-heart"
                                          }
                                          style={{ cursor: "pointer" }}
                                        ></i>

                                        <p className="mb-0">Move to Wishlist</p>
                                      </div>

                                      <div className="doijerewr d-flex align-items-center ps-2" onClick={() => handleRemoveItem(cartItemsVal.id)}>
                                        <i className="bi me-1 bi-trash3"></i>
                                        <p className="mb-0">Remove</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>

                    <div className="dewtgtregtehfggefg d-flex justify-content-between">
                      <div className="dweihriwerwerw">
                        <p className="mb-1">
                          *Once your order has been placed no subsequent changes can be
                          made in it.
                        </p>

                        <p className="mb-1">
                          *Shipping cost may vary depending on the delivery destination.
                        </p>

                        <p className="mb-1">
                          *Please check the final amount on the order summary page
                          before completing the payment.
                        </p>

                        <p className="mb-1">
                          *An item's price may vary according to the size selected.
                        </p>

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

                      <div className="uiwdhiwerwerwer dojweirkwejirwer">
                        <Link to={"/all-products"}>
                          <button className="btn px-5 btn-main">
                            Continue Shopping
                          </button>
                        </Link>
                      </div>  
                    </div>                
                  </div>
                </div>
                {cartItems?.length > 0 && (
                  <div className="col-lg-4">
                    <div className="diwebjrwert_right">
                      <div className="srghbsdtnhfnjgh">
                        <h4 className="mb-4" style={{textAlign:"center"}}>CART SUMMARY</h4>
                      </div>
                      

                      <div className="dweoihrwerwer p-2 mb-3">
                        <Table responsive>
                          <tbody>
                            <tr>
                              <td>Total MRP :</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                <span style={{ textDecoration: "line-through", color: "var(--text-lighter-gray-color)"}}>
                                  {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                                </span>&nbsp;&nbsp;
                                {formatPrice(totalPrice.total_selling_price, { showDecimals: true })}
                              </td>
                            </tr>

                            <tr>
                              <td>VinHem Discount :</td>

                              <td style={{color:"green"}}>
                                (-)&nbsp;
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.total_discount_price, { showDecimals: true })}
                              </td>
                            </tr>
                            <tr>
                              <td>Customization Charges :</td>
                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.custom_fit_charges, { showDecimals: true })}
                              </td>
                            </tr>
                            {totalPrice.stiching_charges !== 0 && (
                              <tr>
                                <td>Stiching Charges :</td>

                                <td>
                                  {/* <i class="bi bi-currency-rupee"></i> */}
                                  {formatPrice(totalPrice.stiching_charges, { showDecimals: true })}
                                </td>
                              </tr>
                            )}

                            {totalPrice.mojri_charge !== '0' && (
                              <tr>
                                <td>Matching Mojri :</td>
                                <td>
                                  {formatPrice(totalPrice.mojri_charge, { showDecimals: true })}
                                </td>
                              </tr>
                            )}

                            {totalPrice.turban_charge !== '0' && (
                              <tr>
                                <td>Matching Turban :</td>
                                <td>
                                  {formatPrice(totalPrice.turban_charge, { showDecimals: true })}
                                </td>
                              </tr>
                            )}

                            {totalPrice.stole_charge !== '0' && (
                              <tr>
                                <td>Matching Stole :</td>
                                <td>
                                  {formatPrice(totalPrice.stole_charge, { showDecimals: true })}
                                </td>
                              </tr>
                            )}
                            
                            {/* {totalPrice.total_add_on_charges !== '0' && (
                              <tr>
                                <td>Add On Charges :</td>
                                <td>
                                  {formatPrice(totalPrice.total_add_on_charges, { showDecimals: true })}
                                </td>
                              </tr>
                            )} */}
                        
                            <tr>
                              <td>Shipping & Duties :</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {/* {totalPrice.shipping_charges} */}

                                Calculated at Checkout
                              </td>
                            </tr>
                            {/* {appliedDiscount > 0 && (
                              <tr>
                                <td className="sergvasdrg">Coupon Discount :</td>

                                <td className="sergvasdrg">
                                  (-)
                                  {formatPrice(appliedDiscount)}
                                </td>
                              </tr>
                            )} */}
                            <tr>
                              <td>Total Payable :</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {/* {formatPrice(Number(totalPrice.cart_totalPrice) - appliedDiscount, { showDecimals: true })} */}
                                {/* {formatPrice(Number(totalPrice.cart_totalPrice), { showDecimals: true })} */}
                                {formatPrice(Number(totalPrice.total_selling_price) +
                                  Number(totalPrice.total_add_on_charges) +
                                  Number(totalPrice.custom_fit_charges) +
                                  Number(totalPrice.stiching_charges), { showDecimals: true })}
                              </td>
                            </tr>
                          </tbody>
                        </Table>                      
                      </div>

                      

                      <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2 mb-3">
                        <div className="doewjirwerwer dcvsdfggewe">
                          <label>YOUR TOTAL SAVINGS</label>
                        </div>

                        <span>
                          {/* <i class="bi bi-currency-rupee"></i>  */}
                          {/* - {formatPrice(Number(totalPrice.total_discount_price) + appliedDiscount, { showDecimals: true })} */}
                          (-) {formatPrice(Number(totalPrice.total_discount_price), { showDecimals: true })}
                        </span>
                      </div>

                      {/* <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2">
                        <div className="doewjirwerwer">
                          <input type="checkbox" id="gft" className="m-1" checked={isGift}
                              onChange={(e) => setIsGift(e.target.checked)}/>

                          <label htmlFor="gft">This is a gift item</label>
                        </div>

                        <span>Free Gift Wrap</span>
                      </div> */}

                      <div className="oiasmdjweijrwerwer py-2 mb-4 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-3">
                        <label className="mb-0">Total Payable</label>
                        <span className="mb-0">
                          {/* <i class="bi bi-currency-rupee"></i> */}
                          {/* {formatPrice((Number(totalPrice.total_selling_price) - appliedDiscount) + Number(totalPrice.total_add_on_charges) + Number(totalPrice.custom_fit_charges) + Number(totalPrice.stiching_charges), { showDecimals: true })} */}
                          {formatPrice((Number(totalPrice.total_selling_price)) + Number(totalPrice.total_add_on_charges) + Number(totalPrice.custom_fit_charges) + Number(totalPrice.stiching_charges), { showDecimals: true })}
                        </span>
                        
                      </div>

                      <div className="uiwdhiwerwerwer">
                          <button
                            className="btn btn-main w-100 mb-2"
                            onClick={handleProceed}
                          >
                            PROCEED TO CHECKOUT
                          </button>
                        
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tab>
            
            <Tab eventKey="shipping" title="SHIPPING">
              <div className="dnweirwerwer">
                <div className="row justify-content-between">
                  <div className="col-lg-8">
                    <div className="diwebjrwert_left">
                      <div className="djikewirwerwer">
                        <div className="inmoijjrwerwe mb-4">
                          <div className="jbdjnewnllr d-flex align-items-center justify-content-between w-100">
                            <h4 className="mb-0">SHIPPING AND BILLING ADDRESS</h4>
                          </div>

                          <div className="iudghweewr pt-3">                           
                            <div className="dinwemojerr mb-4">
                              {/* <label className="form-label">Shipping Address</label> */}

                              <button onClick={handleAddressToggle} className="btn btn-main bg-transparent text-black d-block w-100">
                                {/* <i class="bi me-1 bi-plus-square"></i> */}
                                
                                ADD SHIPPING ADDRESS
                              </button>
                            </div>

                            <div className="doiewjirjwer">
                              
                              {!hideDBAddress ? (
                                shippingAddress ? (
                                  <ShippingAddress
                                    address={shippingAddress}
                                    onEdit={handleEditAddress}
                                    onRemove={handleRemoveAddress}
                                    onInvalidMobile={handleInvalidMobile}
                                  />
                                ) : previousAddress ? (
                                  <ShippingAddress
                                    address={previousAddress}
                                    onEdit={handleEditAddress}
                                    onRemove={handleRemoveAddress}
                                    onInvalidMobile={handleInvalidMobile}
                                  />
                                ) : null
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="inmoijjrwerwe dfghbefestewerr mb-4">
                          <div className="kasndkhasd form-check mb-4">
                            <input
                              className="form-check-input ihdinwehwwwee"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                              checked={sameAsShipping}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSameAsShipping(checked);

                                if (checked) {
                                  // Copy shipping → billing
                                  setBillingAddress(shippingAddress);
                                  // Also update billing address in localStorage
                                  localStorage.setItem("billing_address", JSON.stringify(shippingAddress));
                                } else {
                                  // If unchecked, clear billing address or reset
                                  setBillingAddress(null);
                                  localStorage.removeItem("billing_address");
                                }
                              }}
                            />

                            <label className="form-check-label" htmlFor="flexCheckDefault">
                              <h6 className="mb-0">Billing address same as shipping address</h6>
                            </label>
                          </div>

                          <div className="iudghweewr">       
                            {!sameAsShipping && (
                              <div className="dinwemojerr mb-4">
                                {/* <label className="form-label">Billing Address</label> */}
                                <button 
                                  onClick={handleBillingAddressToggle} 
                                  className="btn btn-main bg-transparent text-black d-block w-100 mt-2"
                                >
                                  {/* <i className="bi me-1 bi-plus-square"></i> */}
                                  ADD BILLING ADDRESS
                                </button>
                              </div>
                            )}

                            <div className="doiewjirjwer">
                              {/* <div className="delojowerer py-3 px-4 d-flex align-items-center">
                                <i class="bi me-3 bi-exclamation-triangle-fill"></i>

                                <p className="mb-0">A valid Indian mobile is required for seamless delivery. Before delivery of this order, you will get a one-time passowrd on +91-7003672926 <span className="ms-1">Edit</span></p>
                              </div> */}

                              {/* 1️⃣ If SAME AS SHIPPING → show shipping details */}
                              {/* {sameAsShipping && shippingAddress && (
                                <BillingAddress data={shippingAddress} onEdit={handleEditBillingAddress}
                                    onRemove={handleRemoveBillingAddress}/>
                              )} */}

                              {/* 2️⃣ If NOT same-as-shipping AND billing address exists in DB */}
                              {/* {!sameAsShipping && billingAddress && (
                                <BillingAddress data={billingAddress} onEdit={handleEditBillingAddress}
                                     onRemove={handleRemoveBillingAddress}/>
                              )} */}

                              {/* {!sameAsShipping && !hideDBBillingAddress && billingAddress && (
                                <BillingAddress
                                  data={billingAddress}
                                  onEdit={handleEditBillingAddress}
                                  onRemove={handleRemoveBillingAddress}
                                />
                              )} */}

                              {sameAsShipping && billingAddress && (
                                <BillingAddress
                                  data={billingAddress}
                                  onEdit={handleEditBillingAddress}
                                  onRemove={handleRemoveBillingAddress}
                                />
                              )}

                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="dweihriwerwerw mt-4">
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
                      </div> */}

                      <div className="sadfdgrwedwe d-flex align-items-center justify-content-end aksbdjbererre dojweirkwejirwer">
                        <button className="btn px-3 me-2 btn-main" onClick={handleCart}>
                          <i className="fa-solid me-1 fa-arrow-left"></i> Back To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="diwebjrwert_right sfvswfrwerwr">
                      <div className="uiwdhiwerwerwer">
                          <button
                            className="btn btn-main w-100 mb-3"
                            onClick={handleCouponToggle}
                          >
                            VIEW ALL OFFER & COUPONS 
                          </button>
                      </div>
                      <div className="sdegdsbhsdfgbnh mb-4">
                        <h4 className="opsjdfohsij mb-0 pb-2">ORDER SUMMARY</h4>
                      </div>
                      
                      <div className="dweoihrwerwer p-2 mb-3">
                      <Table responsive>
                        <tbody>
                          <tr>
                            <td>Total MRP :</td>

                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              
                              <span style={{ textDecoration: "line-through", color: "var(--text-lighter-gray-color)"}}>
                                {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                              </span>&nbsp;&nbsp;
                              {formatPrice(totalPrice.total_selling_price, { showDecimals: true })}
                            </td>
                          </tr>

                          <tr>
                            <td>VinHem Discount :</td>

                            <td style={{color:"green"}}>
                              (-)&nbsp;
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.total_discount_price, { showDecimals: true })}
                            </td>
                          </tr>
                          <tr>
                            <td>Customization Charges :</td>
                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.custom_fit_charges, { showDecimals: true })}
                            </td>
                          </tr>
                          {totalPrice.stiching_charges !== 0 && (
                            <tr>
                              <td>Stiching Charges :</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.stiching_charges, { showDecimals: true })}
                              </td>
                            </tr>
                          )}
                          {/* {totalPrice.total_add_on_charges !== '0' && (
                            <tr>
                              <td>Add On Charges :</td>
                              <td>
                                {formatPrice(totalPrice.total_add_on_charges, { showDecimals: true })}
                              </td>
                            </tr>
                          )} */}
                          
                          {totalPrice.mojri_charge !== '0' && (
                            <tr>
                              <td>Matching Mojri :</td>
                              <td>
                                {formatPrice(totalPrice.mojri_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}

                          {totalPrice.turban_charge !== '0' && (
                            <tr>
                              <td>Matching Turban :</td>
                              <td>
                                {formatPrice(totalPrice.turban_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}

                          {totalPrice.stole_charge !== '0' && (
                            <tr>
                              <td>Matching Stole :</td>
                              <td>
                                {formatPrice(totalPrice.stole_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}
                       
                          <tr>
                            <td>
                              Shipping & Duties :&nbsp;
                              {freeShipping && (
                                <span className="sergvasdrg">(Coupon Applied)</span>
                              )}
                            </td>

                            <td>
                              {freeShipping ? (
                                <span className="sergvasdrg">
                                  (-) {formatPrice(shippingDiscount, { showDecimals: true })}
                                </span>
                              ) : 
                              // shippingCharge === null ? 
                              // (
                              //   formatPrice(0, { showDecimals: true })
                              // ) : 
                              (
                                formatPrice(shippingCharge, { showDecimals: true })
                              )}
                            </td>
                          </tr>
                          {appliedDiscount > 0 && !freeShipping ? (
                            <tr>
                              <td className="">Coupon Discount :</td>
                              <td className="sergvasdrg">
                                (-) {formatPrice(appliedDiscount, { showDecimals: true })}
                              </td>
                            </tr>
                          ) : appliedDiscount > 0 && freeShipping ? (
                            <tr>
                              <td className="">Coupon Discount :</td>
                              <td className="sergvasdrg">
                                (-) {formatPrice(appliedDiscount, { showDecimals: true })}
                              </td>
                            </tr>
                          ):null}
                          {appliedDiscount > 0 && !freeShipping ? (
                              <tr>
                                {/* <td>Total Payable :</td> */}
                                <td>After Discount :</td>
                                  <td style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                                      {/* <span style={{ textDecoration: "line-through", color: "#999" }}>
                                        {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                                      </span>&nbsp; */}
                                      {formatPrice(
                                      freeShipping
                                        ? (
                                            Number(totalPrice.total_selling_price) +
                                            Number(totalPrice.total_add_on_charges) +
                                            Number(totalPrice.custom_fit_charges) +
                                            Number(totalPrice.stiching_charges)
                                          )
                                        : (
                                            Number(totalPrice.total_selling_price) -
                                            appliedDiscount +
                                            Number(totalPrice.total_add_on_charges) +
                                            Number(totalPrice.custom_fit_charges) +
                                            Number(totalPrice.stiching_charges) +
                                            Number(shippingCharge)
                                          ),
                                      { showDecimals: true }
                                    )}
                                  </td>
                              </tr>
                          ) : appliedDiscount > 0 && freeShipping ? (
                            <tr>
                              {/* <td>Total Payable :</td> */}
                              <td>After Discount :</td>
                                <td style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                                    {/* <span style={{ textDecoration: "line-through", color: "#999" }}>
                                      {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                                    </span>&nbsp; */}
                                    {formatPrice(
                                    freeShipping
                                      ? (
                                          appliedDiscount > 0 ?
                                          Number(totalPrice.total_selling_price) -
                                          appliedDiscount +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges)
                                          :
                                          Number(totalPrice.total_selling_price) +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges)
                                        )
                                      : (
                                          appliedDiscount > 0 ?
                                          Number(totalPrice.total_selling_price) -
                                          appliedDiscount +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges) +
                                          Number(shippingCharge)
                                          :
                                          Number(totalPrice.total_selling_price) +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges) +
                                          Number(shippingCharge)
                                        ),
                                    { showDecimals: true }
                                  )}
                                </td>
                            </tr>
                          ): 

                          <tr>
                            <td>Total Payable :</td>
                            <td>{formatPrice(Number(totalPrice.total_selling_price) + 
                                  Number(totalPrice.total_add_on_charges) + 
                                  Number(totalPrice.custom_fit_charges) + 
                                  Number(totalPrice.stiching_charges) + 
                                  Number(shippingCharge), { showDecimals: true })}
                            </td>
                          </tr>
                          }
                          
                        </tbody>
                      </Table>                      
                    </div>

                    

                    <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2 mb-3">
                      <div className="doewjirwerwer dcvsdfggewe">
                        <label>YOUR TOTAL SAVINGS</label>
                      </div>

                      <span>
                        {/* <i class="bi bi-currency-rupee"></i>  */}
                        (-) {formatPrice(
                          freeShipping
                            ? (
                                appliedDiscount > 0
                                  ? Number(totalPrice.total_discount_price) + appliedDiscount + Number(shippingCharge)
                                  : Number(totalPrice.total_discount_price) + Number(shippingCharge)
                              )
                            : (
                                appliedDiscount > 0
                                  ? Number(totalPrice.total_discount_price) + appliedDiscount
                                  : Number(totalPrice.total_discount_price)
                              ),
                          { showDecimals: true }
                        )}
                      </span>
                    </div>

                    <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2">
                      <div className="doewjirwerwer">
                        <input type="checkbox" id="gft" className="m-1" checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}/>

                        <label htmlFor="gft">This is a gift item</label>
                      </div>

                      <span>Free Gift Wrap</span>
                    </div>

                    <div className="oiasmdjweijrwerwer py-2 mb-4 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-3">
                      <label className="mb-0">Total Payable</label>
                      <span className="mb-0">
                        {/* <i class="bi bi-currency-rupee"></i> */}
                        {formatPrice(
                          freeShipping
                            ? (
                                appliedDiscount > 0
                                ?
                                Number(totalPrice.total_selling_price)  -
                                appliedDiscount +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges)
                                : 
                                Number(totalPrice.total_selling_price) +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges)
                              )
                            : (
                                appliedDiscount > 0
                                ?
                                Number(totalPrice.total_selling_price) -
                                appliedDiscount +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges) +
                                Number(shippingCharge)
                                : 
                                Number(totalPrice.total_selling_price) +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges) +
                                Number(shippingCharge)
                              ),
                          { showDecimals: true }
                        )}
                      </span>
                      
                    </div>
                      {/* <div className="dweoihrwerwer sdfvdedwewerr p-1 mb-3">
                        <Table responsive>
                          <tbody>
                            <tr>
                              <td>Cart Total </td>

                              <td>
                                {formatPrice(totalPrice.cart_totalPrice)}
                              </td>
                            </tr>

                            <tr>
                              <td>Shipping & Duties </td>

                              <td>
                                {shippingCharge === null ?(
                                  formatPrice(0)
                                ) :(
                                  formatPrice(shippingCharge)
                                )}
                                
                              </td>
                            </tr>

                            {appliedDiscount > 0 && (
                              <tr>
                                <td>Coupon Discount </td>

                                <td>
                                  (-) 
                                  {formatPrice(appliedDiscount)}
                                </td>
                              </tr>
                            )}

                            <tr>
                              <td><b>TOTAL PAYABLE</b></td>
                              <td>
                                <b>{formatPrice((Number(totalPrice.total_selling_price) - appliedDiscount) + Number(totalPrice.total_add_on_charges) + Number(totalPrice.custom_fit_charges) + Number(totalPrice.stiching_charges) + Number(shippingCharge))}</b>
                              </td>
                            </tr>
                            <tr className="sfvawxdsddqwdawd">
                              <td className="dcvsdfggewe"><label>YOUR TOTAL SAVINGS</label></td>
                              <td>
                                <span className="dcvsdfggewe">
                                  - {formatPrice(Number(totalPrice.total_discount_price) + appliedDiscount)}
                                </span>
                              </td>
                            </tr>

                          </tbody>
                        </Table>                      
                      </div> */}
{/* 
                      {appliedDiscount > 0 && (
                        <div className="oiasmdjweijrwerwer d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                          <p>Coupon Discount</p>
                          <p>
                            (-) <i class="bi bi-currency-rupee"></i>
                            {appliedDiscount}
                          </p>
                        </div>
                      )} */}

                      {/* <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer">
                          <label><b>TOTAL PAYABLE</b></label>
                        </div>
                      </div>  */}
 

                      {/* <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer dcvsdfggewe">
                          <label>YOUR TOTAL SAVINGS</label>
                        </div>

                        <span>
                        </span>
                      </div>  */}

                      <div className="uiwdhiwerwerwer mt-4">
                        <button
                          className="btn btn-main w-100 mb-4"
                          onClick={handleCheckoutPayment}
                          disabled={!shippingAddress || isMobileInvalid}
                        >
                          CONTINUE TO PAYMENT
                        </button>
                      </div>

                      <div className="doiewnirhwerwer diwebjrwert_left">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">Order Details - <span>{cartItems?.length} Item(s)</span></p>

                          <i style={{cursor: "pointer"}} className={pymntSmmryDrpdwn ? "bi bi-chevron-up" : "bi bi-chevron-down"} onClick={() => setPymntSmmryDrpdwn(prev => !prev)}></i>
                        </div>

                        {pymntSmmryDrpdwn && (
                          <div className="dowejroihwrt_wrapper">
                          {cartItems?.length === 0 && <p>No items in cart</p>}
                            {cartItems?.map((cartItemsVal) => {
                              const discountPercent = Number(cartItemsVal?.discount) || 0;

                              const calculateMRP = (price) => 
                                discountPercent > 0
                                  ? Math.round(price / (1 - discountPercent / 100))
                                  : price;

                              return(
                              <div className="dfgjhbdfg sdfaedaeeewwqwee position-relative p-3 mb-3">
                                <div className="d-flex gap-2">
                                  <div className="dasferqrrqqq">
                                    <div className="donweihrwewer">
                                      <Link to={`/products/${cartItemsVal.slug}-${cartItemsVal.PID}`}>
                                        <img
                                          src={optimizeImage(cartItemsVal?.encoded_image_url_1 || "/images/no-preview.jpg")}
                                          alt={cartItemsVal.product_name}
                                        />
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="esrwerwrgtwwrwre ps-1" style={{ flex: 1 }}>
                                    <div className="dowehriwerwer sdvwdewrwerwere">
                                      <div className="dknwekhwe">
                                        <div className="dokwejlkpewr d-flex flex-wrap align-items-center justify-content-between">
                                          <div className="d-flex justify-content-between w-100 mb-1">
                                            <h6 className="mb-0 me-3">{cartItemsVal.product_name}</h6>

                                            <div className="diejwijrwer" style={{ flex: "none" }}>
                                              <i
                                                onClick={() =>
                                                  toggleWishlist(
                                                    cartItemsVal.PID
                                                  )
                                                }
                                                className={
                                                  wishlistIds.includes(
                                                    cartItemsVal.products_table_id
                                                  )
                                                    ? "bi me-2 bi-heart-fill"
                                                    : "bi me-2 bi-heart"
                                                }
                                                style={{ cursor: "pointer" }}
                                              ></i>
                                              <i class="bi bi-trash3" onClick={() => handleRemoveItem(cartItemsVal.id)}></i>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="dnweghbjewrwer mb-2">
                                        <h5 className="mb-1">
                                          {cartItemsVal.belongsTo === 'filter_size' ? (
                                            <>
                                              <span className="old-price xdvgsfsadfaxcfgsf">
                                                MRP : {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="oikdjioerer">
                                                 {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="fghfgg114">
                                                {cartItemsVal.discount}%OFF
                                              </span>
                                            </>
                                          ) : cartItemsVal.belongsTo === 'plus_sizes' ? (
                                            <>
                                              <span className="old-price xdvgsfsadfaxcfgsf">
                                                MRP : {formatPrice(cartItemsVal.plus_sizes_charges, { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="oikdjioerer">
                                                {formatPrice(calculateMRP(cartItemsVal.plus_sizes_charges), { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="fghfgg114">
                                                {cartItemsVal.discount}%OFF
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="old-price xdvgsfsadfaxcfgsf">
                                                MRP :  {formatPrice(cartItemsVal.selling_price, { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="oikdjioerer">
                                                {formatPrice(cartItemsVal.mrp_price, { showDecimals: true })}
                                              </span>&nbsp;
                                              <span className="fghfgg114">
                                                {cartItemsVal.discount}%OFF
                                              </span>
                                            </>
                                          )}
                                          
                                        </h5>

                                        <p className="mb-1">ITEM ID: {cartItemsVal.item_id}</p>
                                        <p className="mb-1">Colour: {cartItemsVal.color}</p>
                                        {cartItemsVal.actual_stitch_option !== 'Ready To Wear' && (
                                          <p className="mb-2">
                                            Stitching Option : {cartItemsVal.actual_stitch_option}
                                            {cartItemsVal.size === null && ` | Qty : ${cartItemsVal.quantity}`}
                                          </p>
                                        )} 
                                        {cartItemsVal.size !== null && (
                                          <p className="mb-1">Size : {cartItemsVal.size} | Qty : {cartItemsVal.quantity}</p>
                                        )}
                                        {(
                                          cartItemsVal.turban_selected === "1" ||
                                          cartItemsVal.mojri_selected === "1" ||
                                          cartItemsVal.stole_selected === "1"
                                        ) && (
                                          <div className="">

                                            {/* FIRST LINE */}
                                            <p className="mb-1">
                                              Add On :
                                              {cartItemsVal.turban_selected === "1" && ` Matching Turban | Qty : 1`}
                                              {cartItemsVal.mojri_selected === "1" && cartItemsVal.turban_selected !== "1" && 
                                                ` Matching Mojri | Qty : 1`}
                                              {cartItemsVal.stole_selected === "1" && 
                                                cartItemsVal.turban_selected !== "1" &&
                                                cartItemsVal.mojri_selected !== "1" &&
                                                ` Matching Stole | Qty : 1`}
                                            </p>

                                            {cartItemsVal.mojri_selected === "1" && cartItemsVal.turban_selected === "1" && (
                                              <p className="mb-1">Matching Mojri | Qty : 1</p>
                                            )}

                                            {cartItemsVal.stole_selected === "1" && 
                                              (cartItemsVal.turban_selected === "1" || cartItemsVal.mojri_selected === "1") && (
                                              <p className="mb-1">Matching Stole | Qty : 1</p>
                                            )}

                                          </div>
                                        )}
                          
                                        <div className="djkwehrwerwer drhfrgwdshdgdg d-flex align-items-center justify-content-between">
                                          <h6 className="mb-0 drthsftjh">
                                            <i class="bi me-1 bi-calendar-week"></i>
                                            Standard Delivery by
                                              {getEstimatedShippingDate(
                                                cartItemsVal.shipping_time
                                              )}
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="djkwehrwerwer gbhgfjnherfgwrrw d-none align-items-center justify-content-between">
                                  <h6 className="mb-0 drthsftjh">
                                    <i class="bi me-1 bi-calendar-week"></i>
                                    Standard Delivery by
                                      {getEstimatedShippingDate(
                                        cartItemsVal.shipping_time
                                      )}
                                  </h6>
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="diwenfrjikwehirwerwer p-3 my-3">
                        <p>Save up to 18% with business pricing and GST input tax credit.</p>

                        <div className="adosejoifrjewrwer row">
                          <div className="col-9">
                            <input type="text" className="form-control" 
                              placeholder="Enter Your GST Number*"
                              value={gstNumber}
                              onChange={(e) => {
                                setGstNumber(e.target.value.toUpperCase());
                                setGstError("");
                              }}
                              maxLength={15}
                              disabled={gstSaved} />

                              
                              {gstError && (
                                <small className="text-danger">{gstError}</small>
                              )}
                          </div>


                          <div className="col-3 ps-0">
                            {!gstSaved && (
                              <button className="btn w-100 scfsefweqwe btn-main" onClick={saveGstNumber}>Submit</button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="doriwer d-flex align-items-center">
                        <img src="./images/safgder.jpg" className="me-2" alt="" />

                        <p className="mb-0">Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="payment" title="PAYMENT">
              <div className="scsrgwescsdded">
                <div className="row justify-content-between">
                  <div className="col-lg-8">
                    <div className="diwebjrwert_left">
                      <div className="djikewirwerwer">
                        <div className="inmoijjrwerwe mb-4">
                          <div className="jbdjnewnllr">
                            <h4 className="mb-0">SELECT PAYMENT METHOD</h4>
                          </div>

                          <div className="soidjwoejoirwer">
                            <div className="omweojuirhwerrr">
                              <div className="doiweuijrwerwer">
                                <div className="radio-wrapper-26 mb-3" style={{marginTop: "25px"}}>
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
                                        <span className="title">UPI (Gpay, PhonePe, Paytm etc) : <img className="dienwihejwr ms-1" src="images/upi.png" alt="" /></span>
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
                                        <span className="title">Credit Card : <img className="dienwihejwr ms-1" src="images/credit-card.png" alt="" /></span>
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
                                        <span className="title">Debit Card : <img className="dienwihejwr ms-1" src="images/debit-card.png" alt="" /></span>
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
                                        <span className="title">Net Banking : <img className="sadwqeqwee ms-1" src="images/mobile-banking.png" alt="" /></span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                {/* <div className="radio-wrapper-26 mb-3">
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
                                        <span className="title2">
                                          <img className="dienwihejwr ms-1" src="images/razorpay.png" alt="" /></span>
                                      </div>
                                    </div>
                                  </label>
                                </div> */}

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
                                        <span className="title2">
                                          {/* Pay Pal  */}
                                        <img className="dienwihejwr ms-1" src="images/paypal.png" alt="" /></span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-rerrfdbv">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="codOption"
                                        type="radio"
                                        name="payment_method"
                                        value="cash_on_delivery"
                                        checked={paymentMethod === "cash_on_delivery"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={finalTotal > 2000}   // 🔥 Auto-disable
                                      />

                                      <div className="ms-2">
                                        <span className="title">
                                          {finalTotal > 2000
                                            ? "Cash On Delivery (COD Not Applicable On This Order)"
                                            : "Cash On Delivery"}
                                        </span>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              <div className="dfiwehrwerwe mb-5">
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" 
                                    defaultValue="" id="flexCheckDefasadsult"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                  />

                                  <label className="form-check-label terms-label" htmlFor="flexCheckDefasadsult">
                                    I agree to the terms and conditions (<Link className="tnc-link" to="/terms-&-condition">Read T&C</Link>)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="diwebjrwert_right sfvswfrwerwr">
                      {/* <h4 className="opsjdfohsij mb-0 pb-2">PRICE DETAILS</h4> */}
                      <div className="sdegdsbhsdfgbnh mb-4">
                        <h4 className="opsjdfohsij mb-0 pb-2">PRICE DETAILS</h4>
                      </div>

                      <div className="dweoihrwerwer p-2 mb-3">
                      <Table responsive>
                        <tbody>
                          <tr>
                            <td>Total MRP :</td>

                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {/* {formatPrice(totalPrice.total_selling_price, { showDecimals: true })} */}
                              <span style={{ textDecoration: "line-through", color: "var(--text-lighter-gray-color)"}}>
                                {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                              </span>&nbsp;&nbsp;
                              {formatPrice(totalPrice.total_selling_price, { showDecimals: true })}
                            </td>
                          </tr>

                          <tr>
                            <td>VinHem Discount :</td>

                            <td style={{color:"green"}}>
                              (-)&nbsp;
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.total_discount_price, { showDecimals: true })}
                            </td>
                          </tr>
                          <tr>
                            <td>Customization Charges :</td>
                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.custom_fit_charges, { showDecimals: true })}
                            </td>
                          </tr>
                          {totalPrice.stiching_charges !== 0 && (
                            <tr>
                              <td>Stiching Charges :</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.stiching_charges, { showDecimals: true })}
                              </td>
                            </tr>
                          )}
                          {/* {totalPrice.total_add_on_charges !== '0' && (
                            <tr>
                              <td>Add On Charges :</td>
                              <td>
                                {formatPrice(totalPrice.total_add_on_charges, { showDecimals: true })}
                              </td>
                            </tr>
                          )} */}

                          {totalPrice.mojri_charge !== '0' && (
                            <tr>
                              <td>Matching Mojri :</td>
                              <td>
                                {formatPrice(totalPrice.mojri_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}

                          {totalPrice.turban_charge !== '0' && (
                            <tr>
                              <td>Matching Turban :</td>
                              <td>
                                {formatPrice(totalPrice.turban_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}

                          {totalPrice.stole_charge !== '0' && (
                            <tr>
                              <td>Matching Stole :</td>
                              <td>
                                {formatPrice(totalPrice.stole_charge, { showDecimals: true })}
                              </td>
                            </tr>
                          )}
                       
                          <tr>
                            <td>
                              Shipping & Duties :&nbsp;
                              {freeShipping && (
                                <span className="sergvasdrg">(Coupon Applied)</span>
                              )}
                            </td>

                            <td>
                              {freeShipping ? (
                                <span className="sergvasdrg">
                                  (-) {formatPrice(shippingDiscount, { showDecimals: true })}
                                </span>
                              ) : 
                              // shippingCharge === null ? (
                              //   formatPrice(0, { showDecimals: true })
                              // ) : 
                              (
                                formatPrice(shippingCharge, { showDecimals: true })
                              )}
                            </td>
                          </tr>
             
                          {appliedDiscount > 0 && !freeShipping ? (
                            <tr>
                              <td className="">Coupon Discount :</td>
                              <td className="sergvasdrg">
                                (-) {formatPrice(appliedDiscount, { showDecimals: true })}
                              </td>
                            </tr>
                          ) : appliedDiscount > 0 && freeShipping ? (
                            <tr>
                              <td className="">Coupon Discount :</td>
                              <td className="sergvasdrg">
                                (-) {formatPrice(appliedDiscount, { showDecimals: true })}
                              </td>
                            </tr>
                          ):null}

                          {/* <tr>
                            <td>After Discount :</td>
                              <td style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                                  {formatPrice(
                                  freeShipping
                                    ? (
                                        Number(totalPrice.total_selling_price) +
                                        Number(totalPrice.total_add_on_charges) +
                                        Number(totalPrice.custom_fit_charges) +
                                        Number(totalPrice.stiching_charges)
                                      )
                                    : (
                                        Number(totalPrice.total_selling_price) -
                                        appliedDiscount +
                                        Number(totalPrice.total_add_on_charges) +
                                        Number(totalPrice.custom_fit_charges) +
                                        Number(totalPrice.stiching_charges) +
                                        Number(shippingCharge)
                                      ),
                                  { showDecimals: true }
                                )}
                              </td>
                          </tr> */}
                          {appliedDiscount > 0 && !freeShipping ? (
                              <tr>
                                {/* <td>Total Payable :</td> */}
                                <td>After Discount :</td>
                                  <td style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                                      {/* <span style={{ textDecoration: "line-through", color: "#999" }}>
                                        {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                                      </span>&nbsp; */}
                                      {formatPrice(
                                      freeShipping
                                        ? (
                                            Number(totalPrice.total_selling_price) +
                                            Number(totalPrice.total_add_on_charges) +
                                            Number(totalPrice.custom_fit_charges) +
                                            Number(totalPrice.stiching_charges)
                                          )
                                        : (
                                            Number(totalPrice.total_selling_price) -
                                            appliedDiscount +
                                            Number(totalPrice.total_add_on_charges) +
                                            Number(totalPrice.custom_fit_charges) +
                                            Number(totalPrice.stiching_charges) +
                                            Number(shippingCharge)
                                          ),
                                      { showDecimals: true }
                                    )}
                                  </td>
                              </tr>
                          ) : appliedDiscount > 0 && freeShipping ? (
                            <tr>
                              {/* <td>Total Payable :</td> */}
                              <td>After Discount :</td>
                                <td style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                                    {/* <span style={{ textDecoration: "line-through", color: "#999" }}>
                                      {formatPrice(totalPrice.total_mrp_price, { showDecimals: true })}
                                    </span>&nbsp; */}
                                    {formatPrice(
                                    freeShipping
                                      ? (
                                          appliedDiscount > 0 ?
                                          Number(totalPrice.total_selling_price) -
                                          appliedDiscount +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges)
                                          :
                                          Number(totalPrice.total_selling_price) +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges)
                                        )
                                      : (
                                          appliedDiscount > 0 ?
                                          Number(totalPrice.total_selling_price) -
                                          appliedDiscount +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges) +
                                          Number(shippingCharge)
                                          :
                                          Number(totalPrice.total_selling_price) +
                                          Number(totalPrice.total_add_on_charges) +
                                          Number(totalPrice.custom_fit_charges) +
                                          Number(totalPrice.stiching_charges) +
                                          Number(shippingCharge)
                                        ),
                                    { showDecimals: true }
                                  )}
                                </td>
                            </tr>
                          ): 

                          <tr>
                            <td>Total Payable :</td>
                            <td>{formatPrice(Number(totalPrice.total_selling_price) + 
                                  Number(totalPrice.total_add_on_charges) + 
                                  Number(totalPrice.custom_fit_charges) + 
                                  Number(totalPrice.stiching_charges) + 
                                  Number(shippingCharge), { showDecimals: true })}
                            </td>
                          </tr>
                          }
                          

                        </tbody>
                      </Table>                    
                    </div>

                    

                    <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2 mb-3">
                      <div className="doewjirwerwer dcvsdfggewe">
                        <label>YOUR TOTAL SAVINGS</label>
                      </div>

                      <span>
                        {/* <i class="bi bi-currency-rupee"></i>  */}
                        (-) {formatPrice(
                          freeShipping
                            ? (
                                appliedDiscount > 0
                                  ? Number(totalPrice.total_discount_price) + appliedDiscount + Number(shippingCharge)
                                  : Number(totalPrice.total_discount_price) + Number(shippingCharge)
                              )
                            : (
                                appliedDiscount > 0
                                  ? Number(totalPrice.total_discount_price) + appliedDiscount
                                  : Number(totalPrice.total_discount_price)
                              ),
                          { showDecimals: true }
                        )}
                      </span>
                    </div>

                    <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2">
                      <div className="doewjirwerwer">
                        <input type="checkbox" id="gft" className="m-1" checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}/>

                        <label htmlFor="gft">This is a gift item</label>
                      </div>

                      <span>Free Gift Wrap</span>
                    </div>

                    <div className="oiasmdjweijrwerwer py-2 mb-4 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-3">
                      <label className="mb-0">Total Payable</label>
                      <span className="mb-0">
                        {/* <i class="bi bi-currency-rupee"></i> */}
                        {formatPrice(
                          freeShipping
                            ? (
                                appliedDiscount > 0
                                ?
                                Number(totalPrice.total_selling_price)  -
                                appliedDiscount +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges)
                                : 
                                Number(totalPrice.total_selling_price) +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges)
                              )
                            : (
                                appliedDiscount > 0
                                ?
                                Number(totalPrice.total_selling_price) -
                                appliedDiscount +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges) +
                                Number(shippingCharge)
                                : 
                                Number(totalPrice.total_selling_price) +
                                Number(totalPrice.total_add_on_charges) +
                                Number(totalPrice.custom_fit_charges) +
                                Number(totalPrice.stiching_charges) +
                                Number(shippingCharge)
                              ),
                          { showDecimals: true }
                        )}
                      </span>
                    </div>
                      {/* {appliedDiscount > 0 && (
                        <div className="oiasmdjweijrwerwer d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                          <p>Coupon Discount</p>

                          <p>
                            (-) <i class="bi bi-currency-rupee"></i>
                            {appliedDiscount}
                          </p>
                        </div>
                      )} */}

                      

                      {/* <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer dcvsdfggewe">
                          <label>YOUR TOTAL SAVINGS</label>
                        </div>

                        <span>
                        </span>
                      </div>    */}

                      {/* <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer">
                          <label><b>TOTAL PAYABLE</b></label>
                        </div>

                        <span>
                        </span>
                      </div>                 */}

                      <div className="uiwdhiwerwerwer mt-4">

                        {cartItems?.length > 0 && (
                            <button
                                className="btn btn-main w-100 mb-4"
                                onClick={handlePaymentFlow}
                                disabled={loading}
                            >
                                {loading ? "PLACING..." : "PLACE ORDER"}
                            </button>
                        )}

                      </div>

                      {/* <div className="doiewnirhwerwer diwebjrwert_left">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">Order Details - <span>{cartItems?.length} Item(s)</span></p>

                          <i style={{cursor: "pointer"}} className={pymntSmmryDrpdwn ? "bi bi-chevron-up" : "bi bi-chevron-down"} onClick={() => setPymntSmmryDrpdwn(prev => !prev)}></i>
                        </div>
                        {pymntSmmryDrpdwn && (
                          <div className="dowejroihwrt_wrapper mt-3">
                            {cartItems?.length === 0 && <p>No items in cart</p>}
                            {cartItems?.map((cartItemsVal) => (
                              <div className="dfgjhbdfg sdfaedaeeewwqwee position-relative p-3 mb-3">
                                <div className="row">
                                  <div className="col-lg-3">
                                    <div className="donweihrwewer">
                                      <Link to={`/products/${cartItemsVal.slug}`}>
                                        <img
                                          src={cartItemsVal.encoded_image_url_1}
                                          alt={cartItemsVal.product_name}
                                        />
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="col-lg-9 ps-1">
                                    <div className="dowehriwerwer sdvwdewrwerwere">
                                      <div className="dknwekhwe">
                                        <div className="dokwejlkpewr d-flex flex-wrap align-items-center justify-content-between">
                                          <div className="d-flex align-items-center justify-content-between w-100 mb-1">
                                            <h6 className="mb-0">{cartItemsVal.designer}</h6>

                                            <div className="diejwijrwer">
                                              <i
                                                onClick={() =>
                                                  toggleWishlist(
                                                    cartItemsVal.products_table_id
                                                  )
                                                }
                                                className={
                                                  wishlistIds.includes(
                                                    cartItemsVal.products_table_id
                                                  )
                                                    ? "bi bi-heart-fill"
                                                    : "bi me-2 bi-heart"
                                                }
                                                style={{ cursor: "pointer" }}
                                              ></i>
                                              <i class="bi bi-trash3" onClick={() => handleRemoveItem(cartItemsVal.id)}></i>
                                            </div>
                                          </div>

                                          <p className="mb-0">
                                            {cartItemsVal.product_name}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="dnweghbjewrwer">                                      
                                        <p className="mb-0">Colour: {cartItemsVal.color} | {cartItemsVal.stitch_option === 'customFit' ? (
                                              <>
                                                Size: Custom Fit
                                              </>
                                            ) : cartItemsVal.size === '' ? (
                                              <>
                                                Stitching Option : {cartItemsVal.actual_stitch_option}
                                              </>
                                            ) : (
                                              <>
                                                {cartItemsVal.size}
                                              </>
                                            )}</p>

                                        <p className="mb-1">Price: 
                                          <span>
                                            {formatPrice(cartItemsVal.actual_price, { showDecimals: true })}
                                          </span>
                                        </p>

                                        <h6 className="sadcadaededee mb-0"><i class="bi me-1 bi-truck"></i> {cartItemsVal.non_returnable}</h6>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>

      <div id="paypal-container" style={{ display: "none" }}></div>

      <div className="col-lg-12" style={{ display: key === "cart" ? "block" : "none" }}>
        <div className="diweurbhwer_inner container-fluid mt-4">
          <TrandingProduct />
        </div>
      </div>

      {/* <div className="col-lg-12">
        <div className="diweurbhwer_inner container-fluid mt-4">
          <RecentlyViewed />
        </div>
      </div> */}

      {/*coupon code modal*/}

      <div onClick={handleCouponClose} className={`${couponModal ? "coupon-modal-backdrop" : "coupon-modal-backdrop coupon-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${couponModal ? "coupon-modal" : "coupon-modal coupon-modal-hide"} bg-white position-fixed h-100`}>
        <div className="oiasmdjweijrwerwer h-100">
          <div className="dsfgrrdeaeerr mb-3 d-flex align-items-center justify-content-between p-4 pb-0">
            <p className="mb-0">COUPONS</p>

            <Link onClick={handleCouponClose} to="">Close</Link>
          </div>

          <div className="px-4">
            <div className="dewuihrwe position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Coupon Code"
                // value={selectedCoupon}
                value=""
                // disabled={couponApplied}
                // onChange={(e) => {
                //   const value = e.target.value;
                //   setSelectedCoupon(value);

                //   const coupon = couponItems.find(c => c.code === value);

                //   if (!coupon || !coupon.is_applicable || !coupon.is_matched) {
                //     setSelectedDiscount(0);
                //     setAppliedDiscount(0);
                //     setFreeShipping(false);
                //     setShippingDiscount(0);
                //     return;
                //   }

                //   let discount = coupon.type === "percent"
                //     ? (Number(totalPrice.cart_totalPrice) * parseInt(coupon.value)) / 100
                //     : parseInt(coupon.value);

                //   setSelectedDiscount(discount);
                //   setAppliedDiscount(discount);

                //   if (coupon.apply_ShippingCost === "Yes") {
                //     setFreeShipping(true);
                //     setShippingDiscount(shippingCharge);
                //   } else {
                //     setFreeShipping(false);
                //     setShippingDiscount(0);
                //   }
                // }}
              />


              <button
                  type="button"
                  className="btn position-absolute btn-main"
                  // onClick={() => {
                  //   const coupon = couponItems.find(c => c.code === selectedCoupon);
                  //   if (!coupon || !coupon.is_applicable || !coupon.is_matched) return;
                  //   setCouponApplied(true);
                  // }}
                >
                  Apply
                </button>
              {/* {!couponApplied ? (
                <button
                  type="button"
                  className="btn position-absolute btn-main"
                  onClick={() => {
                    const coupon = couponItems.find(c => c.code === selectedCoupon);
                    if (!coupon || !coupon.is_applicable || !coupon.is_matched) return;
                    setCouponApplied(true);
                  }}
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
                    setFreeShipping(false);
                    setShippingDiscount(0);
                  }}
                >
                  Remove
                </button>
              )} */}
            </div>
          </div>

          <div className={`doeiwjorjweorwer mt-4 ${(couponItems.length < 3) ? "px-4" : "ps-4"}`}>
            <h5 className="mb-4 text-center">Offers Available To Apply</h5>

            <div className="deoiwjrewrwer">
              {couponItems?.sort((a, b) => {
                const aEnabled =
                  a.is_applicable && a.is_matched ? 1 : 0;
                const bEnabled =
                  b.is_applicable && b.is_matched ? 1 : 0;
                return bEnabled - aEnabled;
              })
              ?.map((couponItemsVal) => (
                <div className="jidnwenjrwerwer mb-2">
                  <input
                    id={couponItemsVal.code}
                    name="coupon"
                    type="radio"
                    className="d-none position-absolute"
                    checked={selectedCoupon === couponItemsVal.code}
                    disabled={couponApplied || !couponItemsVal.is_applicable || !couponItemsVal.is_matched}
                    // onChange={() => {
                    //   if (!couponItemsVal.is_applicable || !couponItemsVal.is_matched) return;

                    //   setSelectedCoupon(couponItemsVal.code);

                    //   let discount = couponItemsVal.type === "percent"
                    //     ? (Number(totalPrice.cart_totalPrice) * parseInt(couponItemsVal.value)) / 100
                    //     : parseInt(couponItemsVal.value);

                    //   setSelectedDiscount(discount);
                    //   setAppliedDiscount(discount);
                    // }}

                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCoupon(value);

                      const coupon = couponItems.find(c => c.code === value);

                      if (!coupon || !coupon.is_applicable || !coupon.is_matched) {
                        setSelectedDiscount(0);
                        setAppliedDiscount(0);
                        setFreeShipping(false);
                        setShippingDiscount(0);
                        return;
                      }

                      let discount = coupon.type === "percent"
                        ? (Number(totalPrice.cart_totalPrice) * parseInt(coupon.value)) / 100
                        : parseInt(coupon.value);

                      setSelectedDiscount(discount);
                      setAppliedDiscount(discount);

                      if (coupon.apply_ShippingCost === "Yes") {
                        setFreeShipping(true);
                        setShippingDiscount(shippingCharge);
                      } else {
                        setFreeShipping(false);
                        setShippingDiscount(0);
                      }
                    }}
                  />

                  <label
                    htmlFor={couponItemsVal.code}
                    className={`w-100 position-relative ${
                    (!couponItemsVal.is_applicable || !couponItemsVal.is_matched)
                        ? "coupon-disabled"
                        : ""
                    }`}
                  >
                    <div class="coupon">
                      <div class="center">
                        <div>
                          <h3>{couponItemsVal.code}</h3>

                          <h6 className="pb-2">Valid until <b>{ValidityDate(couponItemsVal.expiry_date)}</b></h6>

                          <h5>Get instant discount worth &nbsp;
                            {couponItemsVal.type === 'percent'
                              ? `${Math.round(couponItemsVal.value)}%`
                              : `${formatPrice(Math.round(couponItemsVal.value))}`
                            }
                          </h5>

                          <div className="fsdrwedewee mt-2 text-center">
                            {selectedCoupon !== couponItemsVal.code ? (
                              <Link
                                to=""
                                className={
                                  (!couponItemsVal.is_applicable || !couponItemsVal.is_matched)
                                    ? "disabled"
                                    : ""
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!couponItemsVal.is_applicable || !couponItemsVal.is_matched) return;

                                  setSelectedCoupon(couponItemsVal.code);
                                  setCouponApplied(true);

                                  let discount = couponItemsVal.type === "percent"
                                    ? (Number(totalPrice.cart_totalPrice) * parseInt(couponItemsVal.value)) / 100
                                    : parseInt(couponItemsVal.value);

                                  setSelectedDiscount(discount);
                                  setAppliedDiscount(discount);

                                  if (couponItemsVal.apply_ShippingCost === "Yes") {
                                    setFreeShipping(true);
                                    setShippingDiscount(shippingCharge);
                                  } else {
                                    setFreeShipping(false);
                                    setShippingDiscount(0);
                                  }
                                }}
                              >
                                TAP TO APPLY
                              </Link>
                              ) : (
                                <Link
                                  to=""
                                  className="d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedCoupon("");
                                    setSelectedDiscount(0);
                                    setAppliedDiscount(0);
                                    setCouponApplied(false);
                                    setFreeShipping(false);
                                    setShippingDiscount(0);
                                  }}
                                >
                                <i style={{ transform: "initial", marginTop: "1px" }} className="bi copn-checked-icon me-1 bi-check-circle-fill"></i> Remove
                              </Link>
                             )}
                          </div>
                        </div>
                      </div>

                      <div class="right">
                        {/* <div>{couponItemsVal.code}</div> */}

                        <div className="sdsgfsede text-center">
                          <div className="dsekbjnerewr">
                            <h5 className="text-white mb-1">VOUCHER</h5>

                            <img src="./images/cpncde.png" className="img-fluid" style={{ width: "8rem" }} alt="" />
                          </div>

                          <h6 className="text-white mb-0" style={{marginTop: "1rem"}}>*T&C Apply</h6>
                        </div>
                      </div>
                    </div>
                    {(couponItemsVal.is_applicable && couponItemsVal.is_matched)
                        ? <img src="./images/cissor.png" className="w-100 p-3" alt="" />
                        : ""
                    }                    
                  </label>

                  {!couponItemsVal.is_applicable ? (
                    <h4 className="oijiwuihfih-eiuheir my-4 text-center">
                      {couponItemsVal.disable_reason}
                    </h4>
                  ) : !couponItemsVal.is_matched ? (
                    <h4 className="oijiwuihfih-eiuheir my-4 text-center">
                      This coupon is not valid for products in your cart
                    </h4>
                  ) : null}       
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/*shipping address modal*/}

      <div className={`${addressModal ? "address-modal-backdrop" : "address-modal-backdrop address-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${addressModal ? "address-modal" : "address-modal address-modal-hide"} bg-white position-fixed`}>
        <div className="oiasmdjweijrwerwer">
          <div className="dsfgrrdeaeerr d-flex align-items-center justify-content-between px-4 pt-3 pb-0">
            <p className="mb-0">ADD SHIPPING ADDRESS</p>
            <i onClick={handleAddressClose} class="bi bi-x"></i>
          </div>

          <div className="deiwjiurhweijew px-4 pb-4">
            <form className="asdsefewweee row" onSubmit={handleSaveShipping}>
              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_first_name"
                  placeholder="First Name*" 
                  value={shippingData.shipping_first_name}
                  onChange={handleInputChange}
                />
                {errors.shipping_first_name && <small className="text-danger">{errors.shipping_first_name}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_last_name"
                  placeholder="Last Name*"
                  value={shippingData.shipping_last_name}
                  onChange={handleInputChange}
                />
                {errors.shipping_last_name && <small className="text-danger">{errors.shipping_last_name}</small>}
              </div> 

              <div className="col-lg-12 mb-2">
                {/* <select 
                  name="shipping_country" 
                  className="form-select h-100"
                  value={shippingData.shipping_country}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  {shippingCountry.map((item) => (
                    <option key={item.country_name} value={item.country_name}>
                      {item.country_name}
                    </option>
                  ))}
                </select> */}
                <SearchableSelect
                  name="shipping_country"
                  value={shippingData.shipping_country}
                  options={countryOptions}
                  onChange={handleInputChange}
                  placeholder="Select Country"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              </div>

              <div className="col-lg-12 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_pincode" 
                  placeholder="Zip / Postal Code*"
                  value={shippingData.shipping_pincode}
                  onChange={handleInputChange}
                />
                {errors.shipping_pincode && <small className="text-danger">{errors.shipping_pincode}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_aptNo" 
                  placeholder="Apt. Building Floor*"
                  value={shippingData.shipping_aptNo}
                  onChange={handleInputChange}
                />
                {errors.shipping_aptNo && <small className="text-danger">{errors.shipping_aptNo}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_street_address"
                  placeholder="Street Address*"
                  value={shippingData.shipping_street_address}
                  onChange={handleInputChange}
                />
                {errors.shipping_street_address && <small className="text-danger">{errors.shipping_street_address}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_landmark"
                  placeholder="Landmark*"
                  value={shippingData.shipping_landmark}
                  onChange={handleInputChange}
                />
                {errors.shipping_landmark && <small className="text-danger">{errors.shipping_landmark}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_city"
                  placeholder="City*"
                  value={shippingData.shipping_city}
                  onChange={handleInputChange}
                />
                {errors.shipping_city && <small className="text-danger">{errors.shipping_city}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_state" 
                  placeholder="State*"
                  value={shippingData.shipping_state}
                  onChange={handleInputChange}
                />
                {errors.shipping_state && <small className="text-danger">{errors.shipping_state}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                <div className="row align-items-center">
                  <div className="col-3">
                    {/* <input 
                      type="text" 
                      className="form-control"
                      name="shipping_mobileCode" 
                      value={shippingData.shipping_mobileCode}
                      onChange={handleInputChange}
                    /> */}
                    <select 
                      name="shipping_mobileCode" 
                      className="form-select h-100"
                      value={shippingData.shipping_mobileCode}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Country Code</option>
                      {shippingCountry.map((item) => (
                        <option
                          key={item.country_code}
                          value={`+${item.country_code}`}
                        >
                          +{item.country_code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-9">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="shipping_mobile_number" 
                      placeholder="Mobile Number of Recipient*"
                      value={shippingData.shipping_mobile_number}
                      onChange={handleInputChange}
                    />
                    {errors.shipping_mobile_number && <small className="text-danger">{errors.shipping_mobile_number}</small>}
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mb-4">
                <input 
                  type="email" 
                  className="form-control" 
                  name="shipping_email"
                  placeholder="Email Id*"
                  value={shippingData.shipping_email}
                  onChange={handleInputChange}
                />
                {errors.shipping_email && <small className="text-danger">{errors.shipping_email}</small>}
              </div>

              <div className="col-lg-12">
                <div className="dsdgsreefrrr d-flex">
                  <label className="form-label">ADDRESS AS:</label>

                  <div className="doweirwerr">
                    <div className="d-flex flex-wrap align-items-center">
                      {["HOME", "OFFICE", "OTHERS"].map((type, index) => (
                        <div className="form-check mx-3" key={index}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="shipping_address_as"
                            value={type}
                            checked={shippingData.shipping_address_as === type}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.shipping_address_as && <small className="text-danger">{errors.shipping_address_as}</small>}
              </div>

              <div className="col-lg-12">
                <div className="aswdreqwewqe d-flex mt-2 mb-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox"
                      name="shipping_default_addrss"
                      checked={shippingData.shipping_default_addrss}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">Make this as my default shipping address</label>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="deiwhrwerwe row align-items-center justify-content-between">
                  <div className="col-5">
                    <button type="submit" className="btn btn-main w-100">SAVE</button>
                  </div>

                  <div className="col-5">
                    <Link onClick={handleAddressClose} className="btn btn-main w-100">CANCEL</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/*billing address modal*/}

      <div className={`${billingAddressModal ? "billing-address-modal-backdrop" : "billing-address-modal-backdrop billing-address-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${billingAddressModal ? "billing-address-modal" : "billing-address-modal billing-address-modal-hide"} bg-white position-fixed`}>
        <div className="oiasmdjweijrwerwer">
          <div className="dsfgrrdeaeerr d-flex align-items-center justify-content-between px-4 pt-3 pb-0">
            <p className="mb-0">ADD BILLING ADDRESS</p>

            <i onClick={handleBillingAddressClose} class="bi bi-x"></i>
          </div>

          <div className="deiwjiurhweijew px-4 pb-4">
            <form className="asdsefewweee row"  onSubmit={handleSaveBilling}>
              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_first_name"
                  placeholder="First Name*" 
                  value={billingData.billing_first_name}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_first_name && <small className="text-danger">{errors.billing_first_name}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_last_name"
                  placeholder="Last Name*"
                  value={billingData.billing_last_name}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_last_name && <small className="text-danger">{errors.billing_last_name}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                {/* <select 
                  name="billing_country" 
                  className="form-select h-100"
                  value={billingData.billing_country}
                  onChange={handleInputChangeBilling}
                >
                  <option value="">Select Country</option>
                  {shippingCountry.map((item) => (
                    <option key={item?.country_name} value={item?.country_name}>
                      {item?.country_name}
                    </option>
                  ))}
                </select> */}
                <SearchableSelect
                  name="billing_country"
                  value={billingData.billing_country}
                  options={countryOptions}
                  onChange={handleInputChangeBilling}
                  placeholder="Select Country"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              </div>

              <div className="col-lg-12 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_pincode" 
                  placeholder="Zip / Postal Code*"
                  value={billingData.billing_pincode}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_pincode && <small className="text-danger">{errors.billing_pincode}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_aptNo" 
                  placeholder="Apt. Building Floor*"
                  value={billingData.billing_aptNo}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_aptNo && <small className="text-danger">{errors.billing_aptNo}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_street_address"
                  placeholder="Street Address*"
                  value={billingData.billing_street_address}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_street_address && <small className="text-danger">{errors.billing_street_address}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_city"
                  placeholder="City*"
                  value={billingData.billing_city}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_city && <small className="text-danger">{errors.billing_city}</small>}
              </div>

              <div className="col-lg-6 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_state"
                  placeholder="State*"
                  value={billingData.billing_state}
                  onChange={handleInputChangeBilling} />
                {errors.billing_state && <small className="text-danger">{errors.billing_state}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  name="billing_landmark"
                  placeholder="Landmark*"
                  value={billingData.billing_landmark}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_landmark && <small className="text-danger">{errors.billing_landmark}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                <div className="row align-items-center">
                  <div className="col-3">
                    {/* <input 
                      type="text" 
                      className="form-control"
                      name="billing_mobileCode" 
                      value={billingData.billing_mobileCode}
                      onChange={handleInputChangeBilling}
                    /> */}
                    <select 
                      name="billing_mobileCode" 
                      className="form-select h-100"
                      value={billingData.billing_mobileCode}
                      onChange={handleInputChangeBilling}
                    >
                      <option value="">Select Country Code</option>
                      {shippingCountry.map((item) => (
                        <option
                          key={item.country_code}
                          value={`+${item.country_code}`}
                        >
                          +{item.country_code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-9">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="billing_mobile_number" 
                      placeholder="Mobile Number of Recipient*"
                      value={billingData.billing_mobile_number}
                      onChange={handleInputChangeBilling}
                    />
                    {errors.billing_mobile_number && <small className="text-danger">{errors.billing_mobile_number}</small>}
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mb-2">
                <input 
                  type="email" 
                  className="form-control" 
                  name="billing_email"
                  placeholder="Email Id*"
                  value={billingData.billing_email}
                  onChange={handleInputChangeBilling}
                />
                {errors.billing_email && <small className="text-danger">{errors.billing_email}</small>}
              </div>

              <div className="col-lg-12 mb-2">
                <div className="dsdgsreefrrr d-flex">
                  <label className="form-label">ADDRESS AS:</label>

                  <div className="doweirwerr">
                    <div className="d-flex flex-wrap align-items-center">
                      {["HOME", "OFFICE", "OTHERS"].map((type, index) => (
                        <div className="form-check mx-3" key={index}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="billing_address_as"
                            value={type}
                            checked={billingData.billing_address_as === type}
                            onChange={handleInputChangeBilling}
                          />
                          <label className="form-check-label">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.billing_address_as && <small className="text-danger">{errors.billing_address_as}</small>}
              </div>

              {/* <div className="aswdreqwewqe d-flex mt-2 mb-3">
                <div className="doweirwerr">
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="dweqweqee" value="" />
                      
                      <label className="form-check-label" for="dweqweqee">Make this as my default shipping address</label>
                    </div>
                  </div>
                </div>
              </div> */}
              
              <div className="col-lg-12">
                <div className="deiwhrwerwe row align-items-center justify-content-between">
                  <div className="col-5">
                    <button type="submit" className="btn btn-main w-100">SAVE</button>
                  </div>

                  <div className="col-5">
                    <Link onClick={handleBillingAddressClose} className="btn btn-main w-100">CANCEL</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;