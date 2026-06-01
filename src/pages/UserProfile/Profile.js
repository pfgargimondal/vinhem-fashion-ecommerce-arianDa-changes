import { UserProfileNavMenu } from "../../components";
import styles from "./Css/Profile.module.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import http from "../../http";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

export const Profile = () => {
  const { user, token, dispatch } = useAuth(); // ✅ from AuthContext
  const [loading, setLoading] = useState(true);

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [resUsernavToggle, setResUsernavToggle] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    gender: "",
    bio: "",
    date_of_birth: "",
    national_id: "",
    apartment: "",
    street_address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    landmark: "",
  });

  // ✅ Load user into state
  useEffect(() => {
    if (user) {
      setLoading(false);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_no: user.phone_no || "",
        gender: user.gender || "",
        bio: user.bio || "",
        date_of_birth: user.date_of_birth || "",
        national_id: user.national_id || "",
        apartment: user.apartment || "",
        street_address: user.street_address || "",
        country: user.country || "",
        state: user.state || "",
        city: user.city || "",
        pin: user.pin || "",
        landmark: user.landmark || "",
      });

      if (user.profile_picture) {
        setPreviewImage(user.profile_picture);
      }
    }
  }, [user]);

  const handleEdit = () => setIsEditable(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await http.post("/user/profile/update", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated!");

        dispatch({
          type: "UPDATE_PROFILE",
          payload: response.data.data, // only user data
        });

        setIsEditable(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  // ✅ Image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // preview instantly
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("profile_image", file);

      const response = await http.post("/user/profile/upload-image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Profile picture updated!");

        if (response.data.image_url) {
          setPreviewImage(response.data.image_url);

          dispatch({
            type: "UPDATE_PROFILE",
            payload: { profile_picture: response.data.image_url }, // merge into user
          });
        }
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
      return <Loader />;
  }


  return (
    <div className="sdfgtrfegrgtrg">
      <div className={styles.ffhfdf}>
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu resUsernavToggle={resUsernavToggle} setResUsernavToggle={setResUsernavToggle} />
            </div>

            <div className="col-lg-9">
              <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                  <h4 className="mb-0">Profile Information</h4>
                  {/* <p className="mb-0">
                    <Link to="/">
                      <i className="fa-solid me-1 fa-arrow-left"></i> Back To
                      Home <i className="fa-solid ms-1 fa-house"></i>
                    </Link>
                  </p> */}

                  <div className={`${styles.fbhdfs} ${styles.fdndfjh} ${styles.iehirjwoerwer} d-none col-4 align-items-center justify-content-end`}>
                    <button className="btn" onClick={handleEdit}>
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                  </div>
                </div>

                <div className={`${styles.fbhdfs} row justify-content-between align-items-center mb-4`}>
                  <div className={`${styles.dfghdfgdf} col-4 mb-4`}>
                    <i onClick={() => setResUsernavToggle(true)} className={`fa-solid ${styles.bgdfbsseeew} d-none me-2 fa-angles-right`}></i>
                     
                    <div className={`${styles.sdfjhsdfs} position-relative`}>
                      <img
                        src={previewImage || "./images/pfle.jpg"}
                        alt="Profile"
                      />

                      <label
                        htmlFor="usr-prfle-upld"
                        className={`${styles.indiwerwer} position-absolute`}
                      >
                        <i className="bi text-white position-absolute bi-upload"></i>
                      </label>

                      <input
                        type="file"
                        className="d-none"
                        id="usr-prfle-upld"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className={styles.dfbghdfg}>
                      <h5 className="mb-0">{formData.name}</h5>
                    </div>
                  </div>                  
                  
                  <div className={`${styles.dwoejoidwemjr} col-lg-4`}>
                    <ol className={styles.steps}>
                      <li className={`${styles.step} ${styles.is_active}`} data-step={1}>
                        <span className={styles.doejojewr}>Current</span>

                        <img src="./images/sadw.png" alt="" />

                        <span className={styles.oajeorjer}>Silver</span>
                      </li>

                      <li className={`${styles.step}`} data-step={2}>
                        <span className={`${styles.doejojewr} ${styles.opacity_hidden}`}>Current</span>

                        <img src="./images/sae.png" alt="" />

                        <span className={styles.oajeorjer}>Gold <br /> <span>Shop 25,000 <br /> To upgrade</span></span>
                      </li>

                      <li className={`${styles.step}`} data-step={3}>
                        <span className={`${styles.doejojewr} ${styles.opacity_hidden}`}>Current</span>

                        <img src="./images/sadew.png" alt="" />

                        <span className={styles.oajeorjer}>Platinum <br /> <span>Shop 50,000 To upgrade</span></span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className={styles.sdfnsdjkfsdf}>
                  <div
                    className={`mb-3 ${styles.fbhdfs} ${styles.fdndfjh} ${styles.oidheuiwhroijwer} d-flex align-items-center justify-content-between`}
                  >
                    <h5 className={`${styles.acdfvdscvdrtefr}`}>
                      Personal Details
                    </h5>
                    <button className={`btn ${styles.fodnikfmskmjfreee}`} onClick={handleEdit}>
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                  </div>

                  <form>
                    <div className={styles.sdksdfsdf}>
                      <div className="row">
                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Full Name</label>

                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              disabled={!isEditable}
                              placeholder="Ravindra Jadeja"
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Email Address</label>

                            <input
                              type="email"
                              className="form-control"
                              placeholder="jaddu@gmail.com"
                              name="email"
                              value={formData.email}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="7854952585"
                              oninput="this.value = this.value.replace(/[^0-9.]/g, '');"
                              name="phone_no"
                              maxLength={10}
                              value={formData.phone_no}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Gender</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Male"
                              name="gender"
                              value={formData.gender}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Bio</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Customer Service Manager"
                              name="bio"
                              value={formData.bio}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div> */}

                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>Date Of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              placeholder="10 june 2004"
                              name="date_of_birth"
                              value={formData.date_of_birth}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 mb-3">
                          <div className={styles.dhfsdfd}>
                            <label>National ID</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="658-8568-8586"
                              name="national_id"
                              value={formData.national_id}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.dfgdfg6526} mt-5`}>
                      <h5 className={`mb-3 ${styles.acdfvdscvdrtefr}`}>
                        Address Details
                      </h5>
                    </div>

                    <div className={styles.dfgdfhdf5156}>
                      <div className="row">
                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>Apartment / Building / Floor No.</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              name="apartment"
                              value={formData.apartment}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>Street Address</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              name="street_address"
                              value={formData.street_address}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>Country</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="India"
                              name="country"
                              value={formData.country}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>State</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              name="state"
                              value={formData.state}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>City</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              name="city"
                              value={formData.city}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>Pin Code</label>
                            <input
                              type="text"
                              className="form-control"
                              oninput="this.value = this.value.replace(/[^0-9.]/g, '');"
                              placeholder="742121"
                              name="pin"
                              maxLength={6}
                              value={formData.pin}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dhfsdfd}>
                            <label>Landmark</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder=""
                              name="landmark"
                              value={formData.landmark}
                              disabled={!isEditable}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.dienwrhwerwer}`}>
                      <div className={`${styles.dnjhsddsfsd} text-center`}>
                        {!isEditable ? (
                          <button disabled>Save</button>
                        ) : (
                          <button onClick={handleSave}>Save</button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
