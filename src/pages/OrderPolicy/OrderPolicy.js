import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import Loader from "../../components/Loader/Loader";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const OrderPolicy = () => {

    const [OrderPolicyDetails, setOrderPolicyDetails] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchOrderPolicyData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-order-policy-content");
                setOrderPolicyDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchOrderPolicyData();
    }, []);

    if (loading) {
        return <Loader />;
    }
    
  return (
    <div>
        <PolicyComponent PolicyDetails={OrderPolicyDetails}/>
      <hr className="doewjirhweiewrer"/>

      <FooterTopComponent/>
    </div>
  )
}
