import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import Loader from "../../components/Loader/Loader";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const PaymentOptions = () => {

    const [loading, setLoading] = useState(false);
    const [paymentOptionDetails, setPaymentOptionDetails] = useState({});

    useEffect(() => {
        const fetchPaymentOptionData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-payment-options-content");
                setPaymentOptionDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchPaymentOptionData();
    }, []);

    if (loading) {
        return <Loader />;
    }

  return (
    <div>
        <PolicyComponent PolicyDetails={paymentOptionDetails}/>
        <hr className="doewjirhweiewrer"/>
       <FooterTopComponent/>
    </div>
  );
};
