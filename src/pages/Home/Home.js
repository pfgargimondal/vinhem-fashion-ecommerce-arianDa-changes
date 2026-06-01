import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import http from "../../http";
import { FeaturedProducts } from "../../components";
import "swiper/css";
import "swiper/css/pagination";
import "./Css/Home.css";
import "./Css/HomeResponsive.css";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";

export const Home = () => {
  const [homepage, Sethomepage] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageMetaData, setPageMetaData] = useState([]);
  
  // eslint-disable-next-line
  const pathName = useLocation().pathname;

  useEffect(() => {
      const fetchOnSale = async () => {
        setLoading(true);
          try {
              const getresponse = await http.get("/fetch-home-page");
              const getMetaDataResponse = await http.get("/get-all-page-meta-title");
              Sethomepage(getresponse.data); 
              setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
          } catch (error) {
              console.error("Error fetching homepage data:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchOnSale();
  }, []);


  const matchedMeta = pageMetaData.find((item) => {
      const slug = item.page_name
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

      return `/${slug}` === '/home';
  });

  useMetaData({
      meta_title: matchedMeta?.meta_title || "Vinhem Fashion",
      meta_description: matchedMeta?.meta_description || "",
      meta_keyword: matchedMeta?.meta_keyword || ""
  });


  const swiperConfig = {
    spaceBetween: 20,
    modules: [Autoplay, Pagination, Navigation, Mousewheel],
    slidesPerView: 4,
    navigation: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    breakpoints: {
      0: { 
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 15
      },
      320: { 
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 15
      },
      393: { 
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 15
      },
      576: { 
        slidesPerView: 2.2,
        centeredSlides: true,
        spaceBetween: 15
      },
      768: { 
        slidesPerView: 3.2,
        centeredSlides: true,
        spaceBetween: 15
      },
      992: { 
        slidesPerView: 4.2,
        centeredSlides: false 
      },
      1200: { 
        slidesPerView: 4,
        centeredSlides: false 
      }
    },
  };

  
  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      <div className="dfgdfvsdfsdfsdf">
        <div className="container-fluid">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="rehbgdfgnjh">
                <div className="sdfsdfd">
                  <Link to={homepage?.data?.url}>
                    <div className="gdfgdf215">
                      <img
                        src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.banner_image1}`)}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="rehbgdfgnjh">
                <div className="sdfsdfd">
                  <Link to={homepage?.data?.url2}>
                    <div className="gdfgdf215">
                      <img
                        src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.side_banner_image2}`)}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="rehbgdfgnjh">
                <div className="sdfsdfd">
                  <Link to={homepage?.data?.url3}>
                    <div className="gdfgdf215">
                      <img
                        src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.side_banner_image3}`)}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div className="jdfgdfg65dfdf container-fluid">
        <div className="sadasdc">
          <div className="dfghdfg548">
            <Link to={homepage?.data?.url2}>
              <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.banner_image2}`)} className="w-100" alt="" />
            </Link>
          </div> 
        </div>
      </div>

      {/* <div className="fbgvdsdfd6568 pt-3 pb-5 mb-4">
        <div className="container-fluid">
          <div className="ghbgfgdf">
            <Link to={homepage?.data?.url3}>
              <img src={`${homepage?.image_url}/${homepage?.data?.banner_image3}`} className="w-100" alt="" />
            </Link>
          </div>
        </div>
      </div> */}

      <div className="fbgvdsdfd6568 pt-3 pb-5">
        <div className="container-fluid">
          <div className="ghbgfgdf dfwedrtweqweqee fsesadadwwe">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  <Link to={homepage?.data?.h3_url1}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.h3_image1}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr sefweqwrwrewrer">
                        <h4>{homepage?.data?.h3_text1}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  <Link to={homepage?.data?.h3_url2}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.h3_image2}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr sefweqwrwrewrer">
                        <h4>{homepage?.data?.h3_text2}</h4>
                      </div>                  
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  <Link to={homepage?.data?.h3_url3}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.h3_image3}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr sefweqwrwrewrer">
                        <h4>{homepage?.data?.h3_text3}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd5">
                  <Link to={homepage?.data?.h3_url4}>
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.h3_image4}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr sefweqwrwrewrer">
                        <h4>{homepage?.data?.h3_text4}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dfndfjhdfgdf pb-5">
        <div className="container-fluid">
          <div className="dfhdfgd464">
            <h2 className="mb-3">Top Categories</h2>
          </div>

          <ul className="fgjdfgf3298 ps-0 mb-0 d-inline-flex align-items-center justify-content-between flex-wrap">
            {homepage?.data?.home_category.map((topCategorie) => (
              <li className="dfhdfg" key={topCategorie.id}>
                <div className="dbfggfhfh">
                  <Link to={`${topCategorie.url}`}>
                    <img src={optimizeImage(`${homepage.image_url}/${topCategorie.image}`)} className="img-fluid" alt={topCategorie.title} />
                  </Link>
                </div>

                <div className="fbsdsdf">
                  <h4 className="mb-0">
                    <Link to={`${topCategorie.url}`}>{topCategorie.title}</Link>
                  </h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sdfnjhdfbgdfg pb-5">
        <div className="container-fluid">
          <div className="fgnhfgh">
            <h2 className="mb-3">{homepage?.data?.section1_title1}</h2>
          </div>
          <div className="dfhgudfg">
            <div className="row">
              <div className="col-6">
                <div className="fhdfgdf">
                  <Link to={homepage?.data?.section1_url1}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section1_image1}`)} alt="" />
                  </Link>
                </div>
              </div>
              <div className="col-6">
                <div className="fhdfgdf">
                  <Link to={homepage?.data?.section1_url2}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section1_image2}`)} alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-fluid pb-5">
        <Link to={homepage?.data?.section2_url}>
          <div className="xfdjgdfgdfg">
            <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section2_image}`)} className="w-100" alt="" />
          </div>
        </Link>
      </div>

      <div className="xfbxdfgsdf d-none">
        <div className="container-fluid">
          <div className="dfngjhdfgdfg">
             {/* eslint-disable-next-line */}
            <marquee behavior="" direction="" className="gfjhfgjfg">
              <span>
                USE CODE: SALE70 <i className="fa-solid fa-bolt" />
              </span>{" "}
              <span className="hfg55543">
                SALE 70% OFF <i className="fa-solid fa-bolt" />
              </span>{" "}
              <span>
                END OF SEASON
                <i className="fa-solid fa-bolt" />
              </span>
            </marquee>
          </div>
        </div>
      </div>

      <div className="fbnghksdfsdfsf pb-5">
        <div className="container-fluid">
          <div className="sdf58sdfs">
            <h4 className="mb-4">{homepage?.data?.section3_title1}</h4>
          </div>
          <div className="dfgnhdfgdf">
            <div className="row">
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-4">
                <div className="nhgf65dfgdf">
                  <Link to={homepage?.data?.section3_url1}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section3_image1}`)} alt="" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-4">
                <div className="nhgf65dfgdf">
                  <Link to={homepage?.data?.section3_url2}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section3_image2}`)} alt="" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-0">
                <div className="nhgf65dfgdf">
                  <Link to={homepage?.data?.section3_url3}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section3_image3}`)} alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fvbhgfbfgvf5865 pb-5">
        <div className="container-fluid">
          <div className="gbfhdvgdfg">
            <div className="row">
              <div className="col-lg-3 mb-lg-0 mb-md-4 mb-4">
                <div className="dfdfdffd">
                  <Link to={homepage?.data?.section3_url4}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section3_image4}`)} alt="" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-9 mb-lg-0 mb-md-4 mb-0">
                <div className="dfdfdffd">
                  <Link to={homepage?.data?.section3_url5}>
                    <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section3_image5}`)} alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fcknjhfvgdf pb-5">
        <div className="container-fluid">
          <div className="sdf58sdfs">
            <h4 className="mb-3">{homepage?.data?.section4_title}</h4>
          </div>
          <Link to={homepage?.data?.section4_url}>
            <div className="sdfsdfsdfsd">
              <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section4_image}`)} alt="" />
            </div>
          </Link>
        </div>
      </div>

      <div className="kdnfghdfsdf pb-5">
        <div className="container-fluid">
          <div className="sdf58sdfs">
            <h4 className="mb-3">{homepage?.data?.section5_title}</h4>
          </div>
          <div className="dfdfhgdf65">
            <div className="row">
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-4">
                <Link to={homepage?.data?.section5_url1}>
                <div
                  className="dfgyhdfgdf"                  
                >
                  <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section5_image1}`)} alt="" />
                  {/* <div className="dfdfsdf">
                    <h4>
                      <span>NEW IN</span>{" "}
                    </h4>
                    <h2>
                      <span className="dftgh525">
                        SHOES &amp; <br /> BOOTS
                      </span>{" "}
                    </h2>
                  </div> */}
                </div>
                </Link>
              </div>
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-4">
                <Link to={homepage?.data?.section5_url2}>
                <div
                  className="dfgyhdfgdf"                  
                >
                  <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section5_image2}`)} alt="" />
                  {/* <div className="dfdfsdf">
                    <h4>
                      <span>MUST HAVE</span>
                    </h4>
                    <h2>
                      <span className="dftgh525">
                        EDITOR'S <br /> PICKS
                      </span>{" "}
                    </h2>
                  </div> */}
                </div>
                </Link>
              </div>
              <div className="col-lg-4 mb-lg-0 mb-md-4 mb-4">
                <Link to={homepage?.data?.section5_url3}>
                <div
                  className="dfgyhdfgdf"                  
                >
                  <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section5_image3}`)} alt="" />
                  {/* <div className="dfdfsdf">
                    <h4>
                      <span>NEW IN</span>{" "}
                    </h4>
                    <h2>
                      <span className="dftgh525">
                        SHOES &amp; <br /> BOOTS
                      </span>{" "}
                    </h2>
                  </div> */}
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="lknaknjdoijweewpr pb-5">
        <div className="container-fluid">
          <Link to={homepage?.data?.hp9_url1}>
            <img src={`${homepage?.image_url}/${homepage?.data?.hp9_image1}`} className="img-fluid" alt="" />
          </Link>
        </div>
      </div> */}      

      <div className="dfbgghdfdfgdf pb-5">
        <div className="container-fluid">
          <div className="sdf58sdfs">
            <h4 className="mb-3">Featured Products</h4>
          </div>

          <div className="fgjhdfgdfgdf">
            <Swiper {...swiperConfig}>
              {homepage?.data?.featured_product.map((featuredProduct) => (
                <SwiperSlide key={featuredProduct.id}>
                  <FeaturedProducts featuredProduct={featuredProduct} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="fbgvdsdfd6568 pb-5">
        <div className="container-fluid">
          <div className="ghbgfgdf sdvfsdsefredraede">
            <div className="dkhweinjkwehijkr row align-items-center justify-content-between">
              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  {/* <Link to={homepage?.data?.h3_url1}> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section9_image1}`)} alt="" />
                      </div>
                      <div className="cfgncfgb sdfseeerrrr aedqeqweqqee">
                        <h4>{homepage?.data?.section9_title1}</h4>
                        <p className="mb-0">{homepage?.data?.section9_description1}</p>
                      </div>
                    </div>
                  {/* </Link> */}
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  {/* <Link to={homepage?.data?.h3_url2}> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section9_image2}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr aedqeqweqqee">
                        <h4>{homepage?.data?.section9_title2}</h4>
                        <p className="mb-0">{homepage?.data?.section9_description2}</p>
                      </div>                  
                    </div>
                  {/* </Link> */}
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 col-sm-6 col-6">
                <div className="dfnghfd">
                  {/* <Link to={homepage?.data?.h3_url3}> */}
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="sdhgdfg">
                        <img src={optimizeImage(`${homepage?.image_url}/${homepage?.data?.section9_image3}`)} alt="" />
                      </div>

                      <div className="cfgncfgb sdfseeerrrr aedqeqweqqee">
                        <h4>{homepage?.data?.section9_title3}</h4>
                        <p className="mb-0">{homepage?.data?.section9_description3}</p>
                      </div>
                    </div>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <hr className="doewjirhweiewrer" />
      {/* <div class="yudfdfgdfbgdfgdffgfg">
        <div class="container-fluid">
          <div
            className="pt-4"
            dangerouslySetInnerHTML={{
              __html: homepage?.data?.description
            }}
          />
        </div>
      </div> */}
      <FooterTopComponent />
    </div>
  )
}