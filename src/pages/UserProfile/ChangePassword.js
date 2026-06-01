import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/ChangePassword.module.css";
import http from "../../http";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { token, dispatch } = useAuth();
  const [resUsernavToggle, setResUsernavToggle] = useState(false);

  const [inputs, setInputs] = useState({
    new_password: "",
    confirm_password: "",
  });
  // eslint-disable-next-line
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!inputs.new_password.trim()) {
      newErrors.new_password = "New password is required";
    } else if (inputs.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    }

    if (!inputs.confirm_password.trim()) {
      newErrors.confirm_password = "Please confirm your new password";
    } else if (inputs.confirm_password !== inputs.new_password) {
      newErrors.confirm_password = "Password and confirm password should be same";
    }

    return newErrors;
  };
  // eslint-disable-next-line
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {

        const response = await http.post("/user/update-password", inputs, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
                toast.success(response.data.message || "Password changed successfully");
                dispatch({ type: "LOGOUT" });
                setTimeout(() => navigate("/login"), 3000);
        } else {
            toast.error(response.data.message || "Failed to change password");
        }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.ffhfdf}>
      <div className="ansjidnkuiweer">
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu resUsernavToggle={resUsernavToggle} setResUsernavToggle={setResUsernavToggle} />
            </div>

            <div className="col-lg-9">
              <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                <div className={`${styles.doiewhrwerr} d-flex align-items-center`}>
                  <p className="mb-0 d-flex align-items-center"><i class="bi me-1 bi-chevron-left"></i> Profile <span className="mx-2">/</span> </p>

                  <h4 className="mb-0">My Vouchers & Credits</h4>
                </div> 
                
                <div className={`${styles.dihefrewrr} py-4 px-5 mt-5`}>
                  <div className="row col-lg-12 justify-content-between align-items-center">
                    <div className="col-7">
                      <div className={styles.diewhkewrwer}>
                        <div className={`${styles.dfjhdsbfsdf} mb-3`}>
                          <h4 className="mb-2">My Credit</h4>

                          <p className="ndiwhermweoewrr mb-0 d-none">
                            <Link to="/">
                              <i className="fa-solid me-1 fa-arrow-left"></i> Back To Home{" "}
                              <i className="fa-solid ms-1 fa-house"></i>
                            </Link>
                          </p>
                        </div>

                        <h5 className="mb-3">Balance</h5>

                        <p className="mb-0">Your current balance is: <span><i class="fa-solid fa-indian-rupee-sign"></i> <b>0.00</b></span></p>
                      </div>
                    </div>

                    <div className="col-5">
                      <div className={`${styles.doiwehijrwerwer} text-center`}>
                        <img src="./images/swrwww.jpg" style={{ width: "60%" }} alt="" />

                        <p className="mb-0">You have no credits</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.dihefrewrr} py-4 px-5 mt-5`}>
                  <div className="row col-lg-12 justify-content-between align-items-center">
                    <div className="col-7">
                      <div className={styles.diewhkewrwer}>
                        <div className={`${styles.dfjhdsbfsdf} d-block ${styles.oidjiejkoiijrr} mb-3`}>
                          <h4 className="mb-4">My Vouchers</h4>

                          <div className={`${styles.doejwijwe_list} mb-4`}>
                            <div><h5 className={`${styles.deikwnhwenriwejr}`}><span>1)</span> Coupon Code: VFXFT2508 - [Valid Till 28/02/2026]</h5></div>
                          </div>
                        </div>

                        <p className="mb-0">No. of Active Vouchers: <span>1</span></p>                        
                      </div>
                    </div>

                    <div className="col-5">
                      <div className={`${styles.doiwehijrwerwer} text-center`}>
                        <img src="./images/zadawda.jpg" style={{ width: "60%", height: "167px", objectFit: "contain" }} alt="" />

                        <p className="mb-0">You have no vouchers</p>
                      </div>
                    </div>
                  </div>  
                </div>                

                {/* <form onSubmit={handleSubmit}>
                  <div className={styles.fxnjhdfsdfds}>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className={styles.dfndf}>
                          <label>New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter New Password"
                            name="new_password"
                            value={inputs.new_password}
                            onChange={handleChange}
                          />
                          <p style={{ color: "red" }}>{errors.new_password}</p>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className={styles.dfndf}>
                          <label>Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Confirm Password"
                            name="confirm_password"
                            value={inputs.confirm_password}
                            onChange={handleChange}
                          />
                          <p style={{ color: "red" }}>{errors.confirm_password}</p>
                        </div>
                      </div>

                      <div className={`${styles.dienwrhwerwer} mt-5`}>
                        <div className={styles.dnjhsddsfsd}>
                          <button type="submit">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
