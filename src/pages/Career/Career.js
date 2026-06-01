import "./Css/Career.css";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import http from "../../http";
import { useEffect, useState } from "react";
import { CareerForm } from "./FormComponent/CareerForm";
import Loader from "../../components/Loader/Loader";
import { useLocation } from "react-router-dom";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";

export const Career = () => {

  const [loading, setLoading] = useState(false);
  const [CareerDetails, setCareerDetails] = useState({});
  const [jobOpenings, setJobOpenings] = useState([]);
  const [jobAccordion, setJobAccordion] = useState("");
  const [pageMetaData, setPageMetaData] = useState([]);
                      
  const pathName = useLocation().pathname;


  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-career-content");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setCareerDetails(getresponse.data);
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
      } catch (error) {
        console.error("Error fetching career content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, []);


  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-opening-jobs");
        setJobOpenings(getresponse.data.data);
      } catch (error) {
        console.error("Error fetching career content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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


  const toggleAccordion = (id) => {
    setJobAccordion(prev => (prev === id ? "" : id));
  }

  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      <div className="container-fluid">
        <div className="aboutusbannr position-relative">
          <img src={CareerDetails?.image_url && CareerDetails?.data?.banner_image
            ? optimizeImage(`${CareerDetails.image_url}/${CareerDetails.data.banner_image}`)
            : "./image/fashion-caeer.png"} className="w-100" style={{ borderRadius: "27px", marginTop: "1rem", overflow: "hidden" }} alt="" />
          <div className="container-fluid">
            <div className="dfgnhdfjhgdf">
              <div className="row">
                <div className="col-lg-7"></div>
                <div className="col-lg-5">
                  <div className="dfbhdf">
                    {/* <h2>{CareerDetails.data?.banner_title || "Career"}</h2> */}
                    {/* <p>
                    {CareerDetails.data?.banner_description ||
                      "Celebrating style with every stitch – where trends meet timeless elegance."}
                  </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fbhjjdfjk554">
        <div className="wrapper">
          <div className="dfghdfgd">
            <div className="container-fluid px-5">
              {/* <h4>
                {CareerDetails.data?.second_section_title}
              </h4> */}
              <div className="bgdf55ff"
                dangerouslySetInnerHTML={{
                  __html:
                    CareerDetails.data?.second_section_description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                }}>
              </div>
            </div>
          </div>

          <div className="dfghdfgd">
            <div className="container-fluid px-5" style={{ marginBottom: "1rem" }}>
              <h3>
                {CareerDetails.data?.third_section_heading}
              </h3>
            </div>
          </div>

          <div className="container-fluid px-5">
            {jobOpenings.map(jobOpening => (
              <div className="saoidjieor" key={jobOpening?.id}>
                <div className="question" onClick={() => toggleAccordion(jobOpening.id)}>{jobOpening?.title} <i className={`fa-solid ${jobAccordion === jobOpening.id ? "open fa-minus" : "fa-plus"}`}></i></div>

                <div className={`answercont ${jobAccordion === jobOpening.id ? "open" : ""}`}>
                  <div className="answer">
                    <div className="bgdf55ff"
                      dangerouslySetInnerHTML={{
                        __html:
                          jobOpening?.description ||
                          "Be a part of Vinham Fashion’s inspiring creative journey and help us shape the future of global style. Explore exciting career opportunities and grow with our passionate team.",
                      }}>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sdfbjhfsdf">
        <div className="container-fluid px-5">
          <div className="fnb788f">
            <h2>{CareerDetails.data?.form_title || "Join Our Team"}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  CareerDetails.data?.form_description ||
                  "Be a part of Vinham Fashion’s inspiring creative journey and help us shape the future of global style. Explore exciting career opportunities and grow with our passionate team.",
              }}
            />
          </div>

          <CareerForm jobOpenings={jobOpenings}/>
        </div>
      </div>

      <div className="dfhfjhdfdf">
        <hr className="doewjirhweiewrer"/>
        <FooterTopComponent />
      </div>
    </div>
  );
};
