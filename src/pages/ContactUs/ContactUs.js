import { useEffect, useRef, useState } from "react";
import styles from "./ContactUs.module.css";
import http from "../../http";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { useLocation } from "react-router-dom";
import { optimizeImage } from "../../utils/optimizeImage";

export const ContactUs = () => {
  const [ContactUsDetails, setContactUsDetails] = useState({});
  const [ContactUsImage, setContactUsImage] = useState({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageMetaData, setPageMetaData] = useState([]);
                            
  const pathName = useLocation().pathname;
  

  useEffect(() => {
    const fetchContactUsData = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-contact-us-details");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setContactUsImage(getresponse.data.image_url);
        setContactUsDetails(getresponse.data.data);
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactUsData();
  }, []);

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

  const fileInputRef = useRef(null);

  const [inputs, setInputs] = useState({
    email: "",
    like_toKnow: "",
    need_help: "",
    more_details: "",
    attached_file: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attached_file") {
      setInputs({ ...inputs, [name]: files[0] });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const validateInputs = (inputs) => {
    const newErrors = {};

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!inputs.like_toKnow) {
      newErrors.like_toKnow = "Like To Know Feild is required";
    }

    if (!inputs.need_help) {
      newErrors.need_help = "Need Help Feild is required";
    }
    if (!inputs.more_details.trim()) {
      newErrors.more_details = "More Details Feild is required";
    }

    // if (!inputs.attached_file) {
    //     newErrors.attached_file = "Choose File Feild is required";
    // }

    if (!inputs.attached_file.type.startsWith("image/")) {
      newErrors.attached_file = "Only image files allowed";
    } else if (inputs.attached_file.size > 2 * 1024 * 1024) {
      newErrors.attached_file = "File size must be under 2MB";
    }

    return newErrors;
  };

  const handleCaptcha = (token) => setCaptchaToken(token);

  // Form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!captchaToken) {
      toast.error("Please verify reCAPTCHA");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(inputs).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("recaptcha_token", captchaToken);

      const response = await http.post("/store-enquiry", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, {
          style: {
            background: "#2ecc71",
            color: "#fff",
          },
        });

        setInputs({
          email: "",
          like_toKnow: "",
          need_help: "",
          more_details: "",
          attached_file: null,
        });
      } else {
        toast.error(response.data.message, {
          style: {
            background: "#e74c3c", // red for error
            color: "#fff",
          },
        });
        setInputs({
          email: "",
          like_toKnow: "",
          need_help: "",
          more_details: "",
          attached_file: null,
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid">
        <div className={styles.aboutusbannr}>
          <img src={ContactUsImage && ContactUsDetails.contact_details?.banner_image
                ? optimizeImage(`${ContactUsImage}/${ContactUsDetails.contact_details.banner_image}`)
                : "none"} className="w-100" style={{borderRadius: "27px", marginTop: "1rem", overflow: "hidden"}} alt="" />
        </div>
      </div>

      <div className={`${styles.jvjhubjkjoij} mt-5 px-5`}>
        <div className="container-fluid">
          <h1>
            {" "}
            {ContactUsDetails.contact_details?.title &&
              ContactUsDetails.contact_details.title}{" "}
          </h1>
          <div
            className={styles.p1}
            dangerouslySetInnerHTML={{
              __html:
                ContactUsDetails.contact_details?.description &&
                ContactUsDetails.contact_details.description,
            }}
          />

          <br />

          <div className={styles.addressSection}>
            {ContactUsDetails.contact_details?.warehouse_office_status ===
              1 && (
              <>
                <h3>Warehouse Address:</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      ContactUsDetails.contact_details?.wholeale_address || "",
                  }}
                />
              </>
            )}

            {ContactUsDetails.contact_details?.regd_office_status === 1 && (
              <>
                <h3 className={styles.sjkdefnvb}>Regd. Office Address: </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      ContactUsDetails.contact_details?.regd_address &&
                      ContactUsDetails.contact_details.regd_address,
                  }}
                />
              </>
            )}

            {ContactUsDetails.contact_details?.branch_office_status === 1 && (
              <>
                <h3> Branch Office Address: </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      ContactUsDetails.contact_details?.branch_office_address &&
                      ContactUsDetails.contact_details.branch_office_address,
                  }}
                />
              </>
            )}

            <br />
            <p>
              {ContactUsDetails.contact_details?.form_title &&
                ContactUsDetails.contact_details.form_title}
            </p>
            <div className={styles.xfhgjhusfgsd}>
              <div className="container">
                <h3 className="mb-4">
                  <strong>We're listening</strong>
                </h3>
                <div className={styles.bfghfds}>
                  <form
                    noValidate
                    onSubmit={submitForm}
                    encType="multipart/form-data"
                  >
                    <div className="row">
                      <div className="col-lg-9">
                        <div className={styles.fgsdhfsdf66546}>
                          <div className={styles.sdbfsdhf}>
                            <div className="row">
                              <div className="col-lg-3">
                                <div className={styles.dsbfsdjhf}>
                                  <label for="">
                                    My Email Id <span>*</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-9">
                                <div className={styles.dfdfg55}>
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="E-Mail Address"
                                    value={inputs.email}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  <p style={{ color: "red" }}>{errors.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.sdbfsdhf}>
                            <div className="row">
                              <div className="col-lg-3">
                                <div className={styles.dsbfsdjhf}>
                                  <label for="">
                                    I'd like to know about <span>*</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-9">
                                <div className={styles.dfdfg55}>
                                  <input
                                    type="text"
                                    name="like_toKnow"
                                    value={inputs.like_toKnow}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder=""
                                  />

                                  <p style={{ color: "red" }}>
                                    {errors.like_toKnow}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.sdbfsdhf}>
                            <div className="row">
                              <div className="col-lg-3">
                                <div className={styles.dsbfsdjhf}>
                                  <label for="">
                                    I Need help at <span>*</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-9">
                                <div className={styles.dfdfg5www5}>
                                  <select
                                    name="need_help"
                                    id=""
                                    value={inputs.need_help}
                                    className="form-select"
                                    onChange={handleChange}
                                  >
                                    <option value="">Choose One..</option>
                                    {ContactUsDetails.contact_question?.map(
                                      (item, index) => (
                                        <option
                                          key={index}
                                          value={item.question}
                                        >
                                          {item.question}
                                        </option>
                                      ),
                                    )}
                                  </select>
                                  <p style={{ color: "red" }}>
                                    {errors.need_help}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.sdbfsdhf}>
                            <div className="row">
                              <div className="col-lg-3">
                                <div className={styles.dsbfsdjhf}>
                                  <label for="">
                                    More Details <span>*</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-9">
                                <div className={styles.fbdf454}>
                                  <textarea
                                    name="more_details"
                                    id=""
                                    placeholder="Text Me..."
                                    value={inputs.more_details}
                                    onChange={handleChange}
                                    rows="4"
                                    cols="4"
                                    className="form-control"
                                  ></textarea>

                                  <p style={{ color: "red" }}>
                                    {errors.more_details}
                                  </p>

                                  <input
                                    type="file"
                                    className={styles.inputFile}
                                    id="file"
                                    name="attached_file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    ref={fileInputRef}
                                    // multiple data-multiple-caption="{count} files selected"
                                  />

                                  <label
                                    for="file"
                                    className={`btn ${styles.btnUpload}`}
                                  >
                                    <i className="fa-solid fa-plus"></i> Attach
                                    a File
                                  </label>
                                  <p style={{ color: "red" }}>
                                    {errors.attached_file}
                                  </p>
                                </div>

                                <ReCAPTCHA
                                  sitekey="6Lfg6HwrAAAAAIFNXRViSAvHT3R3edYCk8Hg_pHA" // 🔁 Replace this
                                  onChange={handleCaptcha}
                                  className="mb-3"
                                />
                                {!captchaToken && (
                                  <p style={{ color: "red" }}>
                                    Please verify reCAPTCHA
                                  </p>
                                )}

                                <div className={`${styles.dfbdfhsd} text-center`}>
                                  <button
                                    type="submit"
                                    className={styles.btn55}
                                  >
                                    Submit
                                  </button>
                                  <button className={styles.btn55aa}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3"></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
