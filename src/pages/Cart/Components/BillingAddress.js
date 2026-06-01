import { Link } from "react-router-dom";

export const BillingAddress = ({ data, onEdit, onRemove }) => (

    <div className="ojasdaskkse p-4 pb-0">
        <div className="sddgeweeeerr d-flex mb-3 align-items-center justify-content-between">
            <h5 className="mb-0">{data?.shippingName}</h5>

            <h6 className="mb-0">{data?.shippingAddressAs}</h6>
        </div>

        <label className="cdsfedere">ADDRESS:</label>

        <p className="col-lg-7 sfvsedweqqwe">
            {data?.shippingFullAddress}, {data?.shippingLandmark} <br />
            {data?.shippingCity} - {data?.shippingPinCode}, {data?.shippingState}, <br /> {data?.shippingCountry}
        </p>

        <div className="diwehirwerwer pb-3">
            <div className="sdasfdsreewrer col-lg-5"> 
            <div className="row">
                <div className="col-lg-6">
                <label className="cdsfedere">CONTACT NO:</label>

                <p className="sfvsedweqqwe mb-0">{data?.shippingNumber}</p>
                </div>

                <div className="col-lg-6">
                <label className="cdsfedere">EMAIL:</label>

                <p className="sfvsedweqqwe mb-0">{data?.shippingEmail}</p>
                </div>
            </div>
            </div>
        </div>

        <div className="fihweijrwer d-flex align-items-center justify-content-between py-3">
            <Link onClick={onEdit}>
                <i className="bi me-1 bi-pencil-square"></i> EDIT
            </Link>
            <Link onClick={onRemove}>
                <i className="bi me-1 bi-trash3"></i> REMOVE
            </Link>
        </div>
    </div>
);
