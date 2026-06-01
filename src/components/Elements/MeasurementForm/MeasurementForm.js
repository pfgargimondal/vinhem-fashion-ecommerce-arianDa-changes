import React, { useState } from "react";
import { useEffect, useRef, useMemo } from "react";
import { optimizeImage } from "../../../utils/optimizeImage";

export const MeasurementForm = ({
  productDetails,
  showSizeModal,
  setShowSizeModal,
  mssrmntSbmtConfrm,
  setMssrmntSbmtConfrm,
}) => {
  const [activeGuide, setActiveGuide] = useState(null);
  const [feildNameGuide, setFeildNameGuide] = useState(null);
  const [showTabs, setShowTabs] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const options = [
    "Apple",
    "Banana",
    "Orange",
    "Mango",
    "Pineapple",
    "Grapes",
    "Strawberry",
    "Watermelon"
  ];

  const [search, setSearch] = useState("");
     // eslint-disable-next-line
  const [showDropdown, setShowDropdown] = useState(false);
    // eslint-disable-next-line
  const [selected, setSelected] = useState("");
   // eslint-disable-next-line
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );
   // eslint-disable-next-line
  const handleSelect = (value) => {
    setSelected(value);
    setSearch(value);
    setShowDropdown(false);
  };

  // const handleSizeChange = (e) => {
  //   const newSize = e.target.value;
  //   setSelectedSize(newSize);
  // };

  const defaultFormData = {
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
    selected_size: ""
  };

  const handleGuideClick = (item, feildName) => {
    if (activeGuide === item) {
      setActiveGuide(null);
      setFeildNameGuide(null);
    } else {
      setActiveGuide(item);
      setFeildNameGuide(feildName);
    }
  };

  const handleSizeModalClose = () => {

    showTabs && setShowTabs(false);
    activeGuide && setActiveGuide(null);
    setFeildNameGuide(null);

    setSelectedSize("");
    setUnit("inch");
    setShowPetticoat(false);
    setFormData(defaultFormData);
    setShowSizeModal(false);

  };

  const [unit, setUnit] = useState("inch");
  const [showPetticoat, setShowPetticoat] = useState(false);
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

  const data = productDetails?.data?.mesurament_form_data;

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

  // Helper: get options based on unit
  const getOptions = (key) => {
    const keyWithUnit = key.endsWith("_options") ? key : `${key}_${unit}`;
    const dataKey =
      productDetails?.data?.mesurament_form_data?.[`${key}_${unit}`] ||
      productDetails?.data?.mesurament_form_data?.[keyWithUnit];

    return dataKey ? dataKey.split(",").map((v) => v.trim()) : [];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // eslint-disable-next-line
  const handleChangeLahenga = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   // eslint-disable-next-line
  const handleChangeSaree = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
    // eslint-disable-next-line
  const handleChangeGeneric = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    setFormData((prev) => ({
      ...prev,
      selected_size: e.target.value,
    }));
  };
  const handleSave = () => {
    localStorage.setItem("measurementFormData", JSON.stringify(formData));

    // console.log(JSON.stringify(formData));
    // alert("Measurement data saved. Please confirm on product page.");
  };


  const SearchableSelect = ({
    name,
    value,
    options = [],
    onChange,
    placeholder = "--Select Here--",
    activeDropdown,
    setActiveDropdown
  }) => {
    const [search, setSearch] = useState("");
    const ref = useRef();

    const isOpen = activeDropdown === name;

    const filteredOptions = useMemo(() => {
      return options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
      );
    }, [search, options]);

    // ✅ Close on outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        // ✅ check if click is inside ANY dropdown
        if (e.target.closest(".searchable-dropdownnfbgfg")) {
          return;
        }

        // ❌ only close if clicked fully outside
        setActiveDropdown(null);
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setActiveDropdown]);

    return (
      <div ref={ref} className="searchable-dropdownnfbgfg position-relative">
        <input
          type="text"
          className={`form-control ${isOpen ? "active-input" : ""}`}
          placeholder={placeholder}
          value={value || search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveDropdown(name); // ✅ open current
          }}
          onFocus={() => setActiveDropdown(name)} // ✅ open current
        />

        {isOpen && (
          <ul className="dropdown-list xdvdbdrsaegsf">
            <li
              className="default-option"
              onClick={() => {
                onChange({
                  target: {
                    name,
                    value: "",
                    type: "select-one"
                  }
                });

                setSearch("");
                setActiveDropdown(null);
              }}
            >
              {placeholder}
            </li>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, i) => (
                <li
                  key={i}
                  onClick={() => {
                    onChange({
                      target: {
                        name,
                        value: item,
                        type: "select-one"
                      }
                    });

                    setSearch(item);
                    setActiveDropdown(null); // ✅ close after select
                  }}
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="no-result">No result found</li>
            )}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      {showSizeModal && (
        <div className="customize-modal-backdrop position-fixed w-100 h-100"></div>
      )}      

      {activeGuide && (
        <div>
          <div className="dagdfthdereer-res-backd d-block d-lg-none d-md-none position-fixed top-0 start-0 end-0 bottom-0"></div>
      
          <div className="dagdfthdereer-res start-50 top-50 translate-middle">
            <div className="doienkwjrewewr p-5 pt-2">
              <span
                className="bck-form"
                onClick={() => setActiveGuide(null)}
              >
                <i className="fa-solid me-1 fa-arrow-left-long"></i> Back To
                The Form
              </span>

              <div className="dewnrkhwerwe">
                <div className="text-center mb-3">
                  <img
                    src={
                      optimizeImage(
                        productDetails?.data?.mesurament_form_data?.[
                          `${feildNameGuide}_options_photo`
                        ] || "/images/default-guide.jpg"
                      )
                    }
                    className="img-fluid"
                    alt={activeGuide}
                  />
                </div>
                <p className="mb-0">
                  {productDetails?.data?.mesurament_form_data?.[
                    `${feildNameGuide}_options_description`
                  ] || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSizeModal && (
        <div
          className={
            activeGuide
              ? "customize-modal customize-modal-msrmnt-img-expand overflow-hidden position-fixed bg-white"
              : "customize-modal overflow-hidden position-fixed bg-white"
          }
        >
          <div className="okdjeiwirwejrwerwer size-guide-modal-header d-flex align-items-center justify-content-between px-4 py-3">
            <h4>Customize Options</h4>

            <i
              className="bi position-absolute bi-x"
              id="co-close-btn"
              onClick={handleSizeModalClose}
            ></i>
          </div>

          <div className="row gx-0">
            <div className={activeGuide ? "col-lg-6" : "col-lg-12"}>
              <div className="dhwekrwerwer px-4 py-4">
                {/* <p className="mb-3">For further assistance, Chat with us <button className="btn btn-main"><i className="bi me-1 bi-whatsapp"></i> Chat With Us</button></p> */}
                {/* <form  onSubmit={handleSave}> */}
                <div className="idnjuigkjiwerwer">
                  <div className="ojaskmduihiwerwer mb-4 pb-2">
                    <div className="ihjnugherewr">
                      <img
                        src={
                          optimizeImage(productDetails?.data?.product_image?.encoded_image_url_1)
                        }
                        alt=""
                      />
                    </div>

                    <p className="text-center">
                      {productDetails?.data?.product_name} -{" "}
                      {productDetails?.data?.PID}
                    </p>

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
                  </div>

                  <div className="dihwemoirjwerwer mb-5">
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

                {productDetails?.data?.stitching_option === 'Ready To Wear' && (
                  <>
                    <p className="mb-3">Choose a size to be customized:</p>

                    <div className="okemlkwnjrirwer mb-3 d-flex align-items-center">
                      
                      {(() => {
                        const sizeOrder = [
                          "Free Size",
                          "XXS",
                          "XS",
                          "S",
                          "M",
                          "L",
                          "XL",
                          "2XL",
                          "3XL",
                          "4XL",
                          "5XL",
                          "6XL",
                          "7XL",
                          "8XL",
                          "9XL",
                          "10XL",
                        ];

                        // Collect all sizes
                        const allSizes =
                          productDetails?.data?.product_allSize?.flatMap((item) => {
                            const sizes = [];

                            if (item.filter_size) {
                              sizes.push({
                                label: item.filter_size,
                                value: item.filter_size,
                                price: item.selling_price,
                              });
                            }

                            if (item.plus_sizes && item.plus_sizes !== "0") {
                              sizes.push({
                                label: item.plus_sizes,
                                value: item.plus_sizes,
                                price: item.plus_sizes_charges,
                              });
                            }

                            return sizes;
                          }) || [];

                        // Remove duplicate sizes
                        const uniqueSizes = allSizes.filter(
                          (size, index, arr) =>
                            index === arr.findIndex((s) => s.value === size.value)
                        );

                        // Sort sizes
                        const sortedSizes = uniqueSizes.sort((a, b) => {
                          const prefixA = a.value.split("-")[0];
                          const prefixB = b.value.split("-")[0];

                          return (
                            sizeOrder.indexOf(prefixA) - sizeOrder.indexOf(prefixB)
                          );
                        });

                        return sortedSizes.map((sizeObj, index) => (
                          <div
                            className="doeiwjrkweirwe me-2 mb-2"
                            key={index}
                          >
                            <input
                              id={`size-${index}`}
                              name="selected_size"
                              type="radio"
                              value={sizeObj.value}
                              checked={selectedSize === sizeObj.value}
                              onChange={handleSizeChange}
                              className="d-none position-absolute"
                            />

                            <label
                              htmlFor={`size-${index}`}
                              className={`text-center p-2 border rounded ${
                                selectedSize === sizeObj.value
                                  ? "bg-dark text-white"
                                  : ""
                              }`}
                              style={{ minWidth: "70px", cursor: "pointer" }}
                            >
                              <span className="d-block mb-1">
                                ₹{parseFloat(sizeObj.price || 0).toFixed(2)}
                              </span>

                              <small>{sizeObj.label}</small>
                            </label>
                          </div>
                        ));
                      })()}
                    </div>
                  </>
                )}

                <p>Customized orders can take minimum 7 extra working days</p>

                <div className="idjnejwhrewrwerwer mt-4">
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

                        {productDetails?.data?.custom_feild_selectOption ===
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
                                      productDetails?.data
                                        ?.mesurament_form_data?.[
                                        `${field.key}_inch`
                                      ] ||
                                      productDetails?.data
                                        ?.mesurament_form_data?.[
                                        `${field.key}_cm`
                                      ]
                                        ? unit === "inch"
                                          ? `${field.key}_inch`
                                          : `${field.key}_cm`
                                        : field.key;
                                       // eslint-disable-next-line
                                    const options =
                                      productDetails?.data?.mesurament_form_data?.[
                                        keyWithUnit
                                      ]?.split(",") || [];

                                    return (
                                      <div className="col-lg-6 mb-3" key={index}>
                                        <label className="form-label">
                                          {field.label}
                                          <span
                                            className="enqury-guide"
                                            onClick={() =>
                                              handleGuideClick(
                                                field.guide,
                                                field.image
                                              )
                                            }
                                          >
                                            <i className="fa-solid fa-info"></i>
                                          </span>
                                        </label>

                                        {/* ✅ Added name attribute */}

                                        {/* <select
                                          className="form-select"
                                          name={field.key}
                                          onChange={handleChangeLahenga}
                                          value={formData[field.key] || ""}
                                        >
                                          <option value={""} selected>
                                            --Select Here--
                                          </option>
                                          {options.map((val, i) => (
                                            <option key={i} value={val.trim()}>
                                              {val.trim()}
                                            </option>
                                          ))}
                                        </select> */}
                                        <SearchableSelect
                                            name={field.key}
                                            value={formData[field.key]}
                                            options={getOptions(field.key)}
                                            // onChange={handleChangeLahenga}
                                            onChange={handleChange}
                                            activeDropdown={activeDropdown}
                                           setActiveDropdown={setActiveDropdown}
                                        />
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
                                              <span
                                                className="enqury-guide"
                                                onClick={() =>
                                                  handleGuideClick(
                                                    field.guide,
                                                    field.image
                                                  )
                                                }
                                              >
                                                <i className="fa-solid fa-info"></i>
                                              </span>
                                            </label>
                                            {/* <select
                                              className="form-select"
                                              name={field.key}
                                              onChange={handleChangeLahenga}
                                              value={formData[field.key] || ""}
                                            >
                                              <option value={""} selected>
                                                --Select Here--
                                              </option>
                                              {getOptions(field.key).map(
                                                (val, i) => (
                                                  <option key={i} value={val}>
                                                    {val}
                                                  </option>
                                                )
                                              )}
                                            </select> */}
                                            <SearchableSelect
                                                name={field.key}
                                                value={formData[field.key]}
                                                options={getOptions(field.key)}
                                                // onChange={handleChangeLahenga}
                                                onChange={handleChange}
                                                activeDropdown={activeDropdown}
                                                setActiveDropdown={setActiveDropdown}
                                            />
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
                                        <span
                                          className="enqury-guide"
                                          onClick={() =>
                                            handleGuideClick(
                                              field.guide,
                                              field.image
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-info"></i>
                                        </span>
                                      </label>
                                      {/* <select
                                        className="form-select"
                                        name={field.key}
                                        onChange={handleChangeLahenga}
                                        value={formData[field.key] || ""}
                                      >
                                        <option value={""} selected>
                                          --Select Here--
                                        </option>
                                        {getOptions(field.key).map((val, i) => (
                                          <option key={i} value={val}>
                                            {val}
                                          </option>
                                        ))}
                                      </select> */}
                                      <SearchableSelect
                                          name={field.key}
                                          value={formData[field.key]}
                                          options={getOptions(field.key)}
                                          // onChange={handleChangeLahenga}
                                          onChange={handleChange}
                                          activeDropdown={activeDropdown}
                                          setActiveDropdown={setActiveDropdown}
                                      />
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
                                      // onChange={handleChangeLahenga}
                                      onChange={handleChange}
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
                                      // onChange={handleChangeLahenga}
                                      onChange={handleChange}
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
                                // onChange={handleChangeLahenga}
                                onChange={handleChange}
                                value={formData.additional_customization_lahenga || ""}
                                style={{ height: "150px" }}
                              ></textarea>
                            </div>
                          </>
                        )}

                      {productDetails?.data?.custom_feild_selectOption === "saree" && (
                        <>
                          <div className="asdasdaswwee mt-2">
                            <div className="row" key={`saree-${unit}`}>
                              {sareeFields.map((field, index) => {

                                // ✅ Petticoat Checkbox + Field
                                if (field.key === "saree_petticoat_waist_option") {
                                  return (
                                    <React.Fragment key={index}>
                                      
                                      {/* Checkbox */}
                                      <div className="col-12 mb-3">
                                        <label className="form-label d-flex align-items-center justify-content-center">
                                          <input
                                            type="checkbox"
                                            className="me-2"
                                            checked={showPetticoat}
                                            onChange={() => {
                                              setShowPetticoat(!showPetticoat);
                                              setFormData(prev => ({
                                                ...prev,
                                                include_petticoat: !showPetticoat
                                              }));
                                            }}
                                          />
                                          With Petticoat (Inskirt)
                                        </label>
                                      </div>

                                      {/* Petticoat Waist */}
                                      {showPetticoat && (
                                        <div className="col-lg-6 mb-3">
                                          <label className="form-label d-flex align-items-center justify-content-between">
                                            {field.label}
                                            <span
                                              className="enqury-guide"
                                              onClick={() =>
                                                handleGuideClick(field.guide, field.image)
                                              }
                                            >
                                              <i className="fa-solid fa-info"></i>
                                            </span>
                                          </label>

                                          <SearchableSelect
                                            name={field.key}
                                            value={formData[field.key]}
                                            options={getOptions(field.key)}
                                            // onChange={handleChangeSaree}
                                            onChange={handleChange}
                                            activeDropdown={activeDropdown}
                                            setActiveDropdown={setActiveDropdown}
                                          />
                                        </div>
                                      )}
                                    </React.Fragment>
                                  );
                                }
                                if (
                                  field.key === "saree_petticoat_length_option" &&
                                  !showPetticoat
                                ) {
                                  return null;
                                }

                                // ✅ Normal Fields
                                return (
                                  <div className="col-lg-6 mb-3" key={index}>
                                    <label className="form-label d-flex align-items-center justify-content-between">
                                      {field.label}
                                      <span
                                        className="enqury-guide"
                                        onClick={() =>
                                          handleGuideClick(field.guide, field.image)
                                        }
                                      >
                                        <i className="fa-solid fa-info"></i>
                                      </span>
                                    </label>

                                    <SearchableSelect
                                      name={field.key}
                                      value={formData[field.key]}
                                      options={getOptions(field.key)}
                                      // onChange={handleChangeSaree}
                                      onChange={handleChange}
                                      activeDropdown={activeDropdown}
                                      setActiveDropdown={setActiveDropdown}
                                    />
                                  </div>
                                );
                              })}

                              {/* ✅ Custom Checkboxes */}
                              <div className="col-6 mb-3">
                                <label className="form-label d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    className="me-2"
                                    name="saree_fall_edging"
                                    checked={formData.saree_fall_edging || false}
                                    onChange={(e) =>
                                      setFormData(prev => ({
                                        ...prev,
                                        saree_fall_edging: e.target.checked
                                      }))
                                    }
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
                                    checked={formData.saree_matching_tassles || false}
                                    onChange={(e) =>
                                      setFormData(prev => ({
                                        ...prev,
                                        saree_matching_tassles: e.target.checked
                                      }))
                                    }
                                  />
                                  Matching Tassles
                                </label>
                              </div>
                            </div>

                            {/* ✅ Additional Customization */}
                            <div className="col-lg-12 mb-3">
                              <label className="form-label">
                                Additional customization requests here.
                              </label>
                              <textarea
                                name="additional_customize_saree"
                                className="form-control"
                                style={{ height: "150px" }}
                                value={formData.additional_customize_saree || ""}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    additional_customize_saree: e.target.value
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {productDetails?.data?.custom_feild_selectOption ===
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
                                    productDetails?.data
                                      ?.mesurament_form_data?.[
                                      `${field.key}_inch`
                                    ] ||
                                    productDetails?.data
                                      ?.mesurament_form_data?.[
                                      `${field.key}_cm`
                                    ]
                                      ? unit === "inch"
                                        ? `${field.key}_inch`
                                        : `${field.key}_cm`
                                      : field.key;
                                     // eslint-disable-next-line
                                  const options =
                                    productDetails?.data?.mesurament_form_data?.[
                                      keyWithUnit
                                    ]?.split(",") || [];

                                  return (
                                    <div className="col-lg-6 mb-3" key={index}>
                                      <label className="form-label d-flex align-items-center justify-content-between">
                                        {field.label}
                                        <span
                                          className="enqury-guide"
                                          onClick={() =>
                                            handleGuideClick(
                                              field.guide,
                                              field.image
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-info"></i>
                                        </span>
                                      </label>

                                      {/* <select
                                        className="form-select"
                                        name={field.key}
                                        onChange={handleChange}
                                        value={formData[field.key] || ""}
                                      >
                                        <option selected value="">
                                          --Select Here--
                                        </option>
                                        {options.map((val, i) => (
                                          <option key={i} value={val.trim()}>
                                            {val.trim()}
                                          </option>
                                        ))}
                                      </select> */}
                                      <SearchableSelect
                                        name={field.key}
                                        value={formData[field.key]}
                                        options={getOptions(field.key)}
                                        // onChange={handleChangeSaree}
                                        onChange={handleChange}
                                        activeDropdown={activeDropdown}
                                        setActiveDropdown={setActiveDropdown}
                                      />
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
                                    productDetails?.data
                                      ?.mesurament_form_data?.[
                                      `${field.key}_inch`
                                    ] ||
                                    productDetails?.data
                                      ?.mesurament_form_data?.[
                                      `${field.key}_cm`
                                    ]
                                      ? unit === "inch"
                                        ? `${field.key}_inch`
                                        : `${field.key}_cm`
                                      : field.key;
                                     // eslint-disable-next-line
                                  const options =
                                    productDetails?.data?.mesurament_form_data?.[
                                      keyWithUnit
                                    ]?.split(",") || [];

                                  return (
                                    <div className="col-lg-6 mb-3" key={index}>
                                      <label className="form-label d-flex align-items-center justify-content-between">
                                        {field.label}
                                        <span
                                          className="enqury-guide"
                                          onClick={() =>
                                            handleGuideClick(
                                              field.guide,
                                              field.image
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-info"></i>
                                        </span>
                                      </label>

                                      {/* <select
                                        className="form-select"
                                        name={field.key}
                                        onChange={handleChange}
                                        value={formData[field.key] || ""}
                                      >
                                        <option selected value="">
                                          --Select Here--
                                        </option>
                                        {options.map((val, i) => (
                                          <option key={i} value={val.trim()}>
                                            {val.trim()}
                                          </option>
                                        ))}
                                      </select> */}
                                      <SearchableSelect
                                        name={field.key}
                                        value={formData[field.key]}
                                        options={getOptions(field.key)}
                                        // onChange={handleChangeSaree}
                                        onChange={handleChange}
                                        activeDropdown={activeDropdown}
                                        setActiveDropdown={setActiveDropdown}
                                      />
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

                      {productDetails?.data?.custom_feild_selectOption === "generic" && (
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
                                        <span
                                          className="enqury-guide ms-2"
                                          onClick={() =>
                                            handleGuideClick(
                                              data?.[`${field.key}_description`],
                                              data?.[`${field.key}_photo`]
                                            )
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <i className="fa-solid fa-info"></i>
                                        </span>
                                      </label>

                                      {/* ✅ Controlled select with handleChange */}
                                      {/* <select
                                        className="form-select"
                                        name={field.key}
                                        onChange={handleChangeGeneric}
                                        value={formData[field.key] || ""}
                                      >
                                        <option selected value="">
                                          --Select Here--
                                        </option>
                                        {getOptionsGeneric(field.key).map((val, i) => (
                                          <option key={i} value={val.trim()}>
                                            {val.trim()}
                                          </option>
                                        ))}
                                      </select> */}
                                      <SearchableSelect
                                        name={field.key}
                                        value={formData[field.key]}
                                        options={getOptionsGeneric(field.key)}
                                        // onChange={handleChangeSaree}
                                        onChange={handleChange}
                                        activeDropdown={activeDropdown}
                                       setActiveDropdown={setActiveDropdown}
                                      />
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
                              // onChange={handleChangeGeneric}
                              onChange={handleChange}
                              value={formData.additional_customization || ""}
                            ></textarea>
                          </div>
                        </>
                      )}

                    </div>
                  )}
                </div>
                {/* </form> */}
              </div>
            </div>

            {activeGuide && (
              <div className="col-lg-6 cgbhdbhdfshfghxcfg d-none d-lg-block d-md-block">
                <div className="doienkwjrewewr p-5 pt-2">
                  <span
                    className="bck-form"
                    onClick={() => setActiveGuide(null)}
                  >
                    <i className="fa-solid me-1 fa-arrow-left-long"></i> Back To
                    The Form
                  </span>

                  <div className="dewnrkhwerwe">
                    <div className="text-center mb-3">
                      <img
                        src={
                          optimizeImage(
                          productDetails?.data?.mesurament_form_data?.[
                            `${feildNameGuide}_options_photo`
                          ] || "/images/default-guide.jpg"
                          )
                        }
                        className="img-fluid"
                        alt={activeGuide}
                      />
                    </div>
                    <p className="mb-0">
                      {productDetails?.data?.mesurament_form_data?.[
                        `${feildNameGuide}_options_description`
                      ] || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="doiewnjkrhwerwerwer d-flex align-items-center justify-content-end px-4 pt-2 pb-3">
            <button
              onClick={() => {
                handleSave(); // Save or prepare form data
                setMssrmntSbmtConfrm(true); // Open confirmation modal
              }}
              className="btn btn-main w-100"
            >
              Review & Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
