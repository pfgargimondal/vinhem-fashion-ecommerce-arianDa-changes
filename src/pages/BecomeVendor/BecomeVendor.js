import { useEffect, useState } from "react";
import styles from "./BecomeVendor.module.css";
import http from "../../http";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { useLocation } from "react-router-dom";
import { optimizeImage } from "../../utils/optimizeImage";

export const BecomeVendor = () => {
  const [loading, setLoading] = useState(false);
  const [pageMetaData, setPageMetaData] = useState([]);
                      
  const pathName = useLocation().pathname;

  const [inputs, setInputs] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone_number: "",
    state: "",
    city: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const [supplierRegistrationImageUrl, setSupplierRegistrationImageUrl] =
    useState();
  const [supplierRegistrationBanner, setSupplierRegistrationBanner] =
    useState();

  useEffect(() => {
    const fetchSupplierRegistrationBannerData = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-vendor-banner");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setSupplierRegistrationImageUrl(getresponse.data.image_url);
        setSupplierRegistrationBanner(getresponse.data.data.banner_image);
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierRegistrationBannerData();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validateInputs = (inputs) => {
    const newErrors = {};

    if (!inputs.company_name) {
      newErrors.company_name = "Company Name Feild is required";
    }

    if (!inputs.contact_person) {
      newErrors.contact_person = "Contact Person Feild is required";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!inputs.phone_number.trim()) {
      newErrors.phone_number = "Phone Number is required";
    } else if (!/^[6-9]\d{9}$/.test(inputs.phone_number)) {
      newErrors.phone_number = "Enter a valid 10-digit mobile number";
    }

    if (!inputs.state) {
      newErrors.state = "State Feild is required";
    }

    if (!inputs.city) {
      newErrors.city = "City Feild is required";
    }
    if (!inputs.address.trim()) {
      newErrors.address = "Address Feild is required";
    }
    if (!inputs.message.trim()) {
      newErrors.message = "Message Feild is required";
    }

    return newErrors;
  };

  // Form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(inputs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await http.post("/vendor-registration-store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === true) {
        toast.success(response.data.message, {
          style: {
            background: "#2ecc71",
            color: "#fff",
          },
        });

        setInputs({
          company_name: "",
          contact_person: "",
          email: "",
          phone_number: "",
          state: "",
          city: "",
          address: "",
          message: "",
        });
      } else {
        toast.error(response.data.message, {
          style: {
            background: "#e74c3c", // red for error
            color: "#fff",
          },
        });
        setInputs({
          company_name: "",
          contact_person: "",
          email: "",
          phone_number: "",
          state: "",
          city: "",
          address: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={` ${styles.jvjhubjkjoij}`}>
        <div className="container-fluid">
          <div className={styles.aboutusbannr}>
            <img
              src={
                supplierRegistrationBanner && supplierRegistrationImageUrl
                  ? optimizeImage(`${supplierRegistrationImageUrl}/${supplierRegistrationBanner}`)
                  : "none"
              }
              className="w-100"
              style={{
                borderRadius: "27px",
                marginTop: "1rem",
                overflow: "hidden",
              }}
              alt=""
            />
          </div>
        </div>

        <div className={styles.xfhgjhusfgsd}>
          <div className="container-fluid px-5">
            <h3 className="mb-4 text-center">
              <strong> SUPPLIER REGISTRATION</strong>
            </h3>
            <div className={styles.bfghfds}>
              <form
                noValidate
                onSubmit={submitForm}
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className={styles.fgsdhfsdf66546}>
                    <div className={styles.sdbfsdhf}>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Company Name </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="text"
                              name="company_name"
                              placeholder="Company Name"
                              value={inputs.company_name}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>
                              {errors.company_name}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Contact Person</label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="text"
                              name="contact_person"
                              placeholder="Contact Person"
                              value={inputs.contact_person}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>
                              {errors.contact_person}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Email Id </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="email"
                              name="email"
                              placeholder="Example@mail.com"
                              value={inputs.email}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>{errors.email}</p>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Phone Number </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="text"
                              name="phone_number"
                              placeholder="Phone Number"
                              value={inputs.phone_number}
                              maxLength="10"
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>
                              {errors.phone_number}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">State </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="text"
                              name="state"
                              placeholder="State"
                              value={inputs.state}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>{errors.state}</p>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">City </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <input
                              type="text"
                              name="city"
                              placeholder="City"
                              value={inputs.city}
                              onChange={handleChange}
                              className="form-control"
                            />
                            <p style={{ color: "red" }}>{errors.city}</p>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Address </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <textarea
                              type="text"
                              name="address"
                              placeholder="Address"
                              value={inputs.address}
                              onChange={handleChange}
                              className="form-control"
                            ></textarea>
                            <p style={{ color: "red" }}>{errors.address}</p>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div className={styles.dsbfsdjhf}>
                            <label for="">Message </label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={styles.dfdfg55}>
                            <textarea
                              type="text"
                              name="message"
                              placeholder="Message"
                              value={inputs.message}
                              onChange={handleChange}
                              className="form-control"
                            >
                              {" "}
                            </textarea>
                            <p style={{ color: "red" }}>{errors.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className={styles.dfbdfhsd}>
                          <button type="submit" className={styles.btn55}>
                            Submit
                          </button>
                          <button className={styles.btn55aa}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
