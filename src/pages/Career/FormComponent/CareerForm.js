import { useState, useRef } from "react";
import { toast } from "react-toastify";
import http from "../../../http";

export const CareerForm = ({ jobOpenings }) => {
  const fileInputRef = useRef(null);
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    contact_no: "",
    email: "",
    job_position: "",
    message: "",
    upload_cv: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "upload_cv") {
      setInputs({ ...inputs, [name]: files[0] });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const validateInputs = (inputs) => {
    const newErrors = {};
    if (!inputs.first_name.trim())
      newErrors.first_name = "First Name is required";
    if (!inputs.last_name.trim()) newErrors.last_name = "Last Name is required";
    if (!inputs.contact_no.trim() || !/^\d{10}$/.test(inputs.contact_no))
      newErrors.contact_no = "Enter a valid 10-digit contact number";
    if (!inputs.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email))
      newErrors.email = "Enter a valid email address";
    if (!inputs.job_position.trim())
      newErrors.job_position = "Please select a position";
    if (!inputs.message.trim()) newErrors.message = "Message is required";
    if (!inputs.upload_cv)
      newErrors.upload_cv = "Please upload your CV (PDF or image)";
    else if (
      inputs.upload_cv.type !== "application/pdf" &&
      !inputs.upload_cv.type.startsWith("image/")
    )
      newErrors.upload_cv = "Only PDF or image files allowed";
    else if (inputs.upload_cv.size > 2 * 1024 * 1024)
      newErrors.upload_cv = "File must be under 2MB";
    return newErrors;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const formData = new FormData();
      Object.entries(inputs).forEach(([key, value]) => formData.append(key, value));

      const response = await http.post("/apply-for-job", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Application submitted successfully!", {
          style: { background: "#2ecc71", color: "#fff" },
        });
      } else {
        toast.error(response.data.message || "Submission failed", {
          style: { background: "#e74c3c", color: "#fff" },
        });
      }

      setInputs({
        first_name: "",
        last_name: "",
        contact_no: "",
        email: "",
        job_position: "",
        message: "",
        upload_cv: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="dfgjhubdfgdfg">
      <form onSubmit={submitForm} noValidate encType="multipart/form-data">
        <div className="row">
          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={inputs.first_name}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.first_name}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Enter Last Name"
                  value={inputs.last_name}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.last_name}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Contact No</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_no"
                  maxLength={10}
                  placeholder="Enter Contact No"
                  value={inputs.contact_no}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.contact_no}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter Your Email"
                  value={inputs.email}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.email}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Post Applied For</label>
                <select
                  name="job_position"
                  className="form-select"
                  value={inputs.job_position}
                  onChange={handleChange}
                >
                  <option value="">Choose one</option>

                  {jobOpenings?.map((job, index) => (
                    <option key={job.id || index} value={job.title}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <p style={{ color: "red" }}>{errors.job_position}</p>
              </div>
            </div>
          </div>  

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Upload CV</label>
                <input
                  type="file"
                  className="form-control"
                  name="upload_cv"
                  ref={fileInputRef}
                  accept=".pdf,image/*"
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.upload_cv}</p>
              </div>
            </div>
          </div>       

          <div className="col-lg-6">
            <div className="gjsdfgs">
              <div className="xfxf888">
                <label>Message</label>
                
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Type here..."
                  value={inputs.message}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.message}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="gjsdfgs">
              <div className="dfbgjhdf5 mt-3">
                <button type="submit" className="btn btn-main">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};