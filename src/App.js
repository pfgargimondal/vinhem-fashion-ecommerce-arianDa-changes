import { useEffect, useState } from "react";
import { Header, Footer, ScrollToTop, ScrollToTopButton } from "./components";
import { AllRoutes } from "./routes/AllRoutes.js";
import { useLocation } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [footerBottomResNav, setFooterBottomResNav] = useState(false);
  const {pathname} = useLocation();
  const hideHeaderRoutes = [];
  const hideFullHeaderFooterRoutes = ["/invoice", "/blog"];
  const hideHeaderCategoryRoutes = ["/cart"];

  const shouldHideHeader = hideHeaderRoutes.includes(pathname);
  const shouldHideFullHeaderFooterRoutes = hideFullHeaderFooterRoutes.includes(pathname) || pathname.startsWith("/blog/");
  const shouldHideHeaderCategoryRoutes = hideHeaderCategoryRoutes.includes(pathname);

  useEffect(() => {
    pathname.startsWith("/blog") && setFooterBottomResNav(true);
  }, [pathname]);

  return (
    <div className="App">

      <Header footerBottomResNav={footerBottomResNav} shouldHideHeader={shouldHideHeader} shouldHideFullHeaderFooterRoutes={shouldHideFullHeaderFooterRoutes} shouldHideHeaderCategoryRoutes={shouldHideHeaderCategoryRoutes} />

      <main className={["/profile", "/change-password", "/cancelled-order", "/order-history", "/wishlist", "/chat"].includes(pathname)
        ? "" 
        : ""}>
        <AllRoutes />
      </main>

      <Footer shouldHideFullHeaderFooterRoutes={shouldHideFullHeaderFooterRoutes} /> 

      <ScrollToTop />

      <ScrollToTopButton />

       <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ zIndex: 9999999999 }}
        />
    </div>
  );
}

export default App;