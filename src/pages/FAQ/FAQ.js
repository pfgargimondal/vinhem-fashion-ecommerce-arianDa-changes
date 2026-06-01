import "./Css/FAQ.css";
import http from "../../http";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { useLocation } from "react-router-dom";
import { optimizeImage } from "../../utils/optimizeImage";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const FAQ = () => {

  const [FAQDetails, setFAQDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageMetaData, setPageMetaData] = useState([]);
                              
  const pathName = useLocation().pathname;

  useEffect(() => {
    const fetchFAQData = async () => {
       setLoading(true);
      try {
        const getresponse = await http.get("/faq");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        const all_response = getresponse.data;

        setFAQDetails(all_response);         
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);         

      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchFAQData();
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
      {/* Banner Section */}
      <div className="fgyfgfd5215g">
        <div className="container-fluid">
          <div className="aboutusbannr55">
            <img src={FAQDetails.data?.banner_image
                ? optimizeImage(`${FAQDetails.image_url}/${FAQDetails.data.banner_image}`)
                : "none"} className="w-100" style={{borderRadius: "27px", marginTop: "1rem", overflow: "hidden"}} alt="" />
            <div className="dfgnhdfjhgdf">
              <div className="row">
                <div className="col-lg-7"></div>
                <div className="col-lg-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="fjgnfg55d px-5">
        <div className="wrapper">
          <div className="container-fluid">
            <h1 className="mb-4">
              {FAQDetails.data?.title &&
                FAQDetails.data.title}
            </h1>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  FAQDetails.data?.description &&
                  FAQDetails.data.description,
              }}
          />
          </div>
        </div>
      </div>

      <hr className="doewjirhweiewrer"/>
      <FooterTopComponent />
    </div>
  );
};
