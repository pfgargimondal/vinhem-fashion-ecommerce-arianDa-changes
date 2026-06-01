import React,{ useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Css/OrderDetails.css";
import http from "../../http";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";
import { optimizeImage } from "../../utils/optimizeImage";


export const OrderDetails = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moreDetails, setMoreDetails] = useState(false);
  const [orderDetailsMessurmntModal, setOrderDetailsMessurmntModal] = useState(false);
  const [orderMeasurementData, setOrderMeasurementData] = useState(null);
  const [selectedOrderProductId, setSelectedOrderProductId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [customFeildSelectOption, setcustomFeildSelectOption] = useState({});
  const [productMeasurementData, setProductMeasurementData] = useState({});

  const [activeGuide, setActiveGuide] = useState(null);
  // eslint-disable-next-line
  const [feildNameGuide, setFeildNameGuide] = useState(null);
  const [showTabs, setShowTabs] = useState(false);

  const [unit, setUnit] = useState("inch");
  const [showPetticoat, setShowPetticoat] = useState(false);
  const [formData, setFormData] = useState({
      measurment_name: "",
      measurement_fit: "",
      unit: "inch",
      with_petticoat_lahenga: "",
      fall_edging_work_lahenga: false,
      matching_tassles_lahenga: false,
      additional_customization_lahenga: "",
      include_petticoat_saree: "",
      saree_fall_edging: false,
      saree_matching_tassles: false,
      additional_customize_saree: "",
      additional_customize_dress: "",
      additional_customization: "",
  });

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await http.get(`/user/get-order-details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrderData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  }, [id]); // include dependencies used inside

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);


  const toggleDetails = (index) => {
    setMoreDetails((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  // ✅ Utility function to format date/time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>Loading Order Details...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <h5>{error}</h5>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center py-5">
        <h5>No Order Data Found</h5>
      </div>
    );
  }

  const { order, products } = orderData;

  // ✅ OPEN MODAL (merged logic)
  const handleMessrmntTogle = (item) => {
    const html = document.querySelector("html");
    html.classList.add("overflow-hidden");
    

    setOrderMeasurementData(item?.user_measurmentDetails || null);
    setProductMeasurementData(item?.mesurament_form_data || {});
    setcustomFeildSelectOption(item?.custom_feild_selectOption || {});
    setSelectedOrderProductId(item?.product?.PID || item?.product_id);
    setSelectedProductId(item?.product?.id);
    setOrderDetailsMessurmntModal(true);
  };



  // ✅ CLOSE MODAL (merged logic)
  const handleMessrmntClose = () => {
    const html = document.querySelector("html");
    html.classList.remove("overflow-hidden");

    setOrderDetailsMessurmntModal(false);
    showTabs && setShowTabs(false);
    activeGuide && setActiveGuide(null);
  
  };

    const fields = [
      {
        label: "Around Bust",
        key: "lehenga_around_bust_option",
        image: "lehenga_around_bust",
        guide: "aroundBust",
      },
      {
        label: "Around Above Waist",
        key: "lehenga_above_waist_option",
        image: "lehenga_above_waist",
        guide: "aboveWaist",
      },
      {
        label: "Choli Length",
        key: "lehenga_choli_length_option",
        image: "lehenga_choli_length",
        guide: "choliLength",
      },
      {
        label: "Shoulder",
        key: "lehenga_shoulder_option",
        image: "lehenga_shoulder",
        guide: "shoulder",
      },
      {
        label: "Sleeve Length",
        key: "lehenga_sleeve_length_option",
        image: "lehenga_sleeve_length",
        guide: "sleeveLength",
      },
      {
        label: "Sleeve Style",
        key: "lehenga_sleeve_style_options",
        image: "lehenga_sleeve_style",
        guide: "sleeveStyle",
      },
      {
        label: "Around Arm",
        key: "lehenga_around_arm_option",
        image: "lehenga_around_arm",
        guide: "aroundArm",
      },
      {
        label: "Blouse Pads",
        key: "lehenga_blouse_pads_options",
        image: "lehenga_blouse_pads",
        guide: "blousePads",
      },
      {
        label: "Back Neck Depth",
        key: "lehenga_back_neck_depth_option",
        image: "lehenga_back_neck_depth",
        guide: "backNeckDepth",
      },
      {
        label: "Front Neck Depth",
        key: "lehenga_front_neck_depth_option",
        image: "lehenga_front_neck_depth",
        guide: "frontNeckDepth",
      },
      {
        label: "Choli Closing Side",
        key: "lehenga_choli_closing_side_options",
        image: "lehenga_choli_closing_side",
        guide: "choliClosingSide",
      },
      {
        label: "Choli Closing With",
        key: "lehenga_choli_closing_with_options",
        image: "lehenga_choli_closing_with",
        guide: "choliClosingWith",
      },
    ];
  
    const lehengaFields = [
      {
        label: "Around Waist",
        key: "lehenga_around_waist_option",
        image: "lehenga_around_waist",
        guide: "aroundWaist",
      },
      {
        label: "Around Hip",
        key: "lehenga_around_hip_option",
        image: "lehenga_around_hip",
        guide: "aroundHip",
      },
      {
        label: "Lehenga Length",
        key: "lehenga_length_option",
        image: "lehenga_length",
        guide: "lehengaLength",
      },
      {
        label: "Lehenga Side Closing",
        key: "lehenga_side_closing_options",
        image: "lehenga_side_closing",
        guide: "lehengaSideClosing",
      },
      {
        label: "Petticoat Waist (Inskirt)",
        key: "lehenga_petticoat_waist_option",
        image: "lehenga_petticoat_waist",
        guide: "petticoatWaist",
      },
      {
        label: "Petticoat Length (Inskirt)",
        key: "lehenga_petticoat_length_option",
        image: "lehenga_petticoat_length",
        guide: "petticoatLength",
      },
    ];
  
    const sareeFields = [
      {
        label: "Around Bust",
        key: "saree_around_bust_option",
        image: "saree_around_bust",
        guide: "aroundBust",
      },
      {
        label: "Around Above Waist",
        key: "saree_above_waist_option",
        image: "saree_above_waist",
        guide: "aboveWaist",
      },
      {
        label: "Blouse Length",
        key: "saree_blouse_length_option",
        image: "saree_blouse_length",
        guide: "blouseLength",
      },
      {
        label: "Shoulder",
        key: "saree_shoulder_option",
        image: "saree_shoulder",
        guide: "shoulder",
      },
      {
        label: "Sleeve Length",
        key: "saree_sleeve_length_option",
        image: "saree_sleeve_length",
        guide: "sleeveLength",
      },
      {
        label: "Sleeve Style",
        key: "saree_sleeve_style_options",
        image: "saree_sleeve_style",
        guide: "sleeveStyle",
      },
      {
        label: "Around Arm",
        key: "saree_around_arm_option",
        image: "saree_around_arm",
        guide: "aroundArm",
      },
      {
        label: "Blouse Pads",
        key: "saree_blouse_pads_options",
        image: "saree_blouse_pads",
        guide: "blousePads",
      },
      {
        label: "Front Neck Depth",
        key: "saree_front_neck_depth_option",
        image: "saree_front_neck_depth",
        guide: "frontNeckDepth",
      },
      {
        label: "Back Neck Depth",
        key: "saree_back_neck_depth_option",
        image: "saree_back_neck_depth",
        guide: "backNeckDepth",
      },
      {
        label: "Blouse Closing Side",
        key: "saree_blouse_closing_side_options",
        image: "saree_blouse_closing_side",
        guide: "blouseClosingSide",
      },
      {
        label: "Blouse Closing With",
        key: "saree_blouse_closing_with_options",
        image: "saree_blouse_closing_with",
        guide: "blouseClosingWith",
      },
      {
        label: "Petticoat Waist (Inskirt)",
        key: "saree_petticoat_waist_option",
        image: "saree_petticoat_waist",
        guide: "petticoatWaist",
      },
      {
        label: "Petticoat Length (Inskirt)",
        key: "saree_petticoat_length_option",
        image: "saree_petticoat_length",
        guide: "petticoatLength",
      },
    ];
  
    const bottomDressFields = [
      {
        label: "Around Waist",
        key: "dress_around_waist_option",
        image: "dress_around_waist",
        guide: "aroundWaist",
      },
      {
        label: "Around Thigh",
        key: "dress_around_thigh_option",
        image: "dress_around_thigh",
        guide: "aroundThigh",
      },
      {
        label: "Around Knee",
        key: "dress_around_knee_option",
        image: "dress_around_knee",
        guide: "aroundKnee",
      },
      {
        label: "Around Calf",
        key: "dress_around_calf_option",
        image: "dress_around_calf",
        guide: "aroundCalf",
      },
      {
        label: "Bottom Length",
        key: "dress_bottom_length_option",
        image: "dress_bottom_length",
        guide: "bottomLength",
      },
      {
        label: "Bottom Style",
        key: "dress_bottom_style_options",
        image: "dress_bottom_style",
        guide: "bottomStyle",
      },
      {
        label: "Bottom Closing Side",
        key: "dress_bottom_closing_side_options",
        image: "dress_bottom_closing_side",
        guide: "bottomClosingSide",
      },
      {
        label: "Bottom Closing With",
        key: "dress_bottom_closing_with_options",
        image: "dress_bottom_closing_with",
        guide: "bottomClosingWith",
      },
    ];
  
    const dressFields = [
      {
        label: "Around Bust",
        key: "dress_around_bust_option",
        image: "dress_around_bust",
        guide: "aroundBust",
      },
      {
        label: "Shoulder",
        key: "dress_shoulder_option",
        image: "dress_shoulder",
        guide: "shoulder",
      },
      {
        label: "Around Arm",
        key: "dress_around_arm_option",
        image: "dress_around_arm",
        guide: "aroundArm",
      },
      {
        label: "Front Neck Depth",
        key: "dress_front_neck_depth_option",
        image: "dress_front_neck_depth",
        guide: "frontNeckDepth",
      },
      {
        label: "Back Neck Depth",
        key: "dress_back_neck_depth_option",
        image: "dress_back_neck_depth",
        guide: "backNeckDepth",
      },
      {
        label: "Sleeve Length",
        key: "dress_sleeve_length_option",
        image: "dress_sleeve_length",
        guide: "sleeveLength",
      },
      {
        label: "Sleeve Style",
        key: "dress_sleeve_style_options",
        image: "dress_sleeve_style",
        guide: "sleeveStyle",
      },
      {
        label: "Around Above Waist",
        key: "dress_around_above_waist_option",
        image: "dress_around_above_waist",
        guide: "aboveWaist",
      },
      {
        label: "Around Hip",
        key: "dress_around_hip_option",
        image: "dress_around_hip",
        guide: "aroundHip",
      },
      {
        label: "Kurta Length",
        key: "dress_kurta_length_option",
        image: "dress_kurta_length",
        guide: "kurtaLength",
      },
      {
        label: "Kurta Closing Side",
        key: "dress_kurta_closing_side_options",
        image: "dress_kurta_closing_side",
        guide: "kurtaClosingSide",
      },
      {
        label: "Kurta Closing With",
        key: "dress_kurta_closing_with_options",
        image: "dress_kurta_closing_with",
        guide: "kurtaClosingWith",
      },
    ];
  
    const data = productMeasurementData;
  
    // if (productDetails?.data?.custom_feild_selectOption !== "generic")
    //   return null;
  
    const measurementFields = [
      { key: "generic_around_bust", label: "Around Bust" },
      { key: "generic_shoulder", label: "Shoulder" },
      { key: "generic_front_neck_depth", label: "Front Neck Depth" },
      { key: "generic_back_neck_depth", label: "Back Neck Depth" },
      { key: "generic_sleeve_length", label: "Sleeve Length" },
      { key: "generic_top_length", label: "Top Length" },
      { key: "generic_blouse_length", label: "Blouse Length" },
      { key: "generic_height", label: "Height" },
      { key: "generic_bottom_length", label: "Bottom Length" },
      { key: "generic_waist", label: "Waist" },
    ];
  
    const getOptionsGeneric = (prefix) => {
      if (unit === "inch") {
        return data?.[`${prefix}_inch`]?.split(",") || [];
      } else if (data?.[`${prefix}_cm`]) {
        return data?.[`${prefix}_cm`]?.split(",") || [];
      } else {
        return (
          data?.[`${prefix}_inch`]
            ?.split(",")
            ?.map((val) => (parseFloat(val.trim()) * 2.54).toFixed(2)) || []
        );
      }
    };
  

  
    // Helper: get options based on unit
    const getOptions = (key) => {
      const keyWithUnit = key.endsWith("_options") ? key : `${key}_${unit}`;
      const dataKey =
        productMeasurementData?.[`${key}_${unit}`] ||
       productMeasurementData?.[keyWithUnit];
  
      return dataKey ? dataKey.split(",").map((v) => v.trim()) : [];
    };
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleChangeLahenga = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
  
    const handleChangeSaree = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleChangeGeneric = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleSave = async() => {
      // eslint-disable-next-line
      localStorage.setItem("measurementFormData", JSON.stringify(formData));

      const savedData = localStorage.getItem("measurementFormData");
      if (!savedData) {
        toast.error("No measurement data found! Please fill the measurement form first.");
        return;
      }

      // console.log(savedData);
      const parsedData  = JSON.parse(savedData);

        try {
          setLoading(true);

          const res = await http.post(
            "/user/update-measurement-data-after-order",
            {
              product_id: selectedProductId,
              order_id: order?.order_id,
              type: customFeildSelectOption,
              ...parsedData,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // console.log("Response:", res);

          if (res?.data?.success === true) {
            
            localStorage.removeItem("measurementFormData");
            handleMessrmntClose(false);
            toast.success(res.data.message || "Measurement submitted successfully!");
            fetchOrderDetails();

          } else {
            toast.error(res?.data?.message || "Failed to add data");
          }
        } catch (error) {
          console.error("Error submitting measurement:", error);
          toast.error("Error submitting measurement!");
        } finally {
          setLoading(false);
        }
    };
  
  if (loading) {
    return <Loader />;
  }

  return (
    <>
    <div className="dthnxdftnj">
      <section className="order-details py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>
              Order: <span>#{order?.order_id}</span>
            </h5>
            <div className="buttons">
              <button className="second-button" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>
          </div>

          <div className="details mb-4">
            <p>
              <strong>Order Status:</strong> {order?.order_status?.replace(/_/g, " ").toUpperCase() || "N/A"}
            </p>
            <p>
              <strong>Payment Method:</strong> {order?.payment_method?.replace(/_/g, " ").toUpperCase() || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(order?.created_at)}
            </p>
            <p>
              <strong>Updated:</strong> {formatDate(order?.updated_at)}
            </p>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="fw-bold">Shipping Address</h6>
              <p>
                <strong>Name:</strong> {order?.shippingName} <br />
                <strong>Email:</strong> {order?.shippingEmail} <br />
                <strong>Phone:</strong> {order?.shippingNumber} <br />
                <strong>Address:</strong> {order?.shippingFullAddress} <br />
                <strong>State:</strong> {order?.shippingState} <br />
                <strong>City:</strong> {order?.shippingCity} <br />
                <strong>Zip:</strong> {order?.shippingPinCode} <br />
                <strong>Address As:</strong> {order?.shippingAddressAs}
              </p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold">Billing Address</h6>
              <p>
                <strong>Name:</strong> {order?.billingName} <br />
                <strong>Email:</strong> {order?.billingEmail} <br />
                <strong>Phone:</strong> {order?.billingNumber} <br />
                <strong>Address:</strong> {order?.billingFullAddress} <br />
                <strong>State:</strong> {order?.billingState} <br />
                <strong>City:</strong> {order?.billingCity} <br />
                <strong>Zip:</strong> {order?.billingPinCode} <br />
                <strong>Address As:</strong> {order?.billingAddressAs}
              </p>
            </div>
          </div>

          {/* <h6 className="fw-bold mb-3">Products</h6> */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Product Details</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item, index) => (
                  <>
                    <tr key={index}>
                      <td className="d-flex align-items-center gap-3">
                        <img
                          src={optimizeImage(item?.product_image) || "/images/no-image.png"}
                          className="rounded"
                          alt={item?.product?.product_name}
                          width={70}
                          height={70}
                        />
                        <div>
                          <p className="mb-1 fw-bold text-dark">
                            {item?.product?.product_name}
                          </p>
                          <p className="mb-0">
                            Quantity: {item?.quantity} <br />
                            {item?.product_size !== "" && (
                              <>
                              Size: {item?.product_size} <br />
                              </>
                            )}
                            Price: ₹{item?.total_price}

                            <div className="idniehrewrer d-flex align-items-center">
                              <span className="d-block me-3" onClick={() => toggleDetails(index)}>More Details <i class="fa-solid fa-caret-down"></i></span>
                              {order?.order_status !== 'Cancelled' &&
                                item?.stitch_option === 'customFit' && (
                                  <span className="mb-0" onClick={() => handleMessrmntTogle(item)}>
                                    {item.user_measurmentDetails
                                      ? 'Measurement Chart Details'
                                      : 'Add Measurement Details'}
                                  </span>
                                )
                              }
                            </div>
                          </p>
                        </div>
                      </td>

                      <td>
                        <span className="fw-bold">
                          {order?.order_status || "N/A"}
                        </span>
                      </td>
                      
                      <td>{formatDate(order?.updated_at)}</td>
                    </tr>

                    {moreDetails[index] && (
                      <tr className="dijweoikroiwejrwer">
                        <div className="doiwenmjre d-flex">
                          <div className="col-lg-4">
                            <div><strong>Stitching Options:</strong> 
                              {item?.stitch_option === 'customFit' ? (
                                  <>
                                    Custom Fit
                                  </>
                                ) : (
                                  <>
                                    {item?.actual_stitch_option}
                                  </>
                                )}
                              {/* {item?.actual_stitch_option} */}
                            </div>

                            <div><strong>Stitching Charges:</strong>
                              { item?.custom_fit_charge !== '0' 
                                  ? item?.custom_fit_charge 
                                  : item?.stitching_charge 
                              }
                            </div>
                          </div>

                          { item?.mojri_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Mojri Price:</strong> {item?.mojri_charge}</div>

                              <div><strong>Mojri Size:</strong> {item?.mojri_size}</div>
                            </div>
                            </>
                          )}

                          { item?.stole_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Stole Price:</strong> {item?.stole_charge}</div>
                            </div>
                            </>
                          )}

                          { item?.turban_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Turbon Price:</strong> {item?.turban_charge}</div>

                              <div><strong>Turbon Size:</strong> {item?.turban_size}</div>
                            </div>
                            </>
                          )}
        
                        </div>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <p className="fw-bold fs-5">
              Total: <span>₹{order?.total_order_amount}</span>
            </p>
          </div>
        </div>
      </section>
      

      {/*messrmnt modal*/}
      
      <div onClick={handleMessrmntClose} className={`messrmnt-modal-backdrop ${orderDetailsMessurmntModal ? "" : "messrmnt-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`messrmnt-modal ${orderDetailsMessurmntModal ? "" : "messrmnt-modal-hide"} bg-white position-fixed`}>
        <div className="messrmnt-modal-header p-4">
          <h5 className="mb-0">Messurement Details for Product ID: {selectedOrderProductId}</h5>
        </div>

        <div className="djeoijojrer h-100 py-3 px-4">
          
          {orderMeasurementData !== null ? (
            <div className="row">
              <div className="col-lg-12 mb-4">
                <div className="diweuhrwer">
                  <label className="form-label">Measurement Name</label>
                  <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.measurment_name}/>
                </div>
              </div>
              <div className="col-lg-12 mb-4">
                <div className="diweuhrwer">
                  <label className="form-label">Measurement Fit</label>
                  <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.measurement_fit}/>
                </div>
              </div>

              {orderMeasurementData.product_type === 'generic' && (
                  <>
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Bust</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_around_bust}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Shoulder</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_shoulder}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Front Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_front_neck_depth}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Back Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_back_neck_depth}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Length</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_sleeve_length}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Top Length</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_top_length}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Length</label>

                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_blouse_length}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Height</label>
                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_height}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Bottom Length</label>
                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_bottom_length}/>
                      </div>
                    </div>
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Waist</label>
                        <input type="text" disabled className="form-control" placeholder="2" value={orderMeasurementData.generic_waist}/>
                      </div>
                    </div>

                  </>
              )}

              {orderMeasurementData.product_type === 'dress' && (
                <>
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Bust</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_bust_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Shoulder</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_shoulder_option}/>
                      </div>
                    </div>

                    {/* <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Front Neck Depth</label>

                        <input className="d-block" type="checkbox" checked />
                      </div>
                    </div> */}
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Arm</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_arm_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Front Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_front_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Back Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_back_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Style</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_sleeve_style_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Length</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_sleeve_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Above Waist</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_above_waist_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Hip</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_hip_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Kurta Length</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_kurta_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Kurta Closing Side</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_kurta_closing_side_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Kurta Closing With</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_kurta_closing_with_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Waist</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_waist_option}/>
                      </div>
                    </div>
                    

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Thigh</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_thigh_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Knee</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_knee_option }/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Calf</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_around_calf_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Bottom Length</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_bottom_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Bottom Style</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_bottom_style_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Bottom Closing Side</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_bottom_closing_side_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Bottom Closing With</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.dress_bottom_closing_with_options}/>
                      </div>
                    </div>


                    <div className="col-lg-12 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Additional customization request</label>
                        <textarea type="text" disabled className="form-control" placeholder="" >{orderMeasurementData.additional_customize_dress}</textarea>
                      </div>
                    </div>
                    
                </>
              )}

              {orderMeasurementData.product_type === 'saree' && (
                <>
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Bust</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_around_bust_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Above Waist</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_above_waist_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Length</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_blouse_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Shoulder</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_shoulder_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Length</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_sleeve_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Style</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_sleeve_style_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Arm</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_around_arm_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Pads</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_blouse_pads_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Front Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_front_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Back Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_back_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Closing Side</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_blouse_closing_side_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Closing With</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_blouse_closing_with_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">With Petticoat (Inskirt)</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.include_petticoat === '1'} />
                      </div>
                    </div>
                    
                    {orderMeasurementData?.include_petticoat === '1' && (
                      <>
                        <div className="col-lg-6 mb-4">
                          <div className="diweuhrwer">
                            <label className="form-label">Petticoat Waist (Inskirt)</label>
                            <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_petticoat_waist_option}/>
                          </div>
                        </div>

                        <div className="col-lg-6 mb-4">
                          <div className="diweuhrwer">
                            <label className="form-label">Petticoat Length (Inskirt)</label>

                            <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_petticoat_length_option}/>
                          </div>
                        </div>
                      </>
                    )}
                    

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Fall & Edging Work</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.saree_fall_edging === '1'} /> 
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Matching Tassels</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.saree_matching_tassles === '1'} /> 
                      </div>
                    </div>

                    <div className="col-lg-12 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Additional customization request</label>
                        <textarea type="text" disabled className="form-control" placeholder="" >{orderMeasurementData.additional_customize_saree}</textarea>
                      </div>
                    </div>
                    
                </>
              )}

              {orderMeasurementData.product_type === 'lehenga' && (
                <>
                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Bust</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_around_bust_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Above Bust</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_above_waist_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Choli Length</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_choli_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Shoulder</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_shoulder_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Length</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_sleeve_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Sleeve Style</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_sleeve_style_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Arm</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_around_arm_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Blouse Pads</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.saree_blouse_pads_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Front Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_front_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Back Neck Depth</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_back_neck_depth_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Choli Closing Side</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_choli_closing_side_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Choli Closing With</label>

                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_choli_closing_with_options}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Waist</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_around_waist_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Around Hip</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_around_hip_option}/>
                      </div>
                    </div>


                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Lehenga Length</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_length_option}/>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Lehenga Closing Side</label>
                        <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_side_closing_options}/>
                      </div>
                    </div>


                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">With Petticoat (Inskirt)</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.with_petticoat_lahenga === '1'} />
                      </div>
                    </div>
                    
                    {orderMeasurementData?.with_petticoat_lahenga === '1' && (
                      <>
                        <div className="col-lg-6 mb-4">
                          <div className="diweuhrwer">
                            <label className="form-label">Petticoat Waist (Inskirt)</label>
                            <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_petticoat_waist_option}/>
                          </div>
                        </div>

                        <div className="col-lg-6 mb-4">
                          <div className="diweuhrwer">
                            <label className="form-label">Petticoat Length (Inskirt)</label>

                            <input type="text" disabled className="form-control" placeholder="" value={orderMeasurementData.lehenga_petticoat_length_option}/>
                          </div>
                        </div>
                      </>
                    )}
                    

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Fall & Edging Work</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.fall_edging_work_lahenga === '1'} /> 
                      </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                      <div className="diweuhrwer">
                        <label className="form-label">Matching Tassels</label>

                        <input className="d-block" type="checkbox" checked={orderMeasurementData?.matching_tassles_lahenga === '1'} /> 
                      </div>
                    </div>



                    <div className="col-lg-12 mb-4" >
                      <div className="diweuhrwer">
                        <label className="form-label">Additional customization request</label>
                        <textarea type="text" disabled className="form-control" placeholder="" >{orderMeasurementData.additional_customization_lahenga}</textarea>
                      </div>
                    </div>
                    
                </>
              )}
              
            </div>
          ) : (
            <>
              <div className="idnjuigkjiwerwer">
                  <div className="mojdowemewr d-flex align-items-center">
                    <div className="vfeerwrwer me-2">
                      <label className="form-label mb-0">
                        Measurement Name*
                      </label>
                    </div>

                    <div className="qwererwerrr flex-grow-1">
                      <input
                        type="text"
                        className="form-control"
                        name="measurment_name"
                        value={formData.measurment_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                <div className="dihwemoirjwerwer mb-5 mt-3">
                  <h5 className="text-center mb-3">Select Measurement Fit</h5>

                  <div className="dowehrinwejikhriwer">
                    <div className="row align-items-center">
                      <div className="col-lg-5 doiwejrwer text-center">
                        <div className="radio-wrapper-5 justify-content-center">
                          <label htmlFor="example-5" className="forCircle">
                            <input
                              id="example-5"
                              type="radio"
                              name="measurement_fit"
                              value="Body Fit"
                              checked={
                                formData.measurement_fit === "Body Fit"
                              }
                              onChange={handleChange}
                            />

                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                              >
                                <circle
                                  data-name="ellipse"
                                  cx={8}
                                  cy={8}
                                  r={8}
                                />
                              </svg>
                            </span>
                          </label>

                          <label
                            htmlFor="example-5"
                            className="sdvwedeertweerr"
                          >
                            Body Fit
                          </label>
                        </div>

                        <p className="mb-0">
                          Garments will be tailored with 1-2 inch loosening
                        </p>
                      </div>

                      <div className="col-lg-2">
                        <span className="djknakknewrr mx-auto d-block position-relative bg-white">
                          OR
                        </span>
                      </div>

                      <div className="col-lg-5 doiwejrwer text-center">
                        <div className="radio-wrapper-5 justify-content-center">
                          <label htmlFor="example-5" className="forCircle">
                            <input
                              id="example-234"
                              type="radio"
                              name="measurement_fit"
                              value="Garment Fit"
                              checked={
                                formData.measurement_fit === "Garment Fit"
                              }
                              onChange={handleChange}
                            />

                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                              >
                                <circle
                                  data-name="ellipse"
                                  cx={8}
                                  cy={8}
                                  r={8}
                                />
                              </svg>
                            </span>
                          </label>

                          <label
                            htmlFor="example-234"
                            className="sdvwedeertweerr"
                          >
                            Garment Fit
                          </label>
                        </div>

                        <p className="mb-0">
                          Garments will be tailored exactly as per provided
                          measurements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p>Customized orders can take minimum 7 extra working days</p>
              
              <div className="dffwfsededsde idjnejwhrewrwerwer mt-4">
                <h5 className="d-flex align-items-center justify-content-between">
                  <span>
                    <i className="bi me-1 bi-arrows-expand-vertical"></i> Do
                    you want to enter your measurements?
                  </span>

                  <div className="checkbox-wrapper-5 d-flex align-items-center">
                    <span>Yes</span>

                    <div className="check ms-2">
                      <input
                        id="check-5"
                        type="checkbox"
                        onChange={(e) => setShowTabs(e.target.checked)}
                      />

                      <label for="check-5"></label>
                    </div>
                  </div>
                </h5>

                {showTabs && (
                  <div className="doiewnjkrhwerwerwer mt-3">
                    <div className="dkewnjkhriwer">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0 px-3 py-2">Measurement Form</h5>

                        <div className="dlwenoijwelkjrwer">
                          <div className="radio-wrapper-7">
                            <label
                              className="radio-wrapper-7"
                              htmlFor="unit-inch"
                            >
                              <input
                                id="unit-inch"
                                type="radio"
                                name="unit"
                                value="inch"
                                checked={unit === "inch"}
                                onChange={(e) => {
                                  setUnit(e.target.value);
                                  setFormData((prev) => ({
                                    ...prev,
                                    unit: e.target.value,
                                  }));
                                }}
                              />
                              <span>Inches</span>
                            </label>

                            <label
                              className="radio-wrapper-7"
                              htmlFor="unit-cm"
                            >
                              <input
                                id="unit-cm"
                                type="radio"
                                name="unit"
                                value="cm"
                                checked={unit === "cm"}
                                onChange={(e) => {
                                  setUnit(e.target.value);
                                  setFormData((prev) => ({
                                    ...prev,
                                    unit: e.target.value,
                                  }));
                                }}
                              />
                              <span>Cm</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {customFeildSelectOption ===
                      "lehenga" && (
                      <>
                        {/* ------------------ Choli Measurement ------------------ */}
                        <div className="asdasdaswwee mt-2">
                          <h5 className="text-center text-white py-2 mb-3">
                            Choli Measurement
                          </h5>
                          <div className="ihkjnjdewrwer">
                            <div className="row">
                              {fields.map((field, index) => {
                                const keyWithUnit =
                                  productMeasurementData?.[
                                    `${field.key}_inch`
                                  ] ||
                                  productMeasurementData?.[
                                    `${field.key}_cm`
                                  ]
                                    ? unit === "inch"
                                      ? `${field.key}_inch`
                                      : `${field.key}_cm`
                                    : field.key;

                                const options =
                                  productMeasurementData?.[
                                    keyWithUnit
                                  ]?.split(",") || [];

                                return (
                                  <div className="col-lg-6 mb-3" key={index}>
                                    <label className="form-label">
                                      {field.label}
                                    </label>

                                    {/* ✅ Added name attribute */}

                                    <select
                                      className="form-select"
                                      name={field.key}
                                      onChange={handleChangeLahenga}
                                      value={formData[field.key] || ""}
                                    >
                                      <option disabled selected>
                                        --Select Here--
                                      </option>
                                      {options.map((val, i) => (
                                        <option key={i} value={val.trim()}>
                                          {val.trim()}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* ------------------ Lehenga Measurement ------------------ */}
                        <div className="asdasdaswwee mt-2">
                          <h5 className="text-center text-white py-2 mb-3">
                            Lehenga Measurement
                          </h5>

                          <div className="row" key={`lehenga-${unit}`}>
                            {lehengaFields.map((field, index) => {
                              // Petticoat Waist toggle
                              if (
                                field.key === "lehenga_petticoat_waist_option"
                              ) {
                                return (
                                  <React.Fragment key={index}>
                                    {/* ✅ Checkbox with name */}
                                    <div className="col-12 mb-3">
                                      <label className="form-label d-flex align-items-center justify-content-center">
                                        <input
                                          type="checkbox"
                                          className="me-2"
                                          name="with_petticoat_lahenga"
                                          checked={showPetticoat}
                                          onChange={() =>
                                            setShowPetticoat(!showPetticoat)
                                          }
                                        />
                                        With Petticoat (Inskirt)
                                      </label>
                                    </div>

                                    {/* ✅ Petticoat Waist (only visible if checked) */}
                                    {showPetticoat && (
                                      <div className="col-lg-6 mb-3">
                                        <label className="form-label d-flex align-items-center justify-content-between">
                                          {field.label}
                                          
                                        </label>
                                        <select
                                          className="form-select"
                                          name={field.key}
                                          onChange={handleChangeLahenga}
                                          value={formData[field.key] || ""}
                                        >
                                          <option disabled selected>
                                            --Select Here--
                                          </option>
                                          {getOptions(field.key).map(
                                            (val, i) => (
                                              <option key={i} value={val}>
                                                {val}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    )}
                                  </React.Fragment>
                                );
                              }

                              // Hide Petticoat Length if unchecked
                              if (
                                field.key ===
                                  "lehenga_petticoat_length_option" &&
                                !showPetticoat
                              ) {
                                return null;
                              }

                              // ✅ Render all other fields with name
                              return (
                                <div className="col-lg-6 mb-3" key={index}>
                                  <label className="form-label d-flex align-items-center justify-content-between">
                                    {field.label}
                                    
                                  </label>
                                  <select
                                    className="form-select"
                                    name={field.key}
                                    onChange={handleChangeLahenga}
                                    value={formData[field.key] || ""}
                                  >
                                    <option disabled selected>
                                      --Select Here--
                                    </option>
                                    {getOptions(field.key).map((val, i) => (
                                      <option key={i} value={val}>
                                        {val}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}

                            {/* ✅ Extra options with names */}
                            <div className="col-6 mb-3">
                              <label className="form-label d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="me-2"
                                  name="fall_edging_work_lahenga"
                                  checked={!!formData.fall_edging_work_lahenga}
                                  onChange={handleChangeLahenga}
                                />
                                Fall & Edging Work
                              </label>
                            </div>

                            <div className="col-6 mb-3">
                              <label className="form-label d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="me-2"
                                  name="matching_tassles_lahenga"
                                  checked={!!formData.matching_tassles_lahenga}
                                  onChange={handleChangeLahenga}
                                />
                                Matching Tassles
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* ------------------ Additional Customization ------------------ */}
                        <div className="col-lg-12 mb-3">
                          <label className="form-label">
                            Additional customization requests here.
                          </label>
                          <textarea
                            name="additional_customization_lahenga"
                            className="form-control"
                            placeholder="Please specify any additional customization requests here."
                            onChange={handleChangeLahenga}
                            value={formData.additional_customization_lahenga || ""}
                            style={{ height: "150px" }}
                          ></textarea>
                        </div>
                      </>
                    )}

                    {customFeildSelectOption ===
                      "saree" && (
                      <>
                        {/* Lehenga Measurement */}
                        <div className="asdasdaswwee mt-2">
                          <div className="row" key={`saree-${unit}`}>
                            {sareeFields.map((field, index) => {
                              // Petticoat Waist Option (with checkbox)
                              if (
                                field.key === "saree_petticoat_waist_option"
                              ) {
                                return (
                                  <React.Fragment key={index}>
                                    {/* Checkbox */}
                                    <div className="col-12 mb-3">
                                      <label className="form-label d-flex align-items-center justify-content-center">
                                        <input
                                          type="checkbox"
                                          className="me-2"
                                          name="include_petticoat_saree"
                                          checked={showPetticoat}
                                          onChange={() => {
                                            setShowPetticoat(!showPetticoat);
                                            setFormData((prev) => ({
                                              ...prev,
                                              include_petticoat:
                                                !showPetticoat,
                                            }));
                                          }}
                                        />
                                        With Petticoat (Inskirt)
                                      </label>
                                    </div>

                                    {/* Petticoat Waist field (only if checked) */}
                                    {showPetticoat && (
                                      <div className="col-lg-6 mb-3">
                                        <label className="form-label d-flex align-items-center justify-content-between">
                                          {field.label}
                                          
                                        </label>
                                        <select
                                          className="form-select"
                                          name={field.key}
                                          onChange={handleChangeSaree}
                                          value={formData[field.key] || ""}
                                        >
                                          <option disabled value="">
                                            --Select Here--
                                          </option>
                                          {getOptions(field.key).map(
                                            (val, i) => (
                                              <option key={i} value={val}>
                                                {val}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    )}
                                  </React.Fragment>
                                );
                              }

                              // Petticoat Length — hide if Petticoat is not selected
                              if (
                                field.key ===
                                  "saree_petticoat_length_option" &&
                                !showPetticoat
                              ) {
                                return null;
                              }

                              // Render all other Saree fields
                              return (
                                <div className="col-lg-6 mb-3" key={index}>
                                  <label className="form-label d-flex align-items-center justify-content-between">
                                    {field.label}
                                    
                                  </label>
                                  <select
                                    className="form-select"
                                    name={field.key}
                                    onChange={handleChangeSaree}
                                    value={formData[field.key] || ""}
                                  >
                                    <option disabled value="">
                                      --Select Here--
                                    </option>
                                    {getOptions(field.key).map((val, i) => (
                                      <option key={i} value={val}>
                                        {val}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}

                            {/* Saree Custom Options */}
                            <div className="col-6 mb-3">
                              <label className="form-label d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="me-2"
                                  name="saree_fall_edging"
                                  checked={
                                    formData.saree_fall_edging || false
                                  }
                                  onChange={handleChangeSaree}
                                />
                                Fall & Edging Work
                              </label>
                            </div>

                            <div className="col-6 mb-3">
                              <label className="form-label d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="me-2"
                                  name="saree_matching_tassles"
                                  checked={
                                    formData.saree_matching_tassles || false
                                  }
                                  onChange={handleChangeSaree}
                                />
                                Matching Tassles
                              </label>
                            </div>
                          </div>

                          {/* Additional Customization */}
                          <div className="col-lg-12 mb-3">
                            <label className="form-label">
                              Additional customization requests here.
                            </label>
                            <textarea
                              name="additional_customize_saree"
                              className="form-control"
                              placeholder="Please specify any additional customization requests here."
                              style={{ height: "150px" }}
                              value={
                                formData.additional_customize_saree || ""
                              }
                              onChange={handleChangeSaree}
                            ></textarea>
                          </div>
                        </div>
                      </>
                    )}

                    {customFeildSelectOption ===
                      "dress" && (
                      <>
                        {/* Kurta Measurement */}
                        <div className="asdasdaswwee mt-2">
                          <h5 className="text-center text-white py-2 mb-3">
                            Kurta Measurement
                          </h5>
                          <div className="ihkjnjdewrwer">
                            <div className="row">
                              {dressFields.map((field, index) => {
                                // Detect inch/cm-based key
                                const keyWithUnit =
                                  productMeasurementData?.[
                                    `${field.key}_inch`
                                  ] ||
                                  productMeasurementData?.[
                                    `${field.key}_cm`
                                  ]
                                    ? unit === "inch"
                                      ? `${field.key}_inch`
                                      : `${field.key}_cm`
                                    : field.key;

                                const options =
                                  productMeasurementData?.[
                                    keyWithUnit
                                  ]?.split(",") || [];

                                return (
                                  <div className="col-lg-6 mb-3" key={index}>
                                    <label className="form-label d-flex align-items-center justify-content-between">
                                      {field.label}
                                      
                                    </label>

                                    <select
                                      className="form-select"
                                      name={field.key}
                                      onChange={handleChange}
                                      value={formData[field.key] || ""}
                                    >
                                      <option disabled value="">
                                        --Select Here--
                                      </option>
                                      {options.map((val, i) => (
                                        <option key={i} value={val.trim()}>
                                          {val.trim()}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Measurement */}
                        <div className="asdasdaswwee mt-2">
                          <h5 className="text-center text-white py-2 mb-3">
                            Bottom Measurement
                          </h5>
                          <div className="ihkjnjdewrwer">
                            <div className="row">
                              {bottomDressFields.map((field, index) => {
                                const keyWithUnit =
                                  productMeasurementData?.[
                                    `${field.key}_inch`
                                  ] ||
                                  productMeasurementData?.[
                                    `${field.key}_cm`
                                  ]
                                    ? unit === "inch"
                                      ? `${field.key}_inch`
                                      : `${field.key}_cm`
                                    : field.key;

                                const options =
                                  productMeasurementData?.[
                                    keyWithUnit
                                  ]?.split(",") || [];

                                return (
                                  <div className="col-lg-6 mb-3" key={index}>
                                    <label className="form-label d-flex align-items-center justify-content-between">
                                      {field.label}
                                      
                                    </label>

                                    <select
                                      className="form-select"
                                      name={field.key}
                                      onChange={handleChange}
                                      value={formData[field.key] || ""}
                                    >
                                      <option disabled value="">
                                        --Select Here--
                                      </option>
                                      {options.map((val, i) => (
                                        <option key={i} value={val.trim()}>
                                          {val.trim()}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Additional Customization */}
                        <div className="col-lg-12 mb-3">
                          <label className="form-label">
                            Additional customization requests here.
                          </label>
                          <textarea
                            name="additional_customize_dress"
                            className="form-control"
                            placeholder="Please specify any additional customization requests here."
                            style={{ height: "150px" }}
                            onChange={handleChange}
                            value={formData.additional_customize_dress || ""}
                          ></textarea>
                        </div>
                      </>
                    )}

                    {customFeildSelectOption === "generic" && (
                      <>
                        <div className="asdasdaswwee mt-2">
                          <div className="ihkjnjdewrwer">
                            <div className="row">
                              {measurementFields.map((field) => {
                                // Only show if required flag = "1"
                                const requiredFlag = data?.[`${field.key}_required`];
                                if (requiredFlag !== "1") return null;

                                return (
                                  <div className="col-lg-6 mb-3" key={field.key}>
                                    <label className="form-label d-flex align-items-center justify-content-between">
                                      <span>{field.label}</span>
                                      
                                    </label>

                                    {/* ✅ Controlled select with handleChange */}
                                    <select
                                      className="form-select"
                                      name={field.key}
                                      onChange={handleChangeGeneric}
                                      value={formData[field.key] || ""}
                                    >
                                      <option disabled value="">
                                        --Select Here--
                                      </option>
                                      {getOptionsGeneric(field.key).map((val, i) => (
                                        <option key={i} value={val.trim()}>
                                          {val.trim()}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* ✅ Additional Customization */}
                        <div className="col-lg-12 mb-3">
                          <label className="form-label">
                            Additional customization requests here.
                          </label>
                          <textarea
                            name="additional_customization"
                            className="form-control"
                            placeholder="Please specify any additional customization requests here."
                            style={{ height: "150px" }}
                            onChange={handleChangeGeneric}
                            value={formData.additional_customization || ""}
                          ></textarea>
                        </div>
                      </>
                    )}

                  </div>
                )}
              </div>

              <div className="doiewnjkrhwerwerwer d-flex align-items-center justify-content-end px-4 pt-2 pb-3">
                <button className="btn btn-main w-100" style={{ marginBottom: "65px" }}
                  onClick={() => {
                    handleSave(); // Save or prepare form data
                    // setMssrmntSbmtConfrm(true); // Open confirmation modal
                  }}>
                  Review & Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
