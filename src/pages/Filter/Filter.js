import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Css/Filter.css";
import "./Css/FilterResponsive.css";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import FilterSection from "./FilterSection";
import { useFilter } from "../../context/FilterContext";
import { useCurrency } from "../../context/CurrencyContext";
import { PageNotFound } from "../PageNotFound/PageNotFound";
import Loader from "../../components/Loader/Loader";
import { useMetaData } from "../../hooks/useMetaData";
import { optimizeImage } from "../../utils/optimizeImage";

export const Filter = () => {
  // eslint-disable-next-line
  const { formatPrice, selectedCurrency } = useCurrency();
  const { user } = useAuth();
  const location = useLocation();
  // eslint-disable-next-line
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // eslint-disable-next-line
  const { products, initialProductList, mainCategory, subCategory, filterCategory, filterCategoryCntxt, color, material, designer, plusSize, occasion, size, celebrity, discount, shippingTime, minPrice, maxPrice, sortBy, setSortBy, setNewArrival, setReadyToShip, setCstmFit, setOnSale, resetFilter, onSale, newIn, readyToShip, removeMainCategory, removeSubCategory, removeFilterCategory, removeColor, removeMaterial, removeDesigner, removePlusSize, removeOccasion, removeSize, removeCelebrity, removeDiscount, removeShippingTime, cstmFit, page: currentPage, setPage } = useFilter();
  // eslint-disable-next-line
  const [viewType, setViewType] = useState(false);
  const [resFltrMenu, setResFltrMenu] = useState(false);
  const [resSrtByOptions, setResSrtByOptions] = useState(false);
  // eslint-disable-next-line
  const [allProductdata, SetallProduct] = useState([]);
  const [filterdetails, Setfilterdetails] = useState(null);
  const [allFilterData, SetallFilterData] = useState(null);
  const [allFilterMappingdata, SetallFilterMappingdata] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [productMinPrice, setProductMinPrice] = useState(0);

  const { loading: wishlistLoading, wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const [mainCatgry, setMainCatgry] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const [pageMetaData, setPageMetaData] = useState([]);


  const filterOptionsItems = [
    // ...(Array.isArray(mainCategory) ? mainCategory.map(v => ({ type: "main", value: v })) : []),
    // ...(Array.isArray(subCategory) ? subCategory.map(v => ({ type: "sub", value: v })) : []),
    // ...(Array.isArray(filterCategoryCntxt) ? filterCategoryCntxt.map(v => ({ type: "filter", value: v })) : []),
    // ...(Array.isArray(color) ? color.map(v => ({ type: "color", value: v })) : []),
    // ...(Array.isArray(material) ? material.map(v => ({ type: "material", value: v })) : []),
    // ...(Array.isArray(designer) ? designer.map(v => ({ type: "designer", value: v })) : []),
    // ...(Array.isArray(plusSize) ? plusSize.map(v => ({ type: "plusSize", value: v })) : []),
    // ...(Array.isArray(occasion) ? occasion.map(v => ({ type: "occasion", value: v })) : []),
    // ...(Array.isArray(size) ? size.map(v => ({ type: "size", value: v })) : []),
    // ...(Array.isArray(celebrity) ? celebrity.map(v => ({ type: "celebrity", value: v })) : []),
    // ...(Array.isArray(discount) ? discount.map(v => ({ type: "discount", value: v })) : []),
    // ...(Array.isArray(shippingTime) ? shippingTime.map(v => ({ type: "shippingTime", value: v })) : []),

     ...(mainCategory ? [{ type: "mainCategory", value: mainCategory }] : []),
     ...(subCategory ? [{ type: "subCategory", value: subCategory }] : []),
     ...(filterCategoryCntxt ? [{ type: "filterCategoryCntxt", value: filterCategoryCntxt }] : []),
     ...(color ? [{ type: "color", value: color }] : []),
     ...(material ? [{ type: "material", value: material }] : []),
     ...(designer ? [{ type: "designer", value: designer }] : []),
     ...(plusSize ? [{ type: "plusSize", value: plusSize }] : []),
     ...(occasion ? [{ type: "occasion", value: occasion }] : []),
     ...(size ? [{ type: "size", value: size }] : []),
     ...(celebrity ? [{ type: "celebrity", value: celebrity }] : []),
     ...(discount ? [{ type: "discount", value: discount }] : []),
     ...(shippingTime ? [{ type: "shippingTime", value: shippingTime }] : []),
  ];

  // console.log(filterOptionsItems);

  const DEFAULT_VISIBLE = 6;

  const [selectedFilterOptions, setSelectedFilterOptions] = useState(DEFAULT_VISIBLE);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectedFilterOptionsToggle = () => {
    if (isExpanded) {
      setSelectedFilterOptions(DEFAULT_VISIBLE);
    } else {
      setSelectedFilterOptions(filterOptionsItems.length);
    }
    setIsExpanded(prev => !prev);
  };


  const handleFilterOptionRemove = ({ type, value }) => {
    setFilterLoading(true);

    // 1. Remove from state
    switch (type) {
      case "mainCategory": removeMainCategory(value); break;
      case "subCategory": removeSubCategory(value); break;
      case "filterCategoryCntxt": removeFilterCategory(value); break;
      case "color": removeColor(value); break;
      case "material": removeMaterial(value); break;
      case "designer": removeDesigner(value); break;
      case "plusSize": removePlusSize(value); break;
      case "occasion": removeOccasion(value); break;
      case "size": removeSize(value); break;
      case "celebrity": removeCelebrity(value); break;
      case "discount": removeDiscount(value); break;
      case "shippingTime": removeShippingTime(value); break;
      default: break;
    }

    // REMOVE FROM URL
    const params = new URLSearchParams(location.search);

    switch (type) {

        case "mainCategory":
            params.delete("main");
            break;

        case "subCategory":
            params.delete("subpaths");
            break;

        case "filterCategoryCntxt":
            params.delete("filterpaths");
            break;

        case "color":
            params.delete("color");
            break;

        case "material":
            params.delete("material");
            break;

        case "designer":
            params.delete("designer");
            break;

        case "plusSize":
            params.delete("plusSize");
            break;

        case "occasion":
            params.delete("occasion");
            break;

        case "size":
            params.delete("size");
            break;

        case "celebrity":
            params.delete("celebrity");
            break;

        case "discount":
            params.delete("discount");
            break;

        case "shippingTime":
            params.delete("shippingTime");
            break;

        default:
            break;
    }

    navigate(
        {
            pathname: location.pathname,
            search: params.toString()
        },
        { replace: true }
    );


    setTimeout(() => {
        setFilterLoading(false);
    }, 1000);

    // 2. Update the URL after a tiny delay (to make sure state is updated)
    // setTimeout(() => {
    //   const searchParams = new URLSearchParams();

    //   // main
    //   if (mainCategory) searchParams.set("main", mainCategory);
    //   else searchParams.delete("main");

    //   // sub
    //   if (subCategory) searchParams.set("subpaths", subCategory);
    //   else searchParams.delete("subpaths");  // ✅ Also delete subpaths

    //   // filter
    //   if (filterCategoryCntxt) searchParams.set("filterpaths", filterCategoryCntxt);
    //   else searchParams.delete("filterpaths");

    //   // color, material, designer etc (if you want)
    //   if (color) searchParams.set("color", color);
    //   else searchParams.delete("color");

    //   if (material) searchParams.set("material", material);
    //   else searchParams.delete("material");

    //   if (designer) searchParams.set("designer", designer);
    //   else searchParams.delete("designer");

    //   // Push updated URL
    //   navigate({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    // }, 50);
  };

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);

  //   // MAIN CATEGORY (single)
  //   if (mainCategory) {
  //     searchParams.set("main", mainCategory);
  //   }

  //   // SUB CATEGORY (single)
  //   if (subCategory) {
  //     searchParams.set("subpaths", subCategory);
  //   }

  //   // FILTER CATEGORY (single)

  //   if (filterCategoryCntxt) {
  //     searchParams.set("filterpaths", filterCategoryCntxt);
  //   }

  //   // // FILTER CATEGORY (multi)
  //   // if (filterCategoryCntxt?.length) {
  //   //   searchParams.set("filterpaths", filterCategoryCntxt.join(","));
  //   // }

  //   // OTHER FILTERS (multi)
  //   if (color?.length) searchParams.set("color", color);
  //   if (material?.length) searchParams.set("material", material);
  //   if (designer?.length) searchParams.set("designer", designer);
  //   if (plusSize?.length) searchParams.set("plusSize", plusSize);
  //   if (occasion?.length) searchParams.set("occasion", occasion);
  //   if (size?.length) searchParams.set("size", size);
  //   if (celebrity?.length) searchParams.set("celebrity", celebrity);
  //   if (discount?.length) searchParams.set("discount", discount);
  //   if (shippingTime?.length) searchParams.set("shippingTime", shippingTime);
  //   if (minPrice > 0 || maxPrice < 1000000) {
  //     searchParams.set("price", `${minPrice}-${maxPrice}`);
  //   } else {
  //     searchParams.delete("price");
  //   }

  //   navigate(
  //     {
  //       pathname: location.pathname,
  //       search: searchParams.toString()
  //     },
  //     { replace: true }
  //   );
  // }, [
  //   mainCategory,
  //   subCategory,
  //   filterCategoryCntxt,
  //   color,
  //   material,
  //   designer,
  //   plusSize,
  //   occasion,
  //   size,
  //   celebrity,
  //   discount,
  //   shippingTime,
  //   minPrice,
  //   maxPrice,
  //   location.pathname,
  //   location.search,
  //   navigate
  // ]);

  // useEffect(() => {

  //   const searchParams = new URLSearchParams();   // 🔥 DO NOT use location.search
  //   // const searchParams = new URLSearchParams(location.search);    

  //   const rate = selectedCurrency?.exchange_rate_to_inr || 1;
  //   const formatminprice = Math.floor(
  //     (minPrice === 0 ? productMinPrice : minPrice) / rate
  //   );
  //   const formatmaxprice = Math.floor(maxPrice / rate);

  //   if (mainCategory)
  //     searchParams.set("main", mainCategory);

  //   if (subCategory)
  //     searchParams.set("subpaths", subCategory);

  //   if (filterCategoryCntxt)
  //     searchParams.set("filterpaths", filterCategoryCntxt);

  //   if (color)
  //     searchParams.set("color", color);

  //   if (material)
  //     searchParams.set("material", material);

  //   if (designer)
  //     searchParams.set("designer", designer);

  //   if (plusSize)
  //     searchParams.set("plusSize", plusSize);

  //   if (occasion)
  //     searchParams.set("occasion", occasion);

  //   if (size)
  //     searchParams.set("size", size);

  //   if (celebrity)
  //     searchParams.set("celebrity", celebrity);

  //   if (discount)
  //     searchParams.set("discount", discount);

  //   if (shippingTime)
  //     searchParams.set("shippingTime", shippingTime);

  //   if (minPrice > 0 || maxPrice < 1000000)
  //     // searchParams.set("price", `${minPrice}-${maxPrice}`);
  //   searchParams.set("price", `${String(formatminprice).replace(/,/g, "")}-${String(formatmaxprice).replace(/,/g, "")}`);


  //   navigate(
  //     {
  //       pathname: location.pathname,
  //       search: searchParams.toString()
  //     },
  //     { replace: true }
  //   );

  // }, [
  //   mainCategory,
  //   subCategory,
  //   filterCategoryCntxt,
  //   color,
  //   material,
  //   designer,
  //   plusSize,
  //   occasion,
  //   size,
  //   celebrity,
  //   discount,
  //   shippingTime,
  //   minPrice,
  //   maxPrice,
  //   location.pathname,
  //   // location.search,
  //   navigate,
  //   formatPrice,
  //   productMinPrice,
  //   selectedCurrency
  // ]);

  const handleClearFilter = () => {
      setFilterLoading(true);

      resetFilter();

      setTimeout(() => {
          setFilterLoading(false);
      }, 1000);
  };


  const productsPerPage = 24;
  const visibleCount = 5;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProduct = products?.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products?.length / productsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    return pages.slice(
      pageWindowStart - 1,
      pageWindowStart - 1 + visibleCount
    );
  };

  const handlePageClick = (page) => {
    setLoading(true);

    setPage(page);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handlePrev = () => {
    setLoading(true);

    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setPage(newPage);

      if (newPage < pageWindowStart) {
        setPageWindowStart(prev => Math.max(1, prev - 1));
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleNext = () => {
    setLoading(true);
    
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setPage(newPage);

      if (newPage >= pageWindowStart + visibleCount) {
        setPageWindowStart(prev => prev + 1);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };



  const search = useLocation().search;
  const searchTerm = new URLSearchParams(search).get("search")?.trim() || "";


  useEffect(() => {
    const fetchMainCategory = async () => {
      try {
        const getresponse = await http.get("/product-category");
        const allresponse = getresponse.data;

        setMainCatgry(allresponse.data);
      } catch (error) {
        console.error("Error fetching main category:", error);
      }
    };

    fetchMainCategory();
  }, []);

  useEffect(() => {
    setLoading(true);
    setProductsLoaded(false);
    setFiltersLoaded(false);
  }, [location.pathname]);

  const toTitleCase = (s = "") =>
    s
      .toString()
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  //Res Filter Page No-scroll
  useEffect(() => {
    const body = document.querySelector("html");

    resFltrMenu
      ? body.classList.add("overflow-hidden")
      : body.classList.remove("overflow-hidden");
  }, [resFltrMenu]);

  // const handleFilterChange = (value) => {
  //   navigate(`/${value}`);
  // };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (currentPage > 1) {
      params.set("page", currentPage);
    } else {
      params.delete("page");
    }

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  }, [currentPage, location.search, location.pathname, navigate]);


  const segments = location.pathname.split("/").filter(Boolean);
  let category = null;
  let subcategory = null;

  if (segments.length === 1) {
    category = segments[0];

  } else if (segments.length >= 2) {
    category = segments[0];
    subcategory = segments[1];

  }

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const response = await http.post("/fetch-product", { category, subcategory });

        const getPageMetaData = await http.get("/get-all-page-meta-title");

        const allData = response.data?.data;

        // ✅ use let
        let allProducts = response.data?.data?.all_product ?? [];

        // ✅ apply condition
        if (category === "new-in") {
          allProducts = allProducts.filter(
            (product) =>
              product.new_arrival === "1" || product.new_arrival === true
          );
        }
        if (category === "ready-to-ship") {
          allProducts = allProducts.filter(p => p.rts_quantity > 0);
        }

        const allfilterDetails = response.data?.data?.filter_banner ?? "";

        SetallFilterData(allData);
        Setfilterdetails(allfilterDetails);
        setPageMetaData(getPageMetaData.data.data.get_category_meta_title);

        const normalizedSearch = searchTerm.toLowerCase();

        const filteredProducts = searchTerm
          ? allProducts.filter((product) => {
              const name = product.product_name?.toLowerCase() || "";

              const productPID = product.PID?.toLowerCase() || "";
              const productItemID = product.item_id?.toLowerCase() || "";

              return normalizedSearch
                .split(/\s+/)
                .every((term) => 
                  name.includes(term) || 
                  productPID.includes(term) || 
                  productItemID.includes(term)
              );
            })
          : allProducts;

        initialProductList(filteredProducts);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoaded(true);
      }
    };

    fetchAllProduct();
      // eslint-disable-next-line
  }, [location.pathname, category, subcategory, searchTerm]);

  // const matchedMeta = pageMetaData.find(
  //   (item) =>
  //     item.category_name?.toLowerCase() === category?.toLowerCase() &&
  //     item.sub_category_name?.toLowerCase() === subcategory?.toLowerCase()
  // );

  const normalize = (str) =>
  (str || "")
    .toString()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .trim();

  const matchedMeta = pageMetaData?.find((item) => {
    const itemCategory = normalize(item.category_name);
    const itemSubCategory = normalize(item.sub_category_name);

    const currentCategory = normalize(category);
    const currentSubCategory = normalize(subcategory);

    return (
      itemCategory === currentCategory &&
      itemSubCategory === currentSubCategory
    );
  });


  useMetaData({
    meta_title: matchedMeta?.meta_title || `${category} - Vinhem Fashion`,
    meta_description: matchedMeta?.meta_description || "",
    meta_keyword: matchedMeta?.meta_keyword || ""
  });


   // ✅ from context

  const toggleWishlist = (productId) => {
    const id = Number(productId);

    if (wishlistIds.includes(id)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  useEffect(() => {
    const fetchFilterMapping = async () => {
      setLoading(true);
      try {
        // Send to API
        const response = await http.post("/fetch-filter-details", {
          category,
          subcategory,
        });

        setFilterCategories(response.data?.categoryData ?? []);
        SetallFilterMappingdata(response.data?.data ?? []);
        setProductMinPrice(response.data.productMinPrice ?? 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setFiltersLoaded(true); // important
      }
    };

    fetchFilterMapping();
  }, [location.pathname, category, subcategory]);



  const handleResSortByToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");

    setResSrtByOptions(!resSrtByOptions);
  };


  const handleResSortByClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");

    setResSrtByOptions(false);
  };


  useEffect(() => {
    if (productsLoaded && filtersLoaded) {
      setLoading(false);
    }
  }, [productsLoaded, filtersLoaded]);


  if (!loading && filterCategories.length === 0) {
    return <PageNotFound />;
  }

  const filterTopBannerHide = mainCatgry.map(mnctgySlug => mnctgySlug.mainCategory_slug);

  const slugToTitle = (text = "") => {
    return text
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // const isSpecialPage = 
  //   category === "all-products";

  if (loading || wishlistLoading || filterLoading) {
    return <Loader />;
  }

  

  return (
    <div className="filter-wrapper pt-2">
      <div className="container-fluid">
        <div className={`doiejwoijrwer ${filterTopBannerHide.includes(category) && !subcategory ? "row" : ""}`}>
          <div className={`dieihirweir ${filterTopBannerHide.includes(category) && !subcategory ? "col-lg-3" : ""}`}>
            <div className="breadcrumb">
              <ul className="ps-0 mb-0">
                <li>
                  <Link to="/">Home</Link>
                </li>
                {category && (
                  <>
                    <li className="mx-2">/</li>
                    <li>
                      <Link to={`/${category}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Link>
                    </li>
                  </>
                )}

                {subcategory && (
                  <>
                    <li className="mx-2">/</li>
                    <li>
                      <Link to={`/${category}/${subcategory}`}>
                        {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="alosjdjkhrjfse">
              <h4 className="mb-0">
                {category === "all-products"
                  ? "All Products"
                  : subcategory
                    ? `${toTitleCase(subcategory)} For ${toTitleCase(category)}`
                    : `All Products For ${toTitleCase(category)}`}
                <span> - Showing {products?.length ?? 0} Results</span>
              </h4>
            </div>
          </div>

          {filterTopBannerHide.includes(category) && !subcategory && (
            <div className={filterTopBannerHide.includes(category) && !subcategory ? "col-lg-9" : ""}>
              <div
                className="advtsmnt-bnnr overflow-hidden"
                style={{ borderRadius: "1rem" }}
              >
                {filterdetails
                  && (
                    <img
                      src={optimizeImage(`${allFilterData?.banner_image_url}/${filterdetails?.image}`)}
                      className="img-fluid w-100"
                      alt=""
                    />
                  )
                  // : (
                  //   <img
                  //     src="images/fltrdbnnr.png"
                  //     className="img-fluid w-100"
                  //     alt=""
                  //   />
                  // )
                  }
              </div>
            </div>
          )}
        </div>

        {category && subcategory && (
          <div
            className="advtsmnt-bnnr my-4 overflow-hidden"
            style={{ borderRadius: "0.5rem" }}
          >
            {filterdetails
              && (
                <img
                  src={optimizeImage(`${allFilterData?.banner_image_url}/${filterdetails?.image}`)}
                  className="img-fluid w-100"
                  alt=""
                />
              )
              // : (
              //   <img
              //     src="../images/fltrdbnnr.png"
              //     className="img-fluid w-100"
              //     alt=""
              //   />
              // )
              }
          </div>
        )}

        {resFltrMenu && (
          <div
            className="res-fltr-bckdrp position-fixed w-100 h-100"
            onClick={() => setResFltrMenu(false)}
          ></div>
        )}

        <div className="row mt-5 dffedfgwetttt">
          <div className="col-lg-3 sgvadfbgsAGvsg">
            <div className="filter-options" style={
              category && !subcategory && category !== "all-products"
                ? { transform: "translateY(-18vw)" }
                : {}
            }>
              <div className="dweihrihwerwerwer">
              {filterOptionsItems && (
                <div className="doeihrmwerwer d-flex flex-wrap pb-4">
                  {filterOptionsItems.slice(0, selectedFilterOptions).map(item => {
                      if (typeof item?.value !== "string") return null;

                      let displayValue = "";

                      if (item.type === "sub" || item.type === "filter") {
                        const pathParts = item.value.split("/");
                        // eslint-disable-next-line
                        const mainCategory = pathParts[0]
                          ?.replace(/-/g, " ")
                          ?.split(" ")
                          ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          ?.join(" ");

                        const lastPart = pathParts[pathParts.length - 1]
                          ?.replace(/-/g, " ")
                          ?.split(" ")
                          ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          ?.join(" ");

                        // displayValue = `${mainCategory} - ${lastPart}`;
                        // displayValue = `${lastPart}`;
                        displayValue = slugToTitle(lastPart);

                      } else if (item.type === "plusSize" || item.type === "size") {
                          // Convert all letters to uppercase
                            displayValue = item.value === 'free size'
                                ? toTitleCase(item.value)
                                : item.value.toUpperCase();

                      } else if (item.type === "discount") {
                          // displayValue = item.value;
                          const [min, max] = item.value.split("-");
                          displayValue = `${min}%-${max}%`;
                      } else {
                        // displayValue = item.value
                        //   .split(" ")
                        //   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        //   .join(" ");

                        displayValue = slugToTitle(item.value);
                      }

                      return (
                        <button
                          key={`${item.type}-${item.value}`}
                          onClick={() => handleFilterOptionRemove(item)}
                          className="btn btn-filter-tag p-2 bg-transparent rounded-0 text-dark btn-main"
                        >
                          <i className="fa-solid fa-xmark"></i> {displayValue}
                        </button>
                      );
                    })}

                </div>
              )}                

                {filterOptionsItems.length > DEFAULT_VISIBLE && (
                  <p onClick={handleSelectedFilterOptionsToggle} className="mb-0 ms-4 cursor-pointer">
                    {isExpanded ? "Show less" : `+${filterOptionsItems.length - DEFAULT_VISIBLE} more`}
                  </p>
                )}
              </div>

              <div className="oidenjwihrwer mb-4 d-flex align-items-center justify-content-between">
                <h5
                  className="mb-0"
                  id="res-filtr-btn"
                  onClick={() => setResFltrMenu(true)}
                >
                  <i class="fa-solid me-1 fa-filter"></i> Refine
                </h5>

                {/* <h6 onClick={() => resetFilter()} className="mb-0">Clear All</h6> */}
                <h6 onClick={handleClearFilter} className="mb-0">Clear All</h6>
              </div>

              <div
                className={`saojdkjierwerwer ${resFltrMenu ? "" : "res-filtr-nav-hide"
                  }`}
                id="res-filtr-nav"
              >
                <FilterSection category={category} subcategory={subcategory} filterCategory={filterCategory} setResFltrMenu={setResFltrMenu} allFilterMappingdata={allFilterMappingdata} filterCategories={filterCategories} productMinPrice={productMinPrice} setFilterLoading={setFilterLoading}/>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="filtered-products">
              <div className="iduhweihriweurwerwer row align-items-center pb-3">
                <div className="col-lg-9">
                  <div className="idasijhdmsiejr d-flex align-items-center">
                    {/* <div className="view-options d-none me-3 align-items-center">
                      <div
                        className={`grid-view me-1 ${!viewType ? "active" : ""}`} onClick={() => setViewType(!viewType)}
                      >
                        <i class="bi bi-grid-3x3-gap"></i>
                      </div>

                      <div
                        className={`list-view ${viewType ? "active" : ""}`}
                        onClick={() => setViewType(!viewType)}
                      >
                        <i class="bi bi-card-list"></i>
                      </div>
                    </div> */}
                    <div className="doewnkrhwer">
                      <input type="checkbox" className="d-none" id="huidweujr" name="djikeiewr" checked={newIn}
                        onChange={(e) => {
                          setLoading(true);

                          setNewArrival(e.target.checked);
                          
                          setTimeout(() => {
                            setLoading(false);
                          }, 500);
                        }} />

                      <label htmlFor="huidweujr" className="btn btn-main me-1">
                        <i className="bi me-1 bi-plus-circle-dotted"></i> New In
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" className="d-none" id="daedfweweer" name="djikeiewr" value="READY TO SHIP" checked={readyToShip}
                        onChange={(e) => {
                          setLoading(true);

                          setReadyToShip(e.target.checked)

                          setTimeout(() => {
                            setLoading(false);
                          }, 500);
                        }} />

                      <label htmlFor="daedfweweer" className="btn btn-main me-1">
                        <i className="bi me-1 bi-lightning-charge"></i> Ready to Ship
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" name="djikeiewr" className="d-none" id="gfdewerwr" checked={onSale}
                        onChange={(e) => {
                          setLoading(true);

                          setOnSale(e.target.checked);

                          setTimeout(() => {
                            setLoading(false);
                          }, 500);
                        }} />

                      <label
                        htmlFor="gfdewerwr"
                        className="btn btn-main me-1"
                      >
                        <i class="bi me-1 bi-receipt"></i> On Sale
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" name="djikeiewr" className="d-none" id="asddettt" checked={cstmFit}
                        onChange={(e) => {
                          setLoading(true);

                          setCstmFit(e.target.checked);

                          setTimeout(() => {
                            setLoading(false);
                          }, 500);
                        }
                      } />

                      <label htmlFor="asddettt" className="btn btn-main me-1">
                        <i class="bi me-1 bi-vignette"></i>  Custom-fit
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="podwejorjwierwer d-none d-lg-flex d-md-flex align-items-center">
                    <h5 className="mb-0">Sort By:</h5>

                    <select name="" className="form-select" id="" value={sortBy || "RECOMMENDED"} 
                      onChange={(e) => {
                        setLoading(true);

                        setSortBy(e.target.value);

                        setTimeout(() => {
                          setLoading(false);
                        }, 500);
                      }}>
                      <option value="RECOMMENDED">Recommended</option>

                      <option value="NEW_ARRIVAL">New Arrivals</option>

                      <option value="BEST_SELLER">Best Seller</option>

                      <option value="LOW_TO_HIGH">Price Low to High</option>

                      <option value="HIGH_TO_LOW">Price High to Low</option>

                      <option value="DISCOUNT_HIGH_TO_LOW">Discount High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="products-wrapper filtr-wrppr pt-3">
                <div className="row">
                  {products?.length > 0 ? (
                    currentProduct?.map((product) => (
                      <div className={`smdflcsdlpfkselkrpr ${!viewType ? "col-lg-4 col-md-6 col-sm-6 col-6" : "col-lg-12"} mb-4`}>
                        <div className="dfgjhbdfg">
                          <div className="images">
                            <div className="image position-relative">
                              {(onSale || discount) && product?.discount && (
                                <div className="dscnt-prce px-0">
                                  <span className="price">{product?.discount}% <br /> OFF</span>
                                </div>
                              )}

                              {/* {newIn && (product?.new_arrival === "1" || product?.new_arrival === true) && ( */}
                              {(category === "new-in" || newIn) && (product?.new_arrival === "1" || product?.new_arrival === true) && (
                                <div className="nw-arrvl px-0">
                                  <span className="price"><i>NEW IN</i></span>
                                </div>
                              )}

                              <div className={`doiewjkrniuwewer position-relative overflow-hidden ${!viewType ? "col-lg-12" : "col-lg-3"}`}>
                                <Link to={`/products/${product.slug}-${product.PID}`}>
                                  <img
                                    src={optimizeImage(product?.encoded_image_url_1 || "/images/no-preview.jpg")}
                                    alt={product?.product_name || "Product image"}
                                  />
                                </Link>

                                <div className="doikwenirnwekhrwer d-flex position-absolute" style={{ top: (onSale || discount) && product?.discount ? "17%" : "3%" }}>
                                  {user ? (
                                    <>
                                      <button
                                        className="btn-cart mb-1"
                                        type="button"
                                        onClick={() => addToCart(product.id)}
                                      >
                                        <i class="fa-solid fa-cart-arrow-down"></i>
                                      </button>
                                      <button
                                        onClick={() => toggleWishlist(product.PID)}
                                      >
                                        <i
                                          className={
                                            wishlistIds.includes(product.PID)
                                              ? "fa-solid fa-heart"
                                              : "fa-regular fa-heart"
                                          }
                                        ></i>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <Link to="/login">
                                        <button
                                          className="btn-cart mb-1"
                                          type="button"
                                        >
                                          <i class="fa-solid fa-cart-arrow-down"></i>
                                        </button>
                                      </Link>
                                      <Link to="/login">
                                        <button
                                          className="btn-wishlist"
                                          type="button"
                                        >
                                          <i class="fa-regular fa-heart"></i>
                                          <i class="fa-solid d-none fa-heart"></i>
                                        </button>
                                      </Link>
                                    </>
                                  )}
                                </div>

                                <div className="dbgdfhgv">
                                  <button className="btn btn-main w-100">
                                    QUICK ADD
                                  </button>
                                </div>
                              </div>

                              <div className={`fdbdfgdfgdf ${!viewType ? "col-lg-12 px-1" : "col-lg-9"}`}>
                                <div className={`iakdpleejwrwerer idewjreporkejrgtgtg d-flex align-items-center ${product.shipping_time.includes("Days") ? "shipping-days" : ""}`}>
                                  <h6><i class="bi me-1 bi-truck"></i> Ships in {product.shipping_time}</h6>

                                  {/* {product.product_category === "READY TO SHIP" && (
                                    <h6><i class="bi me-1 bi-rocket-takeoff"></i> Ready to ship</h6>
                                  )} */}
                                  {product.rts_quantity > '0' && (
                                    <h6><i class="bi me-1 bi-rocket-takeoff"></i> Ready to ship</h6>
                                  )}

                                  {(product.best_seller === '1' || product.best_seller === true) && (
                                    <h6><i class="bi bi-lightning-charge"></i> Best Seller</h6>
                                  )}
                                </div>

                                <h4>{product.product_name}</h4>

                                <div className="d-flex flex-wrap align-items-center">
                                  <h5 className="mb-0">
                                    {formatPrice(product.selling_price)}
                                  </h5> 

                                  <span class="gdfg55 d-flex align-items-center ms-2">
                                    {/* <i class="bi bi-currency-rupee"></i>  */}
                                    {formatPrice(product.mrp_price)}
                                  </span>

                                  <span class="fghfgg114 d-flex align-items-center ms-2">{product?.discount}%OFF</span>
                                </div>

                                <div className="dlksfskjrewrwere d-flex align-items-center justify-content-between mt-5" style={{ top: (onSale || discount) && product?.discount ? "17%" : "3%" }}>
                                  <div className="doikwenirnwekhrwer position-relative">
                                    {user ? (
                                      <>
                                        <button
                                          className="btn-cart mb-1 me-1"
                                          type="button"
                                          onClick={() => addToCart(product.id)}
                                        >
                                          <i class="fa-solid fa-cart-arrow-down"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            toggleWishlist(product.PID)
                                          }
                                        >
                                          <i
                                            className={
                                              wishlistIds.includes(product.PID)
                                                ? "fa-solid fa-heart"
                                                : "fa-regular fa-heart"
                                            }
                                          ></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <Link to="/login">
                                          <button
                                            className="btn-cart mb-1"
                                            type="button"
                                          >
                                            <i class="fa-solid fa-cart-arrow-down"></i>
                                          </button>
                                        </Link>
                                        <Link to="/login">
                                          <button
                                            className="btn-wishlist"
                                            type="button"
                                          >
                                            <i class="fa-regular fa-heart"></i>
                                            <i class="fa-solid d-none fa-heart"></i>
                                          </button>
                                        </Link>
                                      </>
                                    )}
                                  </div>

                                  <div className="dbgdfhgv">
                                    <button className="btn btn-main w-100">
                                      QUICK ADD
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h5>No products found for your search.</h5>

                      <p>Try changing your search or browse other categories.</p>
                    </div>
                  )}
                </div>
                {products?.length > 0 && (
                  <div className="dfgsfsfsfsdf mb-5 d-flex justify-content-center align-items-center">

                    <button
                      className="btn btn-main odjaejiuiewr-nav"
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    <div className="pagination_ff d-flex align-items-center">
                      {getVisiblePages().map(page => (
                        <button
                          key={page}
                          className={`btn btn-main ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageClick(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="btn btn-main odjaejiuiewr-nav"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {allFilterData?.filter_content?.description && (
        <>
          <hr className="doewjirhweiewrer mt-5" />

          <div className="idwejrhewres pb-5 mt-5">
            <div className="container-fluid">
              <div
                className="pt-4"
                dangerouslySetInnerHTML={{
                  __html: allFilterData.filter_content.description,
                }}
              />
            </div>
          </div>
        </>
      )}

      <div className="odjweoijrwer">
        <div onClick={handleResSortByClose} className={`${resSrtByOptions ? "srt-by-backdrop" : "srt-by-backdrop srt-by-backdrop-hidden"} position-fixed w-100 h-100`}></div>

        <div className={`${resSrtByOptions ? "srt-by" : "srt-by srt-by-hide"} position-fixed bg-white`}>
          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="rcmdd"
              value={sortBy || "RECOMMENDED"} 
              checked={sortBy === "RECOMMENDED"}
              // onChange={() => { setSortBy("RECOMMENDED"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);

                setSortBy("RECOMMENDED"); handleResSortByClose()
                
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="rcmdd" className="srt-by-options w-100 p-2">
              <p className="mb-0">Recommended</p>
            </label>
          </div>

          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="na"
              value={sortBy || "NEW_ARRIVAL"} 
              checked={sortBy === "NEW_ARRIVAL"}
              // onChange={() => { setSortBy("NEW_ARRIVALS"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);

                setSortBy("NEW_ARRIVAL"); handleResSortByClose()
                
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="na" className="srt-by-options w-100 p-2">
              <p className="mb-0">New Arrivals</p>
            </label>
          </div>

          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="plth"
              value={sortBy || "BEST_SELLER"} 
              checked={sortBy === "BEST_SELLER"}
              // onChange={() => { setSortBy("BEST_SELLER"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);
                setSortBy("BEST_SELLER"); handleResSortByClose()
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="plth" className="srt-by-options w-100 p-2">
              <p className="mb-0">Best Seller</p>
            </label>
          </div>
          
          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="phtl"
              value={sortBy || "LOW_TO_HIGH"} 
              checked={sortBy === "LOW_TO_HIGH"}
              // onChange={() => { setSortBy("LOW_TO_HIGH"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);
                setSortBy("LOW_TO_HIGH"); handleResSortByClose()
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="phtl" className="srt-by-options w-100 p-2">
              <p className="mb-0">Price Low to High</p>
            </label>
          </div>

          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="dlth"
              checked={sortBy === "HIGH_TO_LOW"}
              value={sortBy || "HIGH_TO_LOW"} 
              // onChange={() => { setSortBy("HIGH_TO_LOW"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);
                setSortBy("HIGH_TO_LOW"); handleResSortByClose()
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="dlth" className="srt-by-options w-100 p-2">
              <p className="mb-0">Price High to Low</p>
            </label>
          </div>

          <div className="deiwhriwehrwe">
            <input
              type="radio"
              name="djikeiewr"
              className="d-none"
              id="dadw"
              value={sortBy || "DISCOUNT_HIGH_TO_LOW"} 
              checked={sortBy === "DISCOUNT_HIGH_TO_LOW"}
              // onChange={() => { setSortBy("DISCOUNT_HIGH_TO_LOW"); handleResSortByClose() }}
              onChange={(e) => {
                setLoading(true);
                setSortBy("DISCOUNT_HIGH_TO_LOW"); handleResSortByClose()
                setTimeout(() => {
                  setLoading(false);
                }, 500);
              }}
            />

            <label htmlFor="dadw" className="srt-by-options w-100 p-2">
              <p className="mb-0">Discount High to Low</p>
            </label>
          </div>
        </div>
      </div>


      <div className="filter-bottom-fixed d-none pt-3 bg-white w-100">
        <div className="d-flex justify-content-around">
          <div className="asdaedweewrr" onClick={handleResSortByToggle}>
            <div className="dowhijhwerr d-flex align-items-center">
              <i className="bi me-2 fa-2x bi-arrow-down-up"></i>

              <div className="doiwejiwejr">
                <h4 className="mb-1">SORT BY</h4>

                <p className="mb-0">Relevance</p>
              </div>
            </div>
          </div>

          <div className="asdaedweewrr" onClick={() => setResFltrMenu(true)}>
            <div className="dowhijhwerr d-flex align-items-center">
              <i class="bi me-2 fa-2x bi-sliders"></i>

              <div className="doiwejiwejr">
                <h4 className="mb-1">FILTER</h4>

                <p className="mb-0">Filter Apply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};