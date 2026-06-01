import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { useLocation } from "react-router-dom";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const ShippingPolicy = () =>{
    const [loading, setLoading] = useState(false);
    const [ShippingPolicyDetails, setShippingPolicyDetails] = useState({});
    const [pageMetaData, setPageMetaData] = useState([]);
                
    const pathName = useLocation().pathname;
    
    useEffect(() => {
        const fetchShippingPolicyData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-shipping-policy-content");
                const getMetaDataResponse = await http.get("/get-all-page-meta-title");
                setShippingPolicyDetails(getresponse.data);
                setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchShippingPolicyData();
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

    if (loading) {
        return <Loader />;
    }

  return (
    <div>
        <PolicyComponent PolicyDetails={ShippingPolicyDetails}/>
            <hr className="doewjirhweiewrer"/>
      
        <FooterTopComponent />
    </div>
  )
}
