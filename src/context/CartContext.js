import { createContext, useCallback, useContext, useEffect, useState } from "react";
import http from "../http";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useCurrency } from "./CurrencyContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const { selectedCurrency } = useCurrency();

  const [cartCount, setCartCount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);


  const resetCart = () => {
    setCartItems([]);
    setCartCount(0);
    setSelectedCoupon("");
    setAppliedDiscount(0);
    setCouponApplied(false);

    localStorage.removeItem("final_total");
    localStorage.removeItem("gst_number");
  };

  // ✅ Fetch cart count from API
  const fetchCartCount = useCallback(async () => {

    if (!token || !selectedCurrency) {
      setCartCount(0); // clear if not logged in
      return;
    }

    try {
      const res = await http.post(
        "/user/get-cart-user",
        {
          country: selectedCurrency.country_name, // ✅ safe now
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartCount(res.data.data.length || 0);
    } catch (err) {
      console.error("Error fetching cart count", err);
      setCartCount(0);
    }
  }, [token, selectedCurrency]); // ✅ added token as dependency

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]); // ✅ added fetchCartCount


  const addToCart = async (productData) => {
    if (!token) {
      toast.error("Please login to add to cart");
      return;
    }

    setLoading(true);

    try {
      const res = await http.post(
        "/user/user-add-cart",
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product added to cart");
        fetchCartCount(); // refresh count
      } else {
        toast.info(res.data.message || "Product already exists in cart");
      }
    } catch (err) {
      toast.error("Something went wrong while adding to cart, Please Login Again!!");
    } finally{
      setLoading(false);
    }
  };

  // ✅ When login/logout happens
  useEffect(() => {
    if (token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [token, fetchCartCount]); // ✅ added fetchCartCount also

  return (
    <CartContext.Provider value={{ 
      loading,
      cartCount, 
      addToCart, 
      fetchCartCount, 
      setCartCount, 
      cartItems,
      setCartItems,
      selectedCoupon,
      setSelectedCoupon,
      appliedDiscount,
      setAppliedDiscount,
      couponApplied,
      setCouponApplied,
      resetCart }}>
      {children}
    </CartContext.Provider>

  );
}

export function useCart() {
  return useContext(CartContext);
}
