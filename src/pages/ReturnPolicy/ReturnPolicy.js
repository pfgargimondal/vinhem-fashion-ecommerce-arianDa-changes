import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import Loader from "../../components/Loader/Loader";
import { useLocation } from "react-router-dom";
import { useMetaData } from "../../hooks/useMetaData";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
export const ReturnPolicy = () => {

    const [loading, setLoading] = useState(false);
    const [ReturnPolicyDetails, setReturnPolicyDetails] = useState({});
    const [pageMetaData, setPageMetaData] = useState([]);
            
    const pathName = useLocation().pathname;

    useEffect(() => {
        const fetchReturnPolicyData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-return-policy-content");
                const getMetaDataResponse = await http.get("/get-all-page-meta-title");
                setReturnPolicyDetails(getresponse.data);
                setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchReturnPolicyData();
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
       <PolicyComponent PolicyDetails={ReturnPolicyDetails}/>

      <hr className="doewjirhweiewrer"/>

      <FooterTopComponent/>
      
    </div>
  );
};
