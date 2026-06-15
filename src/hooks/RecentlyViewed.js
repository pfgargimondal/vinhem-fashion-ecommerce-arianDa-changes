// import { useEffect, useState } from "react";
// import http from "../http";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// eslint-disable-next-line
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
import { FeaturedProducts } from "../components";


export default function RecentlyViewed({ recentProducts }) {

  // const [recentProducts, setRecentProducts] = useState([]);
  
  const swiperConfig = {
    modules: [Autoplay, Pagination, Navigation, Mousewheel],
    spaceBetween: 20,
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

  // useEffect(() => {
  //   const slugs = JSON.parse(localStorage.getItem("recentlyViewedSlugs")) || [];
  //   if (slugs.length) fetchRecentProducts(slugs);
  // }, []);

  // const fetchRecentProducts = async (slugs) => {
  //   try {
  //     const res = await http.post("/recent-view-product", { slugs });
  //     setRecentProducts(res.data);
  //   } catch (error) {
  //     console.error("Failed to fetch recent products:", error);
  //   }
  // };

  if (!recentProducts?.data?.length) return null;

  return (
    <div className="dfbgghdfdfgdf">
      <div className="sdf58sdfs">
        <h4 className="pb-2">Recently Viewed</h4>
      </div>

      <div className="fgjhdfgdfgdf dhbdgshfggdgrg py-4">
        <Swiper {...swiperConfig}>
            {recentProducts?.data?.map((featuredProduct) => (
                <SwiperSlide key={featuredProduct.id}>
                    <FeaturedProducts featuredProduct={featuredProduct} />
                </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
