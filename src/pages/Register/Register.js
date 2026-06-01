import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../api/auth';
import { toast } from "react-toastify";
import "./Css/Register.css";
import ReCAPTCHA from 'react-google-recaptcha';
import { optimizeImage } from "../../utils/optimizeImage";

export const Register = () => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phone_no: '',
    password: '',
    confirm_password: ''
  });

  const [captchaToken, setCaptchaToken] = useState('');

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validateInputs = (inputs) => {
      const newErrors = {};

      if (!inputs.name.trim()) {
        newErrors.name = "Name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(inputs.name)) {
        newErrors.name = "Name can only contain letters and spaces";
      }

      if (!inputs.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (!inputs.phone_no.trim()) {
        newErrors.phone_no = "Phone number is required";
      } else if (!/^\d{10}$/.test(inputs.phone_no)) {
        newErrors.phone_no = "Enter a valid 10-digit phone number";
      }

      if (!inputs.password) {
        newErrors.password = "Password is required";
      } else if (inputs.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!inputs.confirm_password) {
        newErrors.confirm_password = "Confirm Password is required";
      } else if (inputs.password !== inputs.confirm_password) {
        newErrors.confirm_password = "Password & confirm password should be same";
      }

      return newErrors;
    };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };


  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs(inputs);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (!captchaToken) {
        alert('Please verify reCAPTCHA');
        return;
      }

      setErrors({});

    try {
      const response = await register({ ...inputs, recaptcha_token: captchaToken });
      
      if (response.data.success) {
            toast.success(response.data.message, {
              style: {
                background: "#2ecc71",
                color: "#fff",
              },
            });

            localStorage.setItem('jwt_token', response.data.token);
            navigate('/login');

            setInputs({
                name: '',
                email: '',
                phone_no: '',
                password: '',
                confirm_password: ''
            });
        }else{
          toast.error(response.data.message, {
              style: {
                background: "#e74c3c", // red for error
                color: "#fff",
              },
            });
            setInputs({
                name: '',
                email: '',
                phone_no: '',
                password: '',
                confirm_password: ''
            });
        }

    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-login-wrapper container-fluid py-5">
      <div className="card-custom row">
        <div className="col-lg-6 left-panel d-flex flex-column">
          <div>
            <h1>
              Simplify
              <br />
              management with
              <br />
              our <u>dashboard.</u>
            </h1>
            <p>
              Simplify your e-commerce management with our user-friendly admin
              dashboard.
            </p>
          </div>

          <img
            alt="Two people standing, one holding coffee cup wearing glasses and another wearing yellow shirt"
            src={optimizeImage(
              `${window.location.origin}/images/21726902_6509982-removebg-preview-Photoroom.png`
            )}
            className="img-fluid"
          />
        </div>

        <div className="col-lg-6 right-panel text-center">
          <img
            src={optimizeImage(
              `${window.location.origin}/images/logo.png`
            )}
            className="reg-log-img mb-4 mx-auto img-fluid"
            alt=""
          />

          <h2 className="welcome-title">Happy To Have You On-board</h2>
          <p className="welcome-subtitle">
            Please fill up the fields below to create a new account
          </p>

          <form onSubmit={handleRegister}>
            <input
              aria-label="Email address"
              className="form-control mb-3"
              placeholder="Full Name"
              required=""
              type="text"
              name="name"
              onChange={handleChange}
              value={inputs.name}
            />
            <p style={{ color: "red" }}>{errors.name}</p>

            <input
              aria-label="Email address"
              className="form-control mb-3"
              placeholder="Email address"
              required=""
              type="email"
              name="email"
              onChange={handleChange}
              value={inputs.email}
            />
            <p style={{ color: "red" }}>{errors.email}</p>

            <input
              aria-label="Email address"
              className="form-control mb-3"
              placeholder="Phone Number"
              required=""
              type="text"
              name="phone_no"
              maxLength={10}
              onChange={handleChange}
              value={inputs.phone_no}
            /> 
            <p style={{ color: "red" }}>{errors.phone_no}</p>

            <div className="password-wrapper mb-3">
              <input
                aria-label="Password"
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                required=""
                type="password"
                name="password"
                onChange={handleChange}
                value={inputs.password}
              />
              <p style={{ color: "red" }}>{errors.password}</p>

              <button
                aria-label="Toggle password visibility"
                className="toggle-password"
                type="button"
              >
                <i className="fas fa-eye-slash"></i>
              </button>
            </div>

            <div className="password-wrapper mb-3">
              <input
                aria-label="Password"
                className="form-control"
                id="passwordInput"
                placeholder="Confirm Password"
                required=""
                type="password"
                name="confirm_password"
                onChange={handleChange}
                value={inputs.confirm_password}
              />
              <p style={{ color: "red" }}>{errors.confirm_password}</p>

              <button
                aria-label="Toggle password visibility"
                className="toggle-password"
                type="button"
              >
                <i className="fas fa-eye-slash"></i>
              </button>
            </div>

            

 
            {/* ✅ reCAPTCHA Widget */}
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // 🔁 Replace this
              onChange={handleCaptcha}
              className="mb-3"
            />
            {!captchaToken && <p style={{ color: "red" }}>Please verify reCAPTCHA</p>}

            <button className="btn w-100 btn-main" type="submit">
              Sign Up
            </button>
          </form>

           <div className="dwdwerwerwerr row my-4 align-items-center justify-content-center">
            <div className="col-3 pe-0">
              <span></span>
            </div>

            <div className="col-3">
              <p className="mb-0">Or Login with</p>
            </div>

            <div className="col-3 ps-0">
              <span></span>
            </div>
          </div>

          <div className="doiwejojweojrwer row align-items-center">
            <div className="col-6 mb-4">
              <div className="dwenriwerwer_inner">
                <button className="btn btn-main w-100"><img src="/images/search (2).png" alt="" /> Google</button>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="dwenriwerwer_inner">
                <button className="btn btn-main w-100"><img src="/images/facebook (4)-Photoroom.png" alt="" /> Facebook</button>
              </div>
            </div>
          </div>

          <p className="signup-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
