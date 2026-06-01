import http from "../../http";
import { Link, useLocation } from "react-router-dom";
// import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import "swiper/css"; // core styles
import "swiper/css/navigation"; // if using navigation
import "swiper/css/pagination"; // if using pagination

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "./OnSale.css";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";

export const OnSale = () => {

 const [OnSaleDetails, setOnSaleDetails] = useState({});
 const [loading, setLoading] = useState(true);
 const [pageMetaData, setPageMetaData] = useState([]);
                   
const pathName = useLocation().pathname;

    useEffect(() => {
        const fetchOnSale = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/fetch-onsale-page");
                const getMetaDataResponse = await http.get("/get-all-page-meta-title");
                setOnSaleDetails(getresponse.data);
                setPageMetaData(getMetaDataResponse.data.data.get_category_meta_title);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                setLoading(false);
            }
        };

        fetchOnSale();
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
    <div>
      <div className="dfgjhdfgdf container-fluid">
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
            <Link to={OnSaleDetails?.data?.banner_url1}>
            <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.banner_image1}`)} className="img-fluid" alt="Slide 1" />
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to={OnSaleDetails?.data?.banner_url2}>
            <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.banner_image2}`)} className="img-fluid" alt="Slide 2" />
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to={OnSaleDetails?.data?.banner_url3}>
            <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.banner_image3}`)} className="img-fluid" alt="Slide 2" />
            </Link>
          </SwiperSlide>

        </Swiper>
      </div>

      <div className="dfgnhidfjugd">
        <div className="container-fluid">
          <div className="dfjvdgd">
             <h2>{OnSaleDetails?.data?.section2_title}</h2>
          </div>
          <div className="dffgydfdf mt-4">
            <div className="row">

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url1}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image1}`)} alt="" />

                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text1}</h4>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url2}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image2}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text2}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url2}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url3}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image3}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text3}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url3}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url4}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image4}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text4}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url4}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url5}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image5}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text5}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url5}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url6}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image6}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text6}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url6}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url7}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image7}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text7}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url7}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url8}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image8}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text8}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url8}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url9}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image9}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text9}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url9}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url10}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image10}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text10}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url10}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url11}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image11}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text11}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url11}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section2_url12}>
                <div className="fhgdfg position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section2_image12}`)} alt="" />
                  
                  <div className="overlay-sales position-absolute w-100 h-100">
                    <div className="cvbjhdfdf">
                      <h4 className="mb-0">{OnSaleDetails?.data?.section2_text12}</h4>
                      {/* <Link to={OnSaleDetails?.data?.section2_url12}> */}
                        <button>SHOP NOW</button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
                </Link>
              </div> 
            </div>
          </div>
        </div>
      </div>

      <div className="fkvbhjhdfgdfg pt-5">
        <div className="container-fluid">
          <div className="dfjvdgd">
            <h2>{OnSaleDetails?.data?.section3_title}</h2>
          </div>
          <div className="fghdfg mt-4">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url1}></Link>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image1}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text1} 
                    </h5>
                  </div> */}
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url2}>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image2}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text2} 
                    </h5>
                  </div> */}
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url3}>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image3}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text3} 
                    </h5>
                  </div> */}
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url4}>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image4}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text4} 
                    </h5>
                  </div> */}
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url5}>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image5}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text5} 
                    </h5>
                  </div> */}
                </div>
                </Link>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                <Link to={OnSaleDetails?.data?.section3_url6}>
                <div className="dfgfdg7853 position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section3_image6}`)} alt="" />

                  {/* <div className="hdfbjh554 position-absolute w-100">
                    <h5>STYLIES UNDER</h5>
                    <h5>
                      <i className="fa-solid fa-indian-rupee-sign"></i>{OnSaleDetails?.data?.section3_text6} 
                    </h5>
                  </div> */}
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sdhfdfgdf pt-5">
        <div className="container-fluid">
          <div className="dfjvdgd">
            <h2>{OnSaleDetails?.data?.section4_title}</h2>
          </div>
            <Link to={OnSaleDetails?.data?.section4_url}>
          <div className="dfngjhfdgdf">
            <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section4_image}`)}  alt="onsale"/>
          </div>
          </Link>   
        </div>
      </div>

      <div className="fjsdjhfsdf55">
        <div className="container-fluid">
          <div className="dfjvdgd">
            <h2>{OnSaleDetails?.data?.section5_title}</h2>
          </div>

          <div className="dfgjhdfgdfgf dfgswfdge mt-4">
              <Link to={OnSaleDetails?.data?.section5_url1}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image1}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title1}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                  
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url2}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image2}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title2}</h5>
                        <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url3}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image3}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title3}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url4}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image4}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title4}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url5}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image5}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title5}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url6}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image6}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title6}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url7}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image7}`)} alt="" />
                  
                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title7}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url8}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image8}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title8}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url9}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image9}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title9}</h5>
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to={OnSaleDetails?.data?.section5_url10}>
                <div className="dfbdff position-relative overflow-hidden">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section5_image10}`)} alt="" />

                  <div className="overlay-sale position-absolute w-100 h-100">
                    <div className="fdbdfgdf">
                      {/* <h6>Up to 50% off</h6> */}
                    </div>
                    <div className="bsdfhsdfsdf">
                      <h5>{OnSaleDetails?.data?.section5_discount_title10}</h5>
                      
                      <button>SHOP NOW</button>
                    </div>
                  </div>
                </div>
              </Link>
            
          </div>
        </div>
      </div>

      <div className="sdhfdfgdf pt-5">
        <div className="container-fluid">
          <div className="dfjvdgd">
            <h2>{OnSaleDetails?.data?.section6_title}</h2>
          </div>

          <div className="dfngjhfdgdf sdcvewfaasd">
            <div className="row">
              <div className="col-lg-4">
                <Link to={OnSaleDetails?.data?.section6_url1}>
                <div className="donhweirwer_inner">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section6_image1}`)} className="img-fluid" alt="onsale" />
                </div>
                </Link>
              </div>

              <div className="col-lg-4">
                <Link to={OnSaleDetails?.data?.section6_url2}>
                <div className="donhweirwer_inner">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section6_image2}`)} className="img-fluid" alt="onsale" />
                </div>
                </Link>
              </div>

              <div className="col-lg-4">
                <Link to={OnSaleDetails?.data?.section6_url3}>
                <div className="donhweirwer_inner">
                  <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section6_image3}`)} className="img-fluid" alt="onsale" />
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* 
      <div className="lknaknjdoijweewpr py-4 mb-5">
        <div className="container-fluid">
          <img src="./images/On-Sale-Last-Row.jpg" className="img-fluid" alt="" />
        </div>
      </div>  */}

      <div className="fgnhdfjhugdfgsd pt-5">
        <div className="container-fluid">
          <div className="dfgbdfjhgdf">
            <h2>{OnSaleDetails?.data?.section8_title}</h2>
          </div>
          <div className="fhfgdfgfdg fsdeqqeqwerr">
            <div className="row">

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url1}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image1}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text1}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url2}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image2}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text2}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url3}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image3}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text3}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                 <Link to={OnSaleDetails?.data?.section8_url4}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image4}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text4}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url5}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image5}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text5}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url6}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image6}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text6}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url7}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image7}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text7}
                        </h4>
                        <button>SHOP NOW</button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <Link to={OnSaleDetails?.data?.section8_url8}>
                  <div className="dfbhhfgdf55 position-relative overflow-hidden">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section8_image8}`)} alt="" />

                    <div className="overlay-black3 position-absolute w-100 h-100">
                      <div className="dfbghf3">
                        <h4>
                          {OnSaleDetails?.data?.section8_text8}
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

       <div className="fgjhfbgdfjh565">
              <div className="container-fluid">
                <div className="dfgbdfjhgdf">
                  <h2>{OnSaleDetails?.data?.section9_title}</h2>
                </div>
                <div className="dbgjkdffd52" style={{
                        backgroundImage: `url(${optimizeImage(
                          `${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section9_background_image}`
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
                            <Link to={OnSaleDetails?.data?.section9_url1}>
                            <div className="ffdgf548">
                              <img
                                src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section9_image1}`)}
                                alt=""
                              />
                            </div>
                            </Link>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <Link to={OnSaleDetails?.data?.section9_url2}>
                            <div className="ffdgf548">
                              <img
                                src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section9_image2}`)}
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
                          {OnSaleDetails?.data?.section9_main_title}
                        </h2>
                        <p>{OnSaleDetails?.data?.section9_sub_title}</p>
                      </div>
                    </div>
      
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                      <div className="fbghjdfgfd">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <Link to={OnSaleDetails?.data?.section9_url3}>
                            <div className="ffdgf548">
                              <img
                                src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section9_image3}`)}
                                alt=""
                              />
                            </div>
                            </Link>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <Link to={OnSaleDetails?.data?.section9_url4}>
                            <div className="ffdgf548">
                              <img
                                src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section9_image4}`)}
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

      <div className="fbgvdsdfd6568 sgbdfedrqwr py-5">
        <div className="container-fluid">
          <div className="ghbgfgdf sdfwedweeerr">
            <div className="row align-items-center">
              <div className="col-lg-3 col-6">
                <div className="dfnghfd text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section7_image1}`)} alt="" />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    <h4>{OnSaleDetails?.data?.section7_number1} {OnSaleDetails?.data?.section7_text1}</h4>
                  </div>

                  {/* <div className="cfgncfgb">
                    <h4></h4>
                  </div> */}
                </div>
              </div>

              <div className="col-lg-3 col-6 ps-0">
                <div className="dfnghfd fsrweerrr text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section7_image2}`)} alt="" />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    <h4>{OnSaleDetails?.data?.section7_number2} {OnSaleDetails?.data?.section7_text2}</h4>
                  </div>

                  {/* <div className="cfgncfgb fsrweerrr">
                    <h4></h4>
                  </div>                   */}
                </div>
              </div>

              <div className="col-lg-3 col-6 ps-0">
                <div className="dfnghfd text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section7_image3}`)} alt="" />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    <h4>{OnSaleDetails?.data?.section7_number3} {OnSaleDetails?.data?.section7_text3}</h4>
                  </div>

                  {/* <div className="cfgncfgb">
                    <h4></h4>
                  </div> */}
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="dfnghfd fsrweerrr text-center">
                  <div className="sdhgdfg">
                    <img src={optimizeImage(`${OnSaleDetails?.image_url}/${OnSaleDetails?.data?.section7_image4}`)} alt="" />
                  </div>

                  <div className="cfgncfgb dfgsfeeer mt-3">
                    <h4>{OnSaleDetails?.data?.section7_number4} {OnSaleDetails?.data?.section7_text4}</h4>
                  </div>

                  {/* <div className="cfgncfgb">
                    <h4></h4>
                  </div>                   */}
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
              __html: OnSaleDetails?.data?.category_content?.description
            }}
          />
        </div>
      </div>
    </div>
  );
};
