  // eslint-disable-next-line
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { SwiperSlide } from 'swiper/react';
import { useAuth } from "../../../context/AuthContext";
import { DropdownLoggedIn } from "../../Elements/Dropdown/DropdownLoggedIn";
import http from "../../../http";
import Logo from "../../../assets/images/logo.png";
import "./Css/Header.css";
import "./Css/HeaderResponsive.css";
import 'swiper/css';
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useAuthModal } from "../../../context/AuthModalContext";
import { ResponsiveNavbarBottom } from "../../../components";
  // eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Header = ({ shouldHideHeader, shouldHideFullHeaderFooterRoutes, shouldHideHeaderCategoryRoutes }) => {
  const [resMenu, setResMenu] = useState(false);
    // eslint-disable-next-line
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchCurrency, setSearchCurrency] = useState("");
    // eslint-disable-next-line
  const [searchBarToggle, setSearchBarToggle] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchRefRes = useRef(null);
  const [resCtgyDrpdwn, setResCtgyDrpdwn] = useState(false);
  const [resSearchToggle, setResSearchToggle] = useState(false);
  // const [headerFixed, setHeaderFixed] = useState(false);

  // const [loginModal, setLoginModal] = useState(false);
  // const [loginModalBackdrop, setLoginModalBackdrop] = useState(false);
  // const [otpModal, setOtpModal] = useState(false);
  // const [completeLoginModal, setCompleteLoginModal] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const headerStickyWrapper = document.querySelector(".header-sticky-wrapper");

  //     if (headerStickyWrapper?.classList.contains("is-fixed-top")) {
  //       setHeaderFixed(true);
  //     } else {
  //       setHeaderFixed(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    setResSearchToggle(false);
  }, [pathName]);
  
  const {
    loginModal,
    loginModalBackdrop,
    otpModal,
    completeLoginModal,
    setOtpModal,
    setCompleteLoginModal,
    handleLoginModal,
    handleLoginClose,
  } = useAuthModal();
  const [emailToggle, setEmailToggle] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [countryCodes, setCountryCodes] = useState([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
      // eslint-disable-next-line
  const [isNewUser, setIsNewUser] = useState(false);
  const [fullname, setFullname] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);  
  const { dispatch } = useAuth();
  const [resSignBottom, setResSignBottom] = useState(false);

  // remember verified contact
  const [verifiedContact, setVerifiedContact] = useState({
    email: "",
    mobile: "",
    countryCode: ""
  });
  const [otpContact, setOtpContact] = useState({
    email: "",
    mobile: "",
    countryCode: ""
  });


  useEffect(() => {
      const fetchCountryCode = async () => {
          try {
              const getresponse = await http.get("/get-country-code");
              const allresponse = getresponse.data;
              setCountryCodes(allresponse.data); 
          } catch (error) {
              console.error("Error fetching Country Code:", error);
          }
      };

      fetchCountryCode();
  }, []);

  // TIMER / RESEND
  const [timer, setTimer] = useState(50);
  const [resendEnabled, setResendEnabled] = useState(false);
  const timerRef = useRef(null);

  const otpRefs = useRef([]);

  // AUTO-FOCUS OTP INPUTS
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // TIMER LOGIC
  useEffect(() => {
    if (otpModal) {
      setTimer(50);
      setResendEnabled(false);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [otpModal]);

  // SEND OTP
  const sendOtp = async () => {
    if (emailToggle && !email) return alert("Email required");
    if (!emailToggle && mobile.length !== 10)
      return alert("Valid mobile number required");

    try {
      const res = await http.post("/user/send-otp", {
        email: emailToggle ? email : undefined,
        mobile: !emailToggle ? mobile : undefined,
        countryCode: !emailToggle ? selectedCode : undefined,
      });

      setOtpContact({
        email: emailToggle ? email : "",
        mobile: !emailToggle ? mobile : "",
        countryCode: !emailToggle ? selectedCode : "",
      });

      setIsNewUser(res.data.action === "register");
        handleLoginClose();
        setOtpModal(true);
      // setLoginModal(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return alert("Enter full OTP");

    try {
      const response = await http.post("/user/verify-otp", {
        email: emailToggle ? email : undefined,
        mobile: !emailToggle ? mobile : undefined,
        countryCode: !emailToggle ? selectedCode : undefined,
        otp: enteredOtp,
      });

      if (response.data.success) {
        setOtpModal(false);

        // 🔥 EXISTING USER → LOGIN
        if (response.data.login) {
          dispatch({
            type: "LOGIN",
            payload: {
              token: response.data.data.jwtToken,
              user: response.data.data.user,
            }
          });

          // setOtpModal(false);
          // setLoginModalBackdrop(false);
          handleLoginClose();
          navigate("/");
        }

        // 🔥 NEW USER → COMPLETE SIGNUP
        else {
          setCompleteLoginModal(true);
          setVerifiedContact({
            email: emailToggle ? email : "",
            mobile: !emailToggle ? mobile : "",
            countryCode: selectedCode
          });

          setOtpModal(false);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const resendOtp = () => {
    if (resendEnabled) sendOtp();
  };


  const completeSignup = async (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      alert("Full name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await http.post("/user/complete-signup", {
        fullname,
        email: verifiedContact.email || undefined,
        mobile: verifiedContact.mobile || undefined,
        countryCode: verifiedContact.countryCode,
        referral_code: referral,
      });

      // localStorage.setItem("jwt_token", res.data.data.jwtToken);
      dispatch({
        type: "LOGIN",
        payload: {
          token: res.data.data.jwtToken,
          user: res.data.data.user,
        }
      });

      
      // setLoginModalBackdrop(false);
      handleLoginClose();
      setCompleteLoginModal(false);

      navigate("/");

      // toast.success("Register Successfull", {
      //   style: {
      //     background: "#2ecc71",
      //     color: "#fff",
      //   },
      // });

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const body = document.querySelector("body");

    body.addEventListener("click", () => setUserDropdown(false));

    return () => {
      body.removeEventListener("click", () => setUserDropdown(false));
    }
  }, []);
  /*search*/
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = searchRef.current?.value?.trim();

    searchValue && navigate(`/all-products?search=${encodeURIComponent(searchValue)}`);
    
    searchRef.current.value = "";
  }

  /*res search*/

  const handleResSearch = (e) => {
    e.preventDefault();
    const searchValue = searchRefRes.current?.value?.trim();

    searchValue && navigate(`/all-products?search=${encodeURIComponent(searchValue)}`);
    
    searchRefRes.current.value = "";
  }

  useEffect(() => {
    const body = document.querySelector("html");

    if (resMenu) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }, [resMenu]);

  useEffect(() => {
    setResMenu(false);
  }, [pathName]);

  const { user } = useAuth();

  const [mainCategory, SetmainCategory] = useState([]);
  const [currency, Setcurrency] = useState([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  useEffect(() => {
    const handleCurrencyDropdownClose = () => {
      setShowCurrencyDropdown(false);
    }

    document.body.addEventListener("click", handleCurrencyDropdownClose);

    return () => {
      document.body.removeEventListener("click", handleCurrencyDropdownClose);
    }
  }, []);


  useEffect(() => {
      const fetchMainCategory = async () => {
          try {
              const getresponse = await http.get("/product-category");
              const allresponse = getresponse.data;
              SetmainCategory(allresponse.data); 
          } catch (error) {
              console.error("Error fetching main category:", error);
          }
      };

      fetchMainCategory();
  }, []);

  useEffect(() => {
    const fetchCurrency = async () => {
        try {
          
            const getresponse = await http.get("/get-currency-content");
            const allresponse = getresponse.data;
            Setcurrency(allresponse.data || []);

            // 👇 Step 1: Try to get previously saved currency
            const savedCurrency = localStorage.getItem("selectedCurrency");

            if (savedCurrency) {
              // Parse and set saved currency
              setSelectedCurrency(JSON.parse(savedCurrency));
            } else {
              // 👇 Step 2: Fallback to default choice = 1
              const defaultCurrency = allresponse.data?.find(c => c.choice === 1);
              if (defaultCurrency) {
                setSelectedCurrency(defaultCurrency);
                // Also save it in localStorage
                localStorage.setItem("selectedCurrency", JSON.stringify(defaultCurrency));
              }
            }
        } catch (error) {
            console.error("Error fetching currency:", error);
        }
    };
    fetchCurrency();
  }, [setSelectedCurrency]);

  const filteredCurrency = currency.filter((cur) => {
    if (!searchCurrency.trim()) return true; // show all by default

    return (
      cur.currency_type.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      cur.currency_code.toLowerCase().includes(searchCurrency.toLowerCase())
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    setUserDropdown(false);
  }, [pathName]);

        // eslint-disable-next-line
  const openPhoneEmailOtp = () => {

    const containerId = emailToggle ? "emailLogin" : "phoneLogin";
    const container = document.getElementById(containerId);

    if (!container) {
      console.log("Phone.Email container not found");
      return;
    }

    const btn = container.querySelector("button");

    if (!btn) {
      console.log("Phone.Email button not ready");
      return;
    }

    btn.click();
  };


  useEffect(() => {
    if (!window.phoneEmailLoaded) {
      const script = document.createElement("script");
      script.src = "https://www.phone.email/sign_in_button_v1.js";
      script.async = true;
      script.onload = () => {
        window.phoneEmailLoaded = true;
      };
      document.body.appendChild(script);

      const emailScript = document.createElement("script");
      emailScript.src = "https://www.phone.email/verify_email_v1.js";
      emailScript.async = true;
      document.body.appendChild(emailScript);
    }
  }, []);

 

 const handleVerificationSuccess = useCallback(async (user_json_url) => {
    try {
      const res = await http.post(
        "/user/phone-email-login",
        { user_json_url }
      );

      if (res.data.action === "login") {

        setOtpModal(false);

        dispatch({
          type: "LOGIN",
          payload: {
            token: res.data.data.jwtToken,
            user: res.data.data.user,
          }
        });

        handleLoginClose();
        // navigate('/');
        window.location.reload();
        // toast.success("Login Successfull", {
        //   style: {
        //     background: "#2ecc71",
        //     color: "#fff",
        //   },
        // });
      }

      if (res.data.action === "register") {
        setOtpModal(false);
        setVerifiedContact(res.data.data);
        setCompleteLoginModal(true);
      }

    } catch (err) {
      console.error(err);
    }
  }, [setOtpModal, setCompleteLoginModal, handleLoginClose, dispatch]);

  useEffect(() => {
    window.phoneEmailListener = function (userObj) {
      handleVerificationSuccess(userObj.user_json_url);
    };

    window.phoneEmailReceiver = function (userObj) {
      handleVerificationSuccess(userObj.user_json_url);
    };

  }, [handleVerificationSuccess]);

  //login modal

  // const handleLoginModal = () => {
  //   setLoginModal(!loginModal);
  //   setLoginModalBackdrop(!loginModalBackdrop);
  // };

  // const handleLoginClose = () => {
  //   setLoginModal(false);
  //   setLoginModalBackdrop(false);
  //   setOtpModal(false);
  //   setCompleteLoginModal(false);
  // };



  return (
    <>
      { !shouldHideFullHeaderFooterRoutes && (
        <header>
          <div className="advertisement-slider position-relative" style={{background: "url('/images/csadad.jpg') no-repeat", backgroundPosition: "top", backgroundSize: "cover"}}>
          <div className="marquee-container">
            <div className="marquee-track marquee-left">
              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>
            </div>
          </div>
          </div>

          <div className={`header-sticky-wrapper ${isSticky ? "is-fixed-top" : ""} ${shouldHideHeader ? "d-none" : ""}`}>
            <div className="doiemwokjrmwewer w-100">
              { !shouldHideHeader && (
              <div className="header-top py-2">
                <div className="container-fluid">
                  <div className="gvredeewerrr row align-items-center justify-content-between">
                    <div className="col-lg-4">
                      <div className="soifjoejopeor d-flex align-items-center">
                        <div className="doeiwhrkwdeor">
                          <div className="custom-currency-dropdown wlojdfiwejrower col-4 d-none position-relative">
                            <button
                                className="currency-toggle-btn d-flex align-items-center"

                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCurrencyDropdown(prev => !prev);
                                }}
                              >
                                <span className="me-2">
                                  <img
                                    src={selectedCurrency?.flag_icon || "https://flagcdn.com/24x18/in.png"}
                                    // src={selectedCurrency?.flag_icon}
                                    alt={selectedCurrency?.currency_code || "INR"}
                                    width="24"
                                    height="18"
                                  />
                                </span>

                                <span>{selectedCurrency?.currency_code || "INR"}</span>

                                <i
                                  className={`fa-solid ms-2 ${
                                    showCurrencyDropdown ? "fa-chevron-up" : "fa-chevron-down"
                                  }`}
                                ></i>
                              </button>

                            {showCurrencyDropdown && (
                              <div onClick={(e) => e.stopPropagation()} className="osjoidhwjiwer dwelorjwemr-res position-absolute bg-white shadow rounded-3 mt-2 p-2">
                                <div className="dmndfkswndfiofrsmk position-relative">
                                  <input type="text" placeholder="Search for a region" value={searchCurrency}
                                    onChange={(e) => setSearchCurrency(e.target.value)} className="form-control py-1" />
                                  <i
                                    className={`bi position-absolute ${searchCurrency.length > 0 ? "bi-x" : "bi-search"}`}
                                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                                    onClick={() => {
                                      if (searchCurrency.length > 0) {
                                        setSearchCurrency("");   // Clear search when clicking cross
                                      }
                                    }}
                                  ></i>
                                </div>

                                <ul className="currency-menu mb-0 px-0">
                                  {filteredCurrency.map((cur) => (
                                    <li
                                      key={cur.id}
                                      className="currency-item d-flex align-items-center p-2"
                                      onClick={() => {
                                        setSelectedCurrency(cur);
                                        localStorage.setItem("selectedCurrency", JSON.stringify(cur));
                                        setShowCurrencyDropdown(false);
                                      }}
                                    >
                                      <span className={`res-currncy-radio ${(selectedCurrency.id === cur.id) ? "res-currncy-radio-checked" : ""}`}></span>

                                      <span className="me-2">
                                        <img
                                          src={cur.flag_icon}
                                          alt={cur.currency_code}
                                          width="24"
                                          height="18"
                                        />
                                      </span>
                                      <span>
                                        {cur.currency_type} ({cur.currency_code})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <Link to="/" className="duiewhewijrrqq"><img src={Logo} className="img-fluid" alt="" /></Link>
                        </div>

                        <div className="qweqweqewqw">
                          {/* <Form.Select
                            className="me-2"
                            aria-label="Select currency"
                            value={selectedCurrency?.id || currency.find(c => c.choice === 1)?.id || ""}
                            onChange={(e) => {
                              const selectedObj = currency.find(c => c.id === parseInt(e.target.value));
                              setSelectedCurrency(selectedObj);
                            }}
                          >
                            {currency.map((allCurrency) => (
                              <option
                                key={allCurrency.id}
                                value={allCurrency.id}
                                selected={allCurrency.choice === 1}
                              >
                                {allCurrency.currency_type} ({allCurrency.currency_code})
                              </option>
                            ))}
                          </Form.Select> */}

                          <div className="custom-currency-dropdown sfwedweweeqweqwe position-relative">
                            <button className="currency-toggle-btn d-flex align-items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCurrencyDropdown(!showCurrencyDropdown);
                                }}
                              >
                                <span className="me-2">
                                  <img
                                    src={selectedCurrency?.flag_icon || "https://flagcdn.com/24x18/in.png"}
                                    // src={selectedCurrency?.flag_icon}
                                    alt={selectedCurrency?.currency_code || "INR"}
                                    width="24"
                                    height="18"
                                  />
                                </span>

                                <span>{selectedCurrency?.currency_code || "INR"}</span>

                                <i
                                  className={`fa-solid ms-2 ${
                                    showCurrencyDropdown ? "fa-chevron-up" : "fa-chevron-down"
                                  }`}
                                ></i>
                              </button>

                            {showCurrencyDropdown && (
                              <div onClick={(e) => e.stopPropagation()} className="osjoidhwjiwer position-absolute bg-white shadow rounded-3 mt-2 p-2">
                                <div className="dmndfkswndfiofrsmk position-relative">
                                  <input type="text" placeholder="Search for a region" value={searchCurrency}
                                    onChange={(e) => setSearchCurrency(e.target.value)} className="form-control py-1" />
                                  <i
                                    className={`bi position-absolute ${searchCurrency.length > 0 ? "bi-x" : "bi-search"}`}
                                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                                    onClick={() => {
                                      if (searchCurrency.length > 0) {
                                        setSearchCurrency("");   // Clear search when clicking cross
                                      }
                                    }}
                                  ></i>
                                </div>

                                <ul className="currency-menu mb-0 px-0">
                                  {filteredCurrency.map((cur) => (
                                    <li
                                      key={cur.id}
                                      className="currency-item d-flex align-items-center p-2"
                                      onClick={() => {
                                        setSelectedCurrency(cur);
                                        localStorage.setItem("selectedCurrency", JSON.stringify(cur));
                                        setShowCurrencyDropdown(false);
                                      }}
                                    >
                                      <span className="me-2">
                                        <img
                                          src={cur.flag_icon}
                                          alt={cur.currency_code}
                                          width="24"
                                          height="18"
                                        />
                                      </span>
                                      <span>
                                        {cur.currency_type} ({cur.currency_code})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="doiwehrwehirnwerwer aosndkjnjhasekwewt row align-items-center">
                        <form onSubmit={handleSearch}>
                          <div className={`search-field ${searchBarToggle ? "" : "search-field-hide"} position-relative`}>
                            <input ref={searchRef} type="text" className="form-control rounded-pill ps-3" placeholder="Search for Pre-stitched saree" />

                            <i className="bi position-absolute bi-search" onClick={(e) => handleSearch(e)}></i>
                          </div>
                        </form>              
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="doewhruiwerwer_right sfeadeeerrrrr">
                        <Link to="/"><img src={Logo} className="img-fluid d-none" alt="" /></Link>

                        <ul className="mb-0 ps-0 d-flex justify-content-between align-items-center">
                          <li><Link to={`/contact-us`}><i class="bi bi-headset"></i> Help</Link></li>

                          <li className="infrm-menu-divider">|</li>
                          {user ? (
                            <>
                             <li><Link to={`/wishlist`}><i class="bi bi-heart"></i> Wishlist <span>{wishlistCount}</span></Link></li>
                              <li className="infrm-menu-divider">|</li>
                              <li><Link to={`/cart`}><i class="bi bi-handbag"></i> Cart <span>{cartCount}</span></Link></li>
                            </>
                          ):(
                            <>
                              <li onClick={() => handleLoginModal()} className="DRhgbsxfnhbf"><i class="bi bi-heart"></i> Wishlist <span>0</span></li>
                              <li className="infrm-menu-divider">|</li>
                              <li onClick={() => handleLoginModal()}><i class="bi bi-handbag"></i> Cart <span>0</span></li>
                            </>
                          )}

                          <li className="infrm-menu-divider">|</li>

                          {/* <li className="position-relative">
                            {user ? (
                              <>
                                <div className="gbdfgtrfyhrytgrr d-flex align-items-center" onClick={(e) => {e.stopPropagation(); setUserDropdown(!userDropdown)}}>
                                  <i className="bi bi-person"></i>
                                  
                                  <div className="mjeimojwjikrrr">{user.name}</div>

                                  <i class={`fa-solid sdfrrweewr_icon ${userDropdown ? "fa-caret-up" : "fa-caret-down"}`}></i>
                                </div>

                                {userDropdown && <DropdownLoggedIn />}
                              </>
                            ) : (
                              <Link to="/register">
                                <i className="bi bi-person"></i> Account
                              </Link>
                            )}
                          </li> */}

                          <li className="sdfdghwrfwerererr position-relative">
                            <div className="safrfwrytuerr position-relative">
                                {user ? (
                                  <>
                                    <div className="diewhdfiwehknweihwerwer position-relative d-flex align-items-center">
                                      <div className="gbdfgtrfyhrytgrr d-flex align-items-center" onClick={(e) => {e.stopPropagation(); setUserDropdown(!userDropdown)}}>
                                        <i className="bi bi-person"></i>
                                        
                                        <div className="mjeimojwjikrrr">{user.name}</div>

                                        <i class={`fa-solid sdfrrweewr_icon ${userDropdown ? "fa-caret-up" : "fa-caret-down"}`}></i>
                                      </div>
                                    </div>

                                    {userDropdown && <DropdownLoggedIn />}
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-person"></i> Account
                                    <div className="accnt-drpdwn bg-white p-4 position-absolute mt-2 d-none">
                                      <div className="text-center">
                                        <h4>Log In or Sign Up</h4>

                                        <p>to personalize your experience</p>
                                      </div>

                                      <div className="diwejikrwer">
                                        <button className="btn mb-3 btn-main w-100" onClick={handleLoginModal}>Sign in with Mobile/Email</button>

                                        <button className="btn btn-main bg-white text-dark w-100"><img src="./images/search.png" className="me-2" alt="" /> Sign in with Google</button>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="doiwejirhwer">
                    <div className="row align-items-center">
                      <div className="col-8">
                        <div onClick={() => setResSearchToggle(false)} className={`doiejrowr-backdrop ${resSearchToggle ? "" : "d-none"} position-fixed w-100 h-100`}></div>

                        <form className={`dwejoijrwer ${resSearchToggle ? "dfghedfaewrwer" : "d-none"}`} onSubmit={handleResSearch}>
                          <div className="search-field position-relative">
                            <input ref={searchRefRes} type="text" className="form-control rounded-pill ps-3" placeholder="Search for products, categories, designers" />

                            <i className="bi position-absolute bi-search"></i>
                          </div>
                        </form>

                        <i className="fa-solid fa-bars d-none" id="res-toggle-btn" onClick={() => setResMenu(!resMenu)}></i>
                      </div>

                      <div className="col-4">
                        <div className="dowejojiweujrwer">
                          <div className="dwejiruhwejrwer">
                            <div className="doewhruiwerwer_right dfggweftewewrerr d-none">
                              <ul className="mb-0 ps-0 d-flex align-items-center">
                                <li><Link className="d-flex align-items-center" to={`/contact-us`}><i class="bi bi-headset"></i> Help</Link></li>

                                <li><Link to={`/wishlist`}><i class="bi bi-heart"></i> <span>{wishlistCount}</span></Link></li>
                                  
                                <li><Link to={`/cart`}><i class="bi bi-handbag"></i> <span>{cartCount}</span></Link></li>
                              </ul>
                            </div>
                          </div>                     
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ) }

              { !shouldHideHeader && (
                !shouldHideHeaderCategoryRoutes && (
                    <div className="header-main sfwedgwerwefrwerwer bg-white position-relative">       
                      <div className="header-main-wrapper">
                          {mainCategory?.map((category) => {

                            // const bannerCat = mainCategory.find(
                            //   item => item.mainCategory_banner?.length > 0
                            // );
                            const mainBanner = category.mainCategory_banner?.[0];
                            const hasBanner = category.mainCategory_banner?.length > 0;

                            return (
                              <SwiperSlide key={category.id}>
                                <NavLink to={`/${category.mainCategory_slug}`} end>
                                  {category.mainCategory_name}
                                </NavLink>

                                {category.head_categories.length > 0 && (
                                  <div className="header-mega-menu position-absolute w-100">
                                    <div className="h-m-m-inner bg-white py-2 mt-3">
                                      <div className="container-fluid">
                                        <div className="row">
                                          <div className="col-lg-5">
                                            <div className="ojkmiweee_left py-3">
                                              <div className="row">
                                                {category.head_categories?.map((headCat) => (
                                                  
                                                  <div className="col-lg-4" key={headCat.id}>
                                                    <div className="oieniuiewr_inner">
                                                      <h5>{headCat.headCategories_name}</h5>
                                                      <ul className="mb-0 ps-0">
                                                        {headCat.sub_categories?.slice(0, 8).map((subCat) => (
                                                          <li key={subCat.id}>

                                                            {(
                                                              headCat.headCategories_name === 'IN-HOUSE DESIGNERS' || 
                                                              headCat.headCategories_name === 'TRENDING NOW' || 
                                                              headCat.headCategories_name === 'FEATURED'
                                                            ) ? (
                                                              <Link to={`${subCat.subCategories_url}`}>
                                                                {subCat.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                                              </Link>
                                                            ) : (
                                                              <Link to={`/${category.mainCategory_slug}/${subCat.subCategories_slug}`}>
                                                                {subCat.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                                              </Link>
                                                            )}

                                                            
                                                          </li> 
                                                          
                                                        ))}

                                                        {/* Show "View All" if more than 8 */}
                                                        {headCat.sub_categories?.length > 8 && (
                                                          <li>
                                                            <Link to={`/${category.mainCategory_slug}`}>
                                                              View All →
                                                            </Link>
                                                          </li>
                                                        )}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>

                                          {hasBanner && (
                                          <div className="col-lg-7">
                                            <div className="ojkmiweee_right">
                                              <div className="row"> 
                                                <div className="col-lg-7">
                                                  <div className="row">
                                                    {[1, 2].map((i) => (
                                                      <div className="col-lg-6" key={i}>
                                                        <div className="vertical-image">
                                                          <div className="pkopkerrwer sfsdfweweweqwq text-center">
                                                            <img
                                                              src={`${mainBanner?.category_bannerImage_url}/${mainBanner?.[`category_bannerImage${i}`]}`}
                                                              className="w-100"
                                                              alt={mainBanner?.[`category_bannerTitle${i}`]}
                                                            />

                                                            <div className="dkewbjnrkwejrwer mt-2">
                                                              <a
                                                                href={mainBanner?.[`category_bannerURL${i}`]}
                                                              >
                                                                SHOP NOW
                                                              </a>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    ))}

                                                    {/* <div className="col-lg-6">
                                                      <div className="vertical-image">
                                                        <div className="pkopkerrwer sfsdfweweweqwq text-center">
                                                          <img
                                                            src={`${bannerCat?.mainCategory_banner?.[0]?.category_bannerImage_url}/${bannerCat?.mainCategory_banner?.[0]?.category_bannerImage2}`}
                                                            className="w-100"
                                                            alt={`${bannerCat?.mainCategory_banner?.[0]?.category_bannerTitle2}`}
                                                          />
                                                          <div className="dkewbjnrkwejrwer mt-2">
                                                            <a href={bannerCat?.mainCategory_banner?.[0]?.category_bannerTitle1}>SHOP NOW</a>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div> */}
                                                  </div>
                                                </div>                                    

                                                <div className="col-lg-5">
                                                  {[3, 4].map((i) => (
                                                    <div className="pkopkerrwer safsrfwee text-center mb-4" key={i}>
                                                      <Link
                                                        to={mainBanner?.[`category_bannerURL${i}`]}
                                                      >
                                                        <img
                                                          src={`${mainBanner?.category_bannerImage_url}/${mainBanner?.[`category_bannerImage${i}`]}`}
                                                          className="w-100"
                                                          alt={mainBanner?.[`category_bannerTitle${i}`]}
                                                        />
                                                      </Link>
                                                    </div>
                                                  ))}

                                                  {/* <div className="pkopkerrwer safsrfwee text-center mb-4">
                                                    <Link to={`${bannerCat?.mainCategory_banner?.[0]?.category_bannerURL4}`}>
                                                      <img
                                                        src={`${bannerCat?.mainCategory_banner?.[0]?.category_bannerImage_url}/${bannerCat?.mainCategory_banner?.[0]?.category_bannerImage4}`}
                                                        className="w-100"
                                                        alt={`${bannerCat?.mainCategory_banner?.[0]?.category_bannerTitle4}`}
                                                      />
                                                    </Link>
                                                  </div> */}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </SwiperSlide>
                            );
                        })}  
                      </div>    
                    </div>
                  )
              ) }
            </div>
          </div>
        </header>
      ) }


      {/*res catgory menu modal*/}

      <div className={`${resMenu ? "res-ctgy-menu-backdrop d-none" : "res-ctgy-menu-backdrop d-none res-ctgy-menu-backdrop-hide"} position-fixed w-100 h-100`} onClick={() => setResMenu(false)}></div>

      <div className={`${resMenu ? "res-ctgy-menu-modal d-none" : "res-ctgy-menu-modal d-none res-ctgy-menu-modal-hide"} bg-white position-fixed p-3`}>
        <div className="dwehjrw bdfgbdederer mb-4">
          <div className="custom-currency-dropdown wlojdfiwejrower col-4 d-none position-relative">
            <button
              className="currency-toggle-btn d-flex align-items-center"

              onClick={(e) => {
                e.stopPropagation();
                setShowCurrencyDropdown(prev => !prev);
              }}
            >
              <span className="me-2">
                <img
                  // src={selectedCurrency?.flag_icon || "https://flagcdn.com/24x18/in.png"}
                  src={selectedCurrency?.flag_icon}
                  alt={selectedCurrency?.currency_code || "INR"}
                  width="24"
                  height="18"
                />
              </span>

              <span>{selectedCurrency?.currency_code || "INR"}</span>

              <i
                className={`fa-solid ms-2 ${showCurrencyDropdown ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
              ></i>
            </button>

            {showCurrencyDropdown && (
              <div onClick={(e) => e.stopPropagation()} className="osjoidhwjiwer dwelorjwemr-res position-absolute bg-white shadow rounded-3 mt-2 p-2">
                <div className="dmndfkswndfiofrsmk position-relative">
                  <input type="text" placeholder="Search for a region" value={searchCurrency}
                    onChange={(e) => setSearchCurrency(e.target.value)} className="form-control py-1" />
                  <i
                    className={`bi position-absolute ${searchCurrency.length > 0 ? "bi-x" : "bi-search"}`}
                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                    onClick={() => {
                      if (searchCurrency.length > 0) {
                        setSearchCurrency("");   // Clear search when clicking cross
                      }
                    }}
                  ></i>
                </div>

                <ul className="currency-menu mb-0 px-0">
                  {filteredCurrency.map((cur) => (
                    <li
                      key={cur.id}
                      className="currency-item d-flex align-items-center p-2"
                      onClick={() => {
                        setSelectedCurrency(cur);
                        localStorage.setItem("selectedCurrency", JSON.stringify(cur));
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      <span className={`res-currncy-radio ${(selectedCurrency.id === cur.id) ? "res-currncy-radio-checked" : ""}`}></span>

                      <span className="me-2">
                        <img
                          src={cur.flag_icon}
                          alt={cur.currency_code}
                          width="24"
                          height="18"
                        />
                      </span>
                      <span>
                        {cur.currency_type} ({cur.currency_code})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="dnekwrwerwer">
            <Link to={`/contact-us`}><i class="bi bi-headset"></i> Help</Link>
          </div>
        </div>

        <div className={`${!user ? "d-flex" : "d-block"} align-items-center justify-content-between`}>
            {user ? (
              <>
                {/* <Link to="/profile"><i class="bi me-1 bi-person"></i> {user.name}</Link> */}

                <h4 className="mb-4">Hi, {user.name}</h4>

                <div className="dwoejoidwemjr col-lg-4">
                  <ol className="steps">
                    <li className="step is_active" data-step={1}>
                      <span className="doejojewr">Current</span>

                      <img src="./images/sadw.png" alt="" />

                      <span className="oajeorjer">Silver</span>
                    </li>

                    <li className="step" data-step={2}>
                      <span className="doejojewr opacity_hidden">Current</span>

                      <img src="./images/sae.png" alt="" />

                      <span className="oajeorjer">Gold <br /> <span>Shop 25,000 To upgrade</span></span>
                    </li>

                    <li className="step" data-step={3}>
                      <span className="doejojewr opacity_hidden">Current</span>

                      <img src="./images/sadew.png" alt="" />

                      <span className="oajeorjer">Platinum <br /> <span>Shop 50,000 To upgrade</span></span>
                    </li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <ul className="d-flex align-items-center mb-0 ps-0">
                  <li onClick={() => {setResSignBottom(!resSignBottom); setResMenu(false)}}><span >SIGN IN / SIGN UP</span></li>
                </ul>
                {/* <Link onClick={() => {setResSignBottom(!resSignBottom); setResMenu(false)}}><i class="bi me-1 bi-person"></i> My Account</Link> */}
              </>
            )}
        </div>

        <div className="cojeojewrer mt-4">
          {mainCategory?.map((category) => {

            const leftBanners = category.mainCategory_banner?.slice(0, 2);  // first 2 images
            const rightBanners = category.mainCategory_banner?.slice(2, 4); // next 2 images

          return (
            
            <div className="diuewhuirwere" key={category.id}>
              <div className="mnctgy d-flex align-items-center justify-content-between py-2 px-1">
                <Link onClick={() =>
                  category.head_categories.length > 0 &&
                  setResCtgyDrpdwn(resCtgyDrpdwn === category.id ? null : category.id)
                } to={(category.head_categories.length > 0) ? pathName : `/${category.mainCategory_slug}`}>{category.mainCategory_name}</Link>
                {category.head_categories.length > 0 && (
                  <i
                    className={`bi ${resCtgyDrpdwn === category.id ? "bi-dash" : "bi-plus"}`}
                    onClick={() =>
                      setResCtgyDrpdwn(resCtgyDrpdwn === category.id ? null : category.id)
                    }
                  ></i>
                )}
              </div>

              {resCtgyDrpdwn === category.id && (
                <div className="dojiewjoejojowerwer">
                  <div className="header-mega-menu w-100">
                    <div className="h-m-m-inner bg-white py-2 mt-3">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="ojkmiweee_left py-3">
                              <div className="row">
                                {category.head_categories?.map((headCat) => (
                                  <div className="col-lg-4" key={headCat.id}>
                                    <div className="oieniuiewr_inner">
                                      <h5>{headCat.headCategories_name}</h5>
                                      <ul className="mb-0 ps-0">
                                        {headCat.sub_categories?.slice(0, 8).map((subCat) => (
                                          <li key={subCat.id}>
                                            {(
                                              headCat.headCategories_name === 'IN-HOUSE DESIGNERS' || 
                                              headCat.headCategories_name === 'TRENDING NOW' || 
                                              headCat.headCategories_name === 'FEATURED'
                                            ) ? (
                                              <Link to={`${subCat.subCategories_url}`}>
                                                {subCat.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                              </Link>
                                            ) : (
                                              <Link to={`/${category.mainCategory_slug}/${subCat.subCategories_slug}`}>
                                                {subCat.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                              </Link>
                                            )}
                                          </li>
                                        ))}

                                        {headCat.sub_categories?.length > 8 && (
                                          <li>
                                            <Link to={`/${category.mainCategory_slug}`}>
                                              View All →
                                            </Link>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="ojkmiweee_right">
                              <div className="row">
                                <div className="col-lg-7">
                                  <div className="row">
                                    {leftBanners?.map((b) => (
                                      <div className="col-lg-6" key={b.id}>
                                        <div className="pkopkerrwer text-center">
                                          <img
                                            src={`${b.category_bannerImage_url}/${b.category_bannerImage}`}
                                            className="w-100"
                                            alt=""
                                          />
                                          <div className="dkewbjnrkwejrwer mt-2">
                                            <a href={b.category_bannerURL}>SHOP NOW</a>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="col-lg-5">
                                  {rightBanners?.map((b, index) => (
                                    <div className="pkopkerrwer safsrfwee text-center mb-4" key={index}>
                                      <Link to={b.category_bannerURL}>
                                        <img
                                          src={`${b.category_bannerImage_url}/${b.category_bannerImage}`}
                                          className="w-100"
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/*login start*/}

      <div onClick={handleLoginClose} className={`${loginModalBackdrop ? "login-modal-backdrop" : "login-modal-backdrop login-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${loginModal ? "login-modal" : "login-modal login-modal-hide"} overflow-hidden bg-white position-fixed`}>
        <div className="weohfjkwenuirhwer position-absolute" onClick={() => {handleLoginClose(); handleLoginClose();}}>
          <i class="fa-solid fa-xmark"></i>
        </div>

        <div className="difwehwerwer">
          {emailToggle ? (<img src="./images/dw.jpg" alt="" />) : (<img src="./images/dw.jpg" alt="" />)}

          <div className="diwekmrwerwe px-4 pb-2 pt-4">
            <h5 className="text-center mb-1">Log in or Sign up</h5>

            <p className="text-center">to personalize your experience</p>

            <div className="doijewijrwer">
              <label className="form-label">{emailToggle ? "Email id" : "Mobile Number"}</label>

              <div className="dweorjwer sfqeddaeweqwqee">
                {emailToggle ? (
                  <>
                    <input type="email" className="form-control" placeholder="Enter email id" name="email" value={email}
                          onChange={(e) => setEmail(e.target.value)}/>
                  </>
                ) : (
                  <div className="d-flex align-items-center">
                    <div className="position-relative d-inline-block">
                      <span 
                        className="dwregfweerqrwerrr position-absolute translate-middle-y top-50 start-0 pointer-events-none"
                        style={{ pointerEvents: 'none', zIndex: 1 }}
                      >
                        {selectedCode}
                      </span>
                      
                      <select
                        className="form-select text-transparent me-2"
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        style={{ color: 'transparent', position: 'relative', zIndex: 0 }}
                      >
                        {countryCodes.map((country) => (
                          <option 
                            key={country.country_name} 
                            value={country.country_code} 
                            className="text-dark"
                          >
                            {country.country_name} (+{country.country_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <input type="text" className="form-control" placeholder="Enter mobile number" value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}/>
                  </div>
                )}
              </div>
            </div>

            <div className="diehhweirwer mt-3">
              {/* <button onClick={openPhoneEmailOtp} className="btn btn-main w-100">Get OTP</button> */}
              <button onClick={sendOtp} className="btn btn-main w-100">Get OTP</button>

              <p className="my-2 text-center">or</p>

              <button className="btn btn-main bg-white text-dark w-100"><img src="./images/search.png" className="me-2" alt="" /> Sign in with Google</button>
            </div>

            <h6 className="dfweoijtweer mt-3">By continuing, I agree to <Link>Vinhem Fashion policies</Link> and <Link>T&Cs</Link></h6>

            <div className="coiasehrewr text-center">Use <span onClick={() => setEmailToggle(!emailToggle)}>{emailToggle ? "Mobile Number" : "Email id"}</span></div>
          </div>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <div
          id="phoneLogin"
          className="pe_signin_button"
          data-client-id="18949345773941787569"
        >
          <script src="https://www.phone.email/sign_in_button_v1.js" async></script>
        </div>

        <div
          id="emailLogin"
          className="pe_verify_email"
          data-client-id="18949345773941787569"
        >
          <script src="https://www.phone.email/verify_email_v1.js" async></script>
        </div>
      </div>

      {/*login otp verification start*/}      

      <div className={`${otpModal ? "login-modal" : "login-modal login-modal-hide"} bg-white px-4 py-2 position-fixed`}>
        <div className="doiwejrojwekrwer d-flex justify-content-between align-items-center pb-3">
          <div className="dowehirhwerwer d-flex align-items-center" onClick={() => {setOtpModal(false); handleLoginModal();}}>
            <i class="fa-solid me-1 fa-arrow-left"></i> <span>Back</span>
          </div>

          <div className="weohfjkwenuirhwer" onClick={() => {setOtpModal(false); handleLoginClose();}}>
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>

        <div className="difwehwerwer">
          <div className="diwekmrwerwe pt-4">
            <h5 className="text-center mb-1">OTP Verification</h5>

            <p className="sdfdghsedfdhertfrts text-center">Enter the six digit OTP sent to <br /> 
            {otpContact.mobile ? (
              <>
                {otpContact.countryCode}-{otpContact.mobile}
              </>
            ) : (
              <>        
                {otpContact.email}
              </>
            )}
            <span onClick={() => {setOtpModal(false); handleLoginModal();}}> Edit</span></p>

            <div className="doijewijrwer">
              <div className="d-flex align-items-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className="form-control text-center mx-1"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                  />
                ))}
              </div>

              <p className="sdfdghsedfdhertfrts text-center mt-3 mb-4">
                {/* <span>Resend OTP</span> <i class="fa-regular fa-clock"></i> 50sec</p> */}
                <span
                  style={{ cursor: resendEnabled ? "pointer" : "not-allowed" }}
                  onClick={resendOtp}
                >
                  Resend OTP <i class="fa-regular fa-clock"></i>{resendEnabled ? "" : `(${timer}s)`}
                </span>
              </p>

              <button onClick={verifyOtp} className="btn btn-main w-100">Verify</button>

              <h6 className="dhdasgdsdfsdf my-3 text-center">Trouble getting OTP?</h6>

              <div className="edwoikhuiefnjier row gap-0 pb-5">
                <div className="col-lg-6 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                  <div className="dowejriwehrewr d-flex align-items-center p-2">
                    <i class="fa-brands me-2 fa-whatsapp"></i> 

                    <p className="mb-0">Get OTP via WhatsApp</p>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div onClick={() => {setOtpModal(false); handleLoginModal(); setEmailToggle(true);}} className="dowejriwehrewr d-flex align-items-center p-2">
                    <i class="fa-regular me-2 fa-envelope"></i>
                    <p className="mb-0">Continue with Email</p>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        </div>
      </div>

      {/*login complete start*/}      

      <div className={`${completeLoginModal ? "login-modal" : "login-modal login-modal-hide"} bg-white px-4 py-2 position-fixed`}>
        <div className="weohfjkwenuirhwer position-absolute" onClick={() => {setCompleteLoginModal(false); handleLoginClose();}}>
          <i class="fa-solid fa-xmark"></i>
        </div>

        <div className="difwehwerwer">
          <div className="diwekmrwerwe pt-4">
            <h5 className="text-center mb-1">Complete sign up</h5>

            <p className="sdfdghsedfdhertfrts text-center">Enter below details</p>

            <div className="dihweirowerwer pb-4">
              <form onSubmit={completeSignup}>
                <div className="mb-3">
                  <label>Full Name</label>

                  <input type="text" className="form-control" value={fullname}
                    onChange={(e) => setFullname(e.target.value)} placeholder="Enter Full Name" />
                </div>

                {verifiedContact.mobile && (
                  <div className="mb-3">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${verifiedContact.mobile}`}
                      readOnly
                    />
                  </div>
                )}

                {!verifiedContact.mobile && verifiedContact.email && (
                  <div className="mb-3">
                    <label>Email Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={verifiedContact.email}
                      readOnly
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label>Referral Code</label>

                  <input type="text" className="form-control" value={referral}
                      onChange={(e) => setReferral(e.target.value)} placeholder="Enter Referral Code" />
                </div>

                <button type="submit" className="adsfdgsaddfgewfgredrf btn btn-main w-100" disabled={loading}>{loading ? "Please wait..." : "Continue"}</button>
           
              </form>
            </div>           
          </div>
        </div>
      </div>

      {/*res navbar bottom footer*/}
      
      <ResponsiveNavbarBottom resSearchToggle={resSearchToggle} setResSearchToggle={setResSearchToggle} setResSignBottom={setResSignBottom} />

      {/*res accnt drpdwn*/}

      <div className={`doewjrlkmwelrwer-backdrop ${resSignBottom ? "" : "doewjrlkmwelrwer-backdrop-hide"} d-none w-100 h-100 position-fixed`} onClick={() => setResSignBottom(false)}></div>

      <div className="dweikdnfjikwnffr">
        <div className={`accnt-drpdwn bg-white p-4 position-absolute d-none mt-2 ${resSignBottom ? "" : "accnt-drpdwn-hide"}`}>
          <div className="text-center">
            <h4>Log In or Sign Up</h4>

            <p>to personalize your experience</p>
          </div>

          <div className="diwejikrwer">
            <button className="btn mb-3 btn-main w-100" onClick={() => {handleLoginModal(); setResSignBottom(false)}}>Sign in with Mobile/Email</button>

            <button className="btn btn-main bg-white text-dark w-100"><img src="./images/search.png" className="me-2" alt="" /> Sign in with Google</button>
          </div>
        </div>
      </div>

      {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ zIndex: 9999999999 }}
        /> */}

    </>
  )
}