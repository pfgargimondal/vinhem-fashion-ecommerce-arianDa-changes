import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import http from "../../../http";
import { useAuth } from "../../../context/AuthContext";
import {BASE_URL} from "../../../http";
import { optimizeImage } from "../../../utils/optimizeImage";
import "./Footer.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";


export const Footer = ({ shouldHideFullHeaderFooterRoutes }) => {
  
  
  //sign up / log in start

  const [loading, setLoading] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [loginModalBackdrop, setLoginModalBackdrop] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [completeLoginModal, setCompleteLoginModal] = useState(false);
  const [emailToggle, setEmailToggle] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+91');
  const [countryCodes, setCountryCodes] = useState([]);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // eslint-disable-next-line
  const [isNewUser, setIsNewUser] = useState(false);
  const [fullname, setFullname] = useState('');
  const [referral, setReferral] = useState('');
  const [verifiedContact, setVerifiedContact] = useState({ email: '', mobile: '', countryCode: '' });
  const [otpContact, setOtpContact] = useState({ email: '', mobile: '', countryCode: '' });
  const [timer, setTimer] = useState(50);
  const [resendEnabled, setResendEnabled] = useState(false);
  const timerRef = useRef(null);
  const otpRefs = useRef([]);
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [mainCatgry, setMainCatgry] = useState([]);

  const pathName = useLocation().pathname;

  useEffect(() => {
    const fetchMainCategory = async () => {
      try {
        const getresponse = await http.get("/product-category");
        const allresponse = getresponse?.data?.data;

        setMainCatgry(allresponse);
      } catch (error) {
        console.error("Error fetching main category:", error);
      }
    };

    fetchMainCategory();
  }, []);

  useEffect(() => {
    const html = document.querySelector("html");

    if (loading) {
      html.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
    }
  }, [loading]);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await http.get('/get-country-code');
        setCountryCodes(response.data.data);
      } catch (error) {
        console.error('Error fetching Country Code', error);
      }
    };
    fetchCountryCode();
  }, []);

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
      return () => clearInterval(timerRef.current);
    }
  }, [otpModal]);


  const handleOtpChange = (value, index) => {
    if (!/[\d.]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
    else if (!value && index > 0) otpRefs.current[index - 1].focus();
  };

  const sendOtp = async () => {
    if (emailToggle && !email) return alert('Email required');
    if (!emailToggle && mobile.length !== 10) return alert('Valid mobile number required');
    try {
      const res = await http.post('/user/send-otp', {
        email: emailToggle ? email : undefined,
        mobile: !emailToggle ? mobile : undefined,
        countryCode: !emailToggle ? selectedCode : undefined,
      });
      setOtpContact({ email: emailToggle ? email : '', mobile: !emailToggle ? mobile : '', countryCode: !emailToggle ? selectedCode : '' });
      setIsNewUser(res.data.action === 'register');
      setOtpModal(true);
      setLoginModal(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return alert('Enter full OTP');
    try {
      const response = await http.post('/user/verify-otp', {
        email: emailToggle ? email : undefined,
        mobile: !emailToggle ? mobile : undefined,
        countryCode: !emailToggle ? selectedCode : undefined,
        otp: enteredOtp,
      });
      if (response.data.success) {
        setOtpModal(false);
        if (response.data.login) {
          // Existing user login
          dispatch({ type: 'LOGIN', payload: { token: response.data.data.jwtToken, user: response.data.data.user } });
          setOtpModal(false);
          setLoginModalBackdrop(false);
        } else {
          // New user complete signup
          setCompleteLoginModal(true);
          setVerifiedContact({ email: emailToggle ? email : '', mobile: !emailToggle ? mobile : '', countryCode: selectedCode });
          setOtpModal(false);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const resendOtp = () => {
    if (resendEnabled) sendOtp();
  };

  const completeSignup = async (e) => {
    e.preventDefault();
    if (!fullname.trim()) return alert('Full name is required');
    setLoading(true);
    try {
      const res = await http.post('/user/complete-signup', {
        fullname,
        email: verifiedContact.email || undefined,
        mobile: verifiedContact.mobile || undefined,
        countryCode: verifiedContact.countryCode,
        referralcode: referral,
      });
      localStorage.setItem('jwt_token', res.data.data.jwtToken);
      dispatch({ type: 'LOGIN', payload: { token: res.data.data.jwtToken, user: res.data.data.user } });
      setCompleteLoginModal(false);
      setLoginModalBackdrop(false);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginModal = () => {
    setLoginModal(!loginModal);
    setLoginModalBackdrop(!loginModalBackdrop);
  };

  const handleLoginClose = () => {
    setLoginModal(false);
    setLoginModalBackdrop(false);
    setOtpModal(false);
    setCompleteLoginModal(false);
    // Reset other states
  };

  //sign up / log in end

  const [newsletteremail, setNewsletteremail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newsletteremail) return;

    try {
      setLoading(true);
      const res = await http.post("/store-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        newsletteremail: newsletteremail || '',
      });

      if (res.data.success) {
      
        toast.success("Thank you for subscribing!", {
          style: {
            background: "#2ecc71",
            color: "#fff",
          },
        });

        setNewsletteremail("");
      }else{
        toast.error(res.data.message || "Something went wrong", {
          style: {
            background: "#e74c3c", // red for error
            color: "#fff",
          },
        });
        setNewsletteremail("");
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };


  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        handleLoginClose();
        const googleUser = userInfo.data;
        const response = await http.post("/user/google-login", {
          name: googleUser.name,
          email: googleUser.email,
          google_id: googleUser.id,
          avatar: googleUser.picture,
        });

        if (response.data.success === true) {
            setLoading(false);
            dispatch({
              type: "LOGIN",
              payload: {
                token: response.data.data.jwtToken,
                user: response.data.data.user,
              }
            });

            handleLoginClose();
            // navigate("/");
        }else{
          // alert(response.data.message);
          handleLoginClose();
          toast.error(response.data.message);
        }

      } catch (error) {
        console.log(error);
        alert("Google login failed");
      }finally {
        setLoading(false);
      }
    },

    onError: () => {
      alert("Google login failed");
    },
  });



  return (
    <>
      {loading && <Loader />}
      {!shouldHideFullHeaderFooterRoutes && (
        <footer style={{ paddingBottom: mainCatgry?.some(item => (pathName.startsWith(`/${item.mainCategory_slug}`) || pathName.startsWith(`/all-products`)) && !pathName.startsWith(`/wedding`) && !pathName.startsWith(`/on-sale`) && window.innerWidth <= 991) ? "10rem" : "" }}>
          <div className="container-fluid pt-5">
            <div className="row">
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-3 mb-4">
                    <div className="dbewjbruwerwer_inner">
                      <h5>Information</h5>
                      {/* <img src="images/logo.png" className="img-fluid mb-4" alt="" /> */}

                      <ul className="f-link mb-3 ps-0">
                        <li><Link to="/about-us"><i class="bi me-2 bi-caret-right-fill"></i> About Us</Link></li>

                        <li><Link to="/contact-us"><i class="bi me-2 bi-caret-right-fill"></i> Contact Us</Link></li>

                        <li><Link to="/terms-&-condition"><i class="bi me-2 bi-caret-right-fill"></i> Terms & Condition</Link></li>

                        <li><Link to="/blog" target="_blank"><i class="bi me-2 bi-caret-right-fill"></i> Blog</Link></li>
                      </ul>

                      <img src="/images/comodo.png" className="simg img-fluid" alt="" />
                    </div>
                  </div>

                  <div className="col-lg-3 mb-4">
                    <div className="dbewjbruwerwer_inner">
                      <h5>My Account</h5>

                      <ul className="f-link mb-0 ps-0">
                        <li><Link to="/become-vendor"><i class="bi me-2 bi-caret-right-fill"></i> Supplier Registration</Link></li>

                        <li onClick={handleLoginModal}><Link><i class="bi me-2 bi-caret-right-fill"></i> Sign In / Sign Up</Link></li>

                        {/* <li onClick={handleLoginModal}><Link><i class="bi me-2 bi-caret-right-fill"></i> Sign up</Link></li> */}

                        <li><Link to="/track-order"><i class="bi me-2 bi-caret-right-fill"></i> Track Order</Link></li>

                        <li><Link to="/faq"><i class="bi me-2 bi-caret-right-fill"></i> F.A.Q</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-3 mb-4">
                    <div className="dbewjbruwerwer_inner">
                      <h5>Customer Services</h5>

                      <ul className="f-link mb-0 ps-0">
                        <li><Link to="/payment-options"><i class="bi me-2 bi-caret-right-fill"></i> Payment Option</Link></li>

                        <li><Link to="/testimonial"><i class="bi me-2 bi-caret-right-fill"></i> Testimonial</Link></li>

                        <li><Link to="/career"><i class="bi me-2 bi-caret-right-fill"></i> Career</Link></li>

                        <li><Link to=""><i class="bi me-2 bi-caret-right-fill"></i> Site Map</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-3 mb-4">
                    <div className="dbewjbruwerwer_inner">
                      <h5>Policy</h5>

                      <ul className="f-link mb-0 ps-0">
                        <li><Link to="/privacy-policy"><i class="bi me-2 bi-caret-right-fill"></i> Privacy Policy</Link></li>

                        <li><Link to="/return-policy"><i class="bi me-2 bi-caret-right-fill"></i> Return Policy</Link></li>

                        <li><Link to="/order-policy"><i class="bi me-2 bi-caret-right-fill"></i> Order Policy</Link></li>

                        <li><Link to="/shipping-policy"><i class="bi me-2 bi-caret-right-fill"></i> Shipping Policy</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 mb-4">
                <div className="dbewjbruwerwer_inner">
                  <h5>Follow Us</h5>

                  <ul className="f-fu-link mb-4 ps-0">
                    <li><Link to="https://www.facebook.com/VinhemFashion/" target="_blank" className="social facebook"><i class="bi bi-facebook"></i></Link></li>

                    <li><Link to="https://www.instagram.com/vinhem_fashion/?hl=en" target="_blank" className="social instagram"><i class="bi bi-instagram"></i></Link></li>

                    <li><Link to="https://in.pinterest.com/vinhemfashion/" target="_blank" className="social pinterest"><i class="bi bi-pinterest"></i></Link></li>

                    <li><Link to="" className="social twitter"><i class="bi bi-twitter-x"></i></Link></li>

                    <li><Link to="" className="social youtube"><i class="bi bi-youtube"></i></Link></li>

                    <li><Link to="" className="social youtube"><i class="bi bi-linkedin"></i></Link></li>
                  </ul>

                  <h5>Fashion Updates</h5>

                  <p>Subscribe and get extra <span className="dgsdfhdrgh">₹500</span> off</p>

                  <div className="position-relative">
                    <form onSubmit={handleSubmit} className="position-relative">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email id"
                        value={newsletteremail}
                        onChange={(e) => setNewsletteremail(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        className="btn position-absolute btn-main px-3"
                        disabled={loading}
                      >
                        <i className="bi bi-send"></i>
                      </button>

                      {message && (
                        <small className="text-success d-block mt-2">{message}</small>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="idnweihrwerwe text-center py-3">
            <div className="container">
              <p className="jamdlkjwekrer mb-0">Copyright <i class="bi bi-c-circle"></i> 2012-2026, VinHem Fashion A Unit of VinHem Technologies - All rights reserved.</p>
            </div>
          </div>

          <div className="footer-bottom mt-3">
            <div className="container-fluid">
              <ul className="xcoiekoiewopekrr mb-3 d-flex justify-content-center align-items-center ps-0 imprtnt-list">
                <li className="dojelkwmriower"><i className="bi me-1 bi-truck"></i> <span>Worldwide Shipping</span></li>

                <li className="fttr-info-divider">|</li>

                <li className="dojelkwmriower"><i className="bi me-1 bi-vignette"></i> <span>Customized Tailoring</span></li>

                <li className="fttr-info-divider">|</li>

                <li className="dojelkwmriower"><i className="bi me-1 bi-telephone"></i> 
                    <a href="tel:7003672926">
                      {/* <span>+91 8981750096</span> */}
                      <span>+91 7003672926</span>
                    </a>
                </li>

                <li className="fttr-info-divider">|</li>

                <li className="dojelkwmriower"><i className="bi me-1 bi-whatsapp"></i> 
                    <a
                      href="https://wa.me/917003672926"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* <span>+91 8981750096</span> */}
                      <span>+91 7003672926</span>
                    </a>
                </li>
              </ul>

              <p className="doejwojrowejower" style={{ textAlign: "center" }}>Secure shopping from India for Sarees, Salwar Kameez, Lehenga Cholis, Mens Wear, Kids Wears, Jewellery & Accessories for delivery in USA,UK and Worldwide.</p>
            </div>

            <div className="duiwehihiwejiurwer py-3" style={{  }}>
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-lg-5">
                    <ul className="fb-payment-options sfefaeewrweqqq d-flex justify-content-start align-items-center ps-0 mb-0">
                      <li><p className="asfrweewee mb-0">OUR COURIER PARTNERS :</p></li>

                      <li><img src="/images/FedExnew.png" className="img-fluid" alt="" /></li>

                      <li><img src="/images/DHLnew.png" className="img-fluid" alt="" /></li>

                      <li><img src="/images/BlueDartnew.png" className="img-fluid" alt="" /></li>

                      <li className="me-0"><img src="/images/Delhiverynew.png" className="img-fluid" alt="" /></li>
                    </ul>
                  </div>

                  <div className="col-lg-7">
                    <ul className="fb-payment-options kajhdijojeijrrr d-flex justify-content-end align-items-center ps-0 mb-0">
                      <li><p className="asfrweewee mb-0">SAFE & SECURE PAYMENTS :</p></li>                      

                      <li><img src="/images/Razorpaynew.png" className="img-fluid" alt="" /></li>

                      <li><img src="/images/Visanew.png" className="img-fluid" alt="" /></li>

                      <li><img src="/images/MasterCardnew.png" className="img-fluid" alt="" /></li>

                      <li><img src="/images/AmericanExpressnew.jpg" className="img-fluid" alt="" /></li>

                      {/* <li><img src="/images/Diners-Club-In.png" className="img-fluid" alt="" /></li> */}

                      <li><img src="/images/PayPalnew.png" className="img-fluid" alt="" /></li>

                      {/* <li className="me-0"><img src="/images/amazonpay.png" className="img-fluid" alt="" /></li>                       */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/*login start*/}

      <div onClick={handleLoginClose} className={`${loginModalBackdrop ? "login-modal-backdrop" : "login-modal-backdrop login-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${loginModal ? "login-modal" : "login-modal login-modal-hide"} overflow-hidden bg-white position-fixed`}>
        <div className="weohfjkwenuirhwer position-absolute" onClick={() => { setLoginModal(false); setLoginModalBackdrop(false); }}>
          <i class="fa-solid fa-xmark"></i>
        </div>

        <div className="difwehwerwer">
          {emailToggle ? (<img src={optimizeImage(`${BASE_URL}/public/FTP-&-Excels/Main-Frame/All-Banners/Pop-Ups/Login.jpg`)}  alt="" />) : (<img src={optimizeImage(`${BASE_URL}/public/FTP-&-Excels/Main-Frame/All-Banners/Pop-Ups/Login.jpg`)} alt="" />)}

          <div className="diwekmrwerwe px-4 pb-2 pt-4">
            <h5 className="text-center mb-1">Log in or Sign up</h5>

            <p className="text-center">to personalize your experience</p>

            <div className="doijewijrwer">
              <label className="form-label">{emailToggle ? "Email id" : "Mobile Number"}</label>

              <div className="dweorjwer sfqeddaeweqwqee">
                {emailToggle ? (
                  <>
                    <input type="email" className="form-control" placeholder="Enter email id" name="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} />
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
                      maxLength={10} />
                  </div>
                )}
              </div>
            </div>

            <div className="diehhweirwer mt-3">
              <button onClick={sendOtp} className="btn btn-main w-100">Get OTP</button>

              <p className="my-2 text-center">or</p>

              <button className="btn btn-main bg-white bgdfzhdfsdfsdf text-dark w-100" onClick={() => googleLogin()}><img src="/images/search.png" className="me-2" alt="" /> Sign in with Google</button>
            </div>

            <h6 className="dfweoijtweer mt-3">By continuing, I agree to <Link>Vinhem Fashion policies</Link> and <Link>T&Cs</Link></h6>

            <div className="coiasehrewr text-center">Use <span onClick={() => setEmailToggle(!emailToggle)}>{emailToggle ? "Mobile Number" : "Email id"}</span></div>
          </div>
        </div>
      </div>

      {/*login otp verification start*/}

      <div className={`${otpModal ? "login-modal" : "login-modal login-modal-hide"} bg-white px-4 py-2 position-fixed`}>
        <div className="doiwejrojwekrwer d-flex justify-content-between align-items-center pb-3">
          <div className="dowehirhwerwer d-flex align-items-center" onClick={() => { setOtpModal(false); setLoginModal(true); }}>
            <i class="fa-solid me-1 fa-arrow-left"></i> <span>Back</span>
          </div>

          <div className="weohfjkwenuirhwer" onClick={() => { setOtpModal(false); setLoginModalBackdrop(false); }}>
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
              <span onClick={() => { setOtpModal(false); setLoginModal(true); }}> Edit</span></p>

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
                  <div onClick={() => { setOtpModal(false); setLoginModal(true); setEmailToggle(true); }} className="dowejriwehrewr d-flex align-items-center p-2">
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
        <div className="weohfjkwenuirhwer position-absolute" onClick={() => { setCompleteLoginModal(false); setLoginModalBackdrop(false); }}>
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

    </>
  )
}