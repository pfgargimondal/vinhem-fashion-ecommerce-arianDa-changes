import { Link } from "react-router-dom";
import { useEffect } from "react";

export const ShippingAddress = ({ address, onEdit, onRemove, onInvalidMobile }) => {
  // ✅ Extract mobile number
  const mobileNumber = address?.shippingNumber?.split(" ")[1] || "";
  const isInvalidMobile = !mobileNumber || !/^[6-9][0-9]{9}$/.test(mobileNumber);

  // ✅ Notify parent about invalid mobile
  useEffect(() => {
    if (onInvalidMobile) {
      onInvalidMobile(isInvalidMobile);
    }
  }, [isInvalidMobile, onInvalidMobile]);

  return (
    <>
      {/* ⚠️ Mobile warning */}
      {isInvalidMobile && (
        <div className="delojowerer py-3 px-4 d-flex align-items-center">
          <i className="bi me-3 bi-exclamation-triangle-fill"></i>
          <p className="mb-0">
            A valid mobile no is required for seamless delivery. Before delivery of this order, 
            you will get a one-time password on {address?.shippingNumber}
            <span
              className="ms-1"
              onClick={onEdit}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Edit
            </span>
          </p>
        </div>
      )}

      <div className="ojasdaskkse p-4 pb-0">
        <div className="sddgeweeeerr d-flex mb-3 align-items-center justify-content-between">
          <h5 className="mb-0">{address?.shippingName}</h5>
          <h6 className="mb-0">{address?.shippingAddressAs}</h6>
        </div>

        <label className="cdsfedere">ADDRESS:</label>
        <p className="col-lg-7 sfvsedweqqwe">
          {address?.shippingFullAddress}, {address?.shippingLandmark}<br />
          {address?.shippingCity} - {address?.shippingPinCode}, {address?.shippingState}, <br />
          {address?.shippingCountry}
        </p>

        <div className="diwehirwerwer pb-3">
          <div className="sdasfdsreewrer col-lg-5">
            <div className="row">
              <div className="col-lg-6">
                <label className="cdsfedere">CONTACT NO:</label>
                <p className="sfvsedweqqwe mb-0">{address?.shippingNumber}</p>
              </div>

              <div className="col-lg-6">
                <label className="cdsfedere">EMAIL:</label>
                <p className="sfvsedweqqwe mb-0">{address?.shippingEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fihweijrwer d-flex align-items-center justify-content-between py-3">
          <Link to="#" onClick={onEdit}>
            <i className="bi me-1 bi-pencil-square"></i> EDIT
          </Link>
          <Link to="#" onClick={onRemove}>
            <i className="bi me-1 bi-trash3"></i> REMOVE
          </Link>
        </div>
      </div>
    </>
  );
};
