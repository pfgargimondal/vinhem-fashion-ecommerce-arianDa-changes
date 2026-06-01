import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import http from "../../../http";



export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [mainCatgry, setMainCatgry] = useState([]);

  const pathName = useLocation().pathname;

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    const fetchMainCategory = async () => {
      try {
        const getresponse = await http.get("/product-category");
        const allresponse = getresponse?.data?.data;

        setMainCatgry(allresponse);
      } catch (error) {
        console.error("Error fetching main category:", error);
      }
    };

    fetchMainCategory();
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {visible && (
        <button onClick={scrollToTop} style={{...styles.button, bottom: mainCatgry?.some(item => (pathName.startsWith(`/${item.mainCategory_slug}`) || pathName.startsWith(`/all-products`)) && window.innerWidth <= 991) ? "12rem" : "10rem"}}>↑</button>
      )}
    </>
  );
}

const styles = {
  button: {
    position: "fixed",
    right: "1rem",
    width: "3rem",
    height: "3rem",
    zIndex: 99999999,
    fontSize: "18px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "var(--pink-main-color)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
  },
};