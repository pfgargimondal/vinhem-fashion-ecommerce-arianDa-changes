import http from "../../http";
import { Link, useLocation } from "react-router-dom";
// import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Css/Wedding.css";
import "./Css/WeddingResponsive.css";
import { useEffect, useState } from "react";
import "swiper/css"; // core styles
import "swiper/css/navigation"; // if using navigation
import "swiper/css/pagination"; // if using pagination

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";

export const Wedding = () => {
  const [WeddingDetails, setWeddingDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageMetaData, setPageMetaData] = useState([]);
                    
  const pathName = useLocation().pathname;

  useEffect(() => {
    const fetchWedding = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/fetch-wedding-page");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setWeddingDetails(getresponse.data);
        setPageMetaData(getMetaDataResponse.data.data.get_category_meta_title);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, []);

  const matchedMeta = pageMetaData.find((item) => {
      const slug = item.category_name
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
    <>
      <div className="dfgjhdfgdf">
        <div className="container-fluid">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            <SwiperSlide>
              <Link to={WeddingDetails?.data?.section1_url}>
              <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section1_image1}`)} className="img-fluid" alt="Slide 1" />
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={WeddingDetails?.data?.section1_url_2}>
              <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section1_image2}`)} className="img-fluid" alt="Slide 2" />
              </Link>
            </SwiperSlide>

            <SwiperSlide>
              <Link to={WeddingDetails?.data?.section1_url_3}>
              <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section1_image3}`)} className="img-fluid" alt="Slide 2" />
              </Link>
            </SwiperSlide>

          </Swiper>
        </div>
      </div>
      <div className="sdgdfhbgdfr">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section1to4?.section2_title}</h2>
          </div>
          <div className="fgjhdfgf row">
            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url1}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image1}`)} alt="" />
                  
                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text1}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url2}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image2}`)} alt="" />
                  
                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text2}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url3}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image3}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text3}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url4}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image4}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text4}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url5}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image5}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text5}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url6}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image6}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text6}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url7}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image7}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text7}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
              <Link to={WeddingDetails?.data?.section1to4?.section2_url8}>
                <div className="dfgdfg255 overflow-hidden position-relative">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section2_image8}`)} alt="" />

                  <div className="overlay-black position-absolute w-100 h-100">
                    <div className="dfbghf">
                      <h4>{WeddingDetails?.data?.section1to4?.section2_text8}</h4>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="sdfjksdgsdfgsdf">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section1to4?.section3_title}</h2>
          </div>
          <div className="fbghdfgdfgf">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url1}>
                  <div className="jdfkdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image1}`)} alt="" />

                    <div className="overlay-black1 position-absolute w-100 h-100">
                      <div className="dfbghf1">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section3_text1}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url2}>
                <div className="jdfkdf position-relative overflow-hidden">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image2}`)} alt="" />

                  <div className="overlay-black1 position-absolute w-100 h-100">
                    <div className="dfbghf1">
                      <h4>
                        {WeddingDetails?.data?.section1to4?.section3_text2}
                      </h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url3}>
                <div className="jdfkdf position-relative overflow-hidden">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image3}`)} alt="" />

                  <div className="overlay-black1 position-absolute w-100 h-100">
                    <div className="dfbghf1">
                      <h4>
                        {WeddingDetails?.data?.section1to4?.section3_text3}
                      </h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url4}>
                <div className="jdfkdf position-relative overflow-hidden">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image4}`)} alt="" />

                  <div className="overlay-black1 position-absolute w-100 h-100">
                    <div className="dfbghf1">
                      <h4>
                        {WeddingDetails?.data?.section1to4?.section3_text4}
                      </h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url5}>
                <div className="jdfkdf position-relative overflow-hidden">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image5}`)} alt="" />

                  <div className="overlay-black1 position-absolute w-100 h-100">
                    <div className="dfbghf1">
                      <h4>
                        {WeddingDetails?.data?.section1to4?.section3_text5}
                      </h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section3_url6}>
                <div className="jdfkdf position-relative overflow-hidden">
                  <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section3_image6}`)} alt="" />

                  <div className="overlay-black1 position-absolute w-100 h-100">
                    <div className="dfbghf1">
                      <h4>
                        {WeddingDetails?.data?.section1to4?.section3_text6}
                      </h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="dfghjhufggdfg pt-5">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section1to4?.section4_title}</h2>
          </div>
          <div className="dfbgjhdfbgdfg">
            <div className="row">

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url1}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image1}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text1}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url2}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image2}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text2}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url3}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image3}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text3}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url4}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image4}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text4}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url5}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image5}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text5}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section1to4?.section4_url6}>
                  <div className="dfbhhfgdf position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section1to4?.section4_image6}`)} alt="" />
                    
                    <div className="overlay-black2 position-absolute w-100 h-100">
                      <div className="dfbghf2">
                        <h4>
                          {WeddingDetails?.data?.section1to4?.section4_text6}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="fgnhdfjhugdfgsd">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section5to9?.section5_title}</h2>
          </div>
          <div className="fhfgdfgfdg">
            <div className="row">

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url1}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image1}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text1}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url2}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image2}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text2}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url3}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image3}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text3}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url4}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image4}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text4}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url5}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image5}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text5}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url6}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image6}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text6}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url7}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image7}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text7}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={WeddingDetails?.data?.section5to9?.section5_url8}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section5_image8}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {WeddingDetails?.data?.section5to9?.section5_text8}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fgndfjhgfgds pt-5">
        <div className="container-fluid">
          <Link to={WeddingDetails?.data?.section5to9?.section6_url}>
            <div className="dfgdfgfd">
              <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section6_image}`)} alt=""/>
              {/* <div className="sdjhds"> */}
                {/* <h4>{WeddingDetails?.data?.section5to9?.section6_text}</h4> */}
                {/* <h3>Perfect Present for any occasion</h3> */}
              {/* </div> */}
            </div>
          </Link>
        </div>
      </div>

      <div className="fgjhfbgdfjh565">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section5to9?.section7_title}</h2>
          </div>
          <div className="dbgjkdffd52" style={{
                  backgroundImage: `url(${optimizeImage(
                    `${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section7_background_image}`
                  )})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}>
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="fbghjdfgfd">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section7_url1}>
                      <div className="ffdgf548">
                        <img
                          src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section7_image1}`)}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section7_url2}>
                      <div className="ffdgf548">
                        <img
                          src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section7_image2}`)}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-12">
                <div className="fghbjkfgfg145 h-100">
                  <h2>
                    {WeddingDetails?.data?.section5to9?.section7_main_title}
                  </h2>
                  <p>{WeddingDetails?.data?.section5to9?.section7_sub_title}</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="fbghjdfgfd">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section7_url3}>
                      <div className="ffdgf548">
                        <img
                          src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section7_image3}`)}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section7_url4}>
                      <div className="ffdgf548">
                        <img
                          src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section7_image4}`)}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="fgnhdfjhugdfgsd">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section5to9?.section8_title}</h2>
          </div>
          <div className="fhfgdfgfdg">
            <div className="row">

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image1}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text1}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url1}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image2}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text2}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url2}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image3}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text3}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url3}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image4}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text4}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url4}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image5}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text5}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url5}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image6}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text6}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url6}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image7}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text7}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url7}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfbhhfgdf55 position-relative overflow-hidden">
                  <img src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section8_image8}`} alt="" />

                  <div className="overlay-black3 position-absolute w-100 h-100">
                    <div className="dfbghf3">
                      <h4>
                        {WeddingDetails?.data?.section5to9?.section8_text8}
                      </h4>
                      <Link to={WeddingDetails?.data?.section5to9?.section8_url8}>
                      <button>SHOP NOW</button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fgjhfbgdfjh565">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{WeddingDetails?.data?.section5to9?.section9_title}</h2>
          </div>
          <div className="dbgjkdffd52" style={{
                  backgroundImage: `url(${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section9_background_image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}>
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="fbghjdfgfd">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section9_url1}>
                      <div className="ffdgf548">
                        <img
                          src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section9_image1}`}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section9_url2}>
                      <div className="ffdgf548">
                        <img
                          src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section9_image2}`}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="fghbjkfgfg145 h-100">
                  <h2>
                    {WeddingDetails?.data?.section5to9?.section9_main_title}
                  </h2>
                  <p>{WeddingDetails?.data?.section5to9?.section9_sub_title}</p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="fbghjdfgfd">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section9_url3}>
                      <div className="ffdgf548">
                        <img
                          src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section9_image3}`}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                      <Link to={WeddingDetails?.data?.section5to9?.section9_url4}>
                      <div className="ffdgf548">
                        <img
                          src={`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section9_image4}`}
                          alt=""
                        />
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="fbgvdsdfd6568 py-5">
        <div className="container-fluid">
          <div className="ghbgfgdf sdfwedweeerr fsdweftherwrer">
            <div className="row align-items-center">
              <div className="col-lg-3 col-6">
                <div className="dfnghfd text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section10_image1}`)} alt={WeddingDetails?.data?.section5to9?.section10_text1} />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    {/* <h4>{WeddingDetails?.data?.section5to9?.section10_number1}</h4> */}
                  </div>

                  <div className="cfgncfgb">
                    <h4>{WeddingDetails?.data?.section5to9?.section10_text1}</h4>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6 ps-0">
                <div className="dfnghfd fsrweerrr text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section10_image2}`)} alt={WeddingDetails?.data?.section5to9?.section10_text2} />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    {/* <h4>{WeddingDetails?.data?.section5to9?.section10_number2}</h4> */}
                  </div>

                  <div className="cfgncfgb fsrweerrr">
                    <h4>{WeddingDetails?.data?.section5to9?.section10_text2}</h4>
                  </div>                  
                </div>
              </div>

              <div className="col-lg-3 col-6 ps-0">
                <div className="dfnghfd text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section10_image3}`)} alt={WeddingDetails?.data?.section5to9?.section10_text3} />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    {/* <h4>{WeddingDetails?.data?.section5to9?.section10_number3}</h4> */}
                  </div>

                  <div className="cfgncfgb">
                    <h4>{WeddingDetails?.data?.section5to9?.section10_text3}</h4>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="dfnghfd fsrweerrr text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${WeddingDetails?.image_url}/${WeddingDetails?.data?.section5to9?.section10_image4}`)} alt={WeddingDetails?.data?.section5to9?.section10_text4} />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    {/* <h4>{WeddingDetails?.data?.section5to9?.section10_number4}</h4> */}
                  </div>

                  <div className="cfgncfgb">
                    <h4>{WeddingDetails?.data?.section5to9?.section10_text4}</h4>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="doewjirhweiewrer" />
      {/* <FooterTopComponent /> */}
      <div class="yudfdfgdfbgdfgdffgfg">
        <div class="container-fluid">
          <div
            className="pt-4"
            dangerouslySetInnerHTML={{
              __html: WeddingDetails?.data?.category_content?.description
            }}
          />
        </div>
      </div>
    </>
  );
};
