import { useState } from "react";
import { useFilter } from "../../context/FilterContext";

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Loader from "../../components/Loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";


export default function FilterSection({ setResFltrMenu, allFilterMappingdata, filterCategories, category, subcategory, productMinPrice, setFilterLoading }) {
  const { minPrice, maxPrice, setPrice, mainCategory, setMainCategory, subCategory, setSubCategory, filterCategoryCntxt, setFilterCategory, setFilterCategoryName, color, setColor, material, setMaterial, designer, setDesigner, plusSize, setPlusSize, occasion, setOccasion, size, setSize, celebrity, setCelebrity, discount, setDiscount, shippingTime, setShippingTime, resetFilter } = useFilter();
  const [selectedTheme, setSelectedTheme] = useState("");
  const [sbctgry, setSbctgry] = useState(null);
  const [insdSbctgry, setInsdSbctgry] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const { formatPrice, selectedCurrency } = useCurrency();
  const [priceExpand, setPriceExpand] = useState(true);
  const [mainCtgyOptions, setMainCtgyOptions] = useState(true);
  const [closedFilterOptions, setClosedFilterOptions] = useState([]);

  const handleFilterOptionsToggle = (filterOption) => {
    setClosedFilterOptions(prev => prev.includes(filterOption) ? prev.filter(f => f !== filterOption) : [...prev, filterOption]);
  };

  const rate = selectedCurrency?.exchange_rate_to_inr || 1;
  const currencyData = formatPrice(0, { returnParts: true });

  const currencySymbol = currencyData.symbol;

  // Converted display values
  // const minDisplay = Math.floor(minPrice / rate);
  const minDisplay = Math.floor(
    (minPrice === 0 ? productMinPrice : minPrice) / rate
  );
  const maxDisplay = Math.floor(maxPrice / rate);

  // console.log(filterCategories, 'filterCategories');

  // console.log(category);

  const selectedCategory = filterCategories?.find(
    item =>
      item?.mainCategory_slug?.toLowerCase() === category?.toLowerCase()
  );

    // eslint-disable-next-line
  const hasSubCategories = selectedCategory?.sub_categories?.length > 0;


  const toggleFilterExpand = (filterOption) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterOption]: !prev[filterOption]
    }));
  };

  // console.log(allFilterMappingdata, "hi");


  const toTitleCase = (str = "") =>
    str
      .replace(/[-_]/g, " ") // remove underscores/hyphens
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const handleSelect = (filterType, value) => {

    if (window.innerWidth > 991) {
      setLoading(true);
    }
    switch (filterType.toLowerCase()) {
      case "color":
        setColor(value);
        break;

      case "material":
        setMaterial(value);
        break;

      case "designers":
        setDesigner(value);
        break;

      case "plus_sizes":
        // setPlusSize(value);
        // break;
        setPlusSize(value);
        break;

      case "occasion":
        setOccasion(value);
        break;

      case "size":
        case "sizes":
        setSize(value);
        break;

      case "celebrity":
        setCelebrity(value);
        break;

      case "shipping_time":
        setShippingTime(value);
        break;

      case "discount":
        setDiscount(value);
        break;

      case "filter_category_name":
        setFilterCategoryName(value);
        break;

      default:
        break;
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }


  const handleSbctgry = (id) => {
    setSbctgry(prevId => (prevId === id ? null : id));
  }

  const handleInSbctgry = (id) => {
    setInsdSbctgry(prevSbCtgry => (prevSbCtgry === id ? null : id));
  }

  const handleResponsiveClearFilter = () => {
    // resetFilter();
    // setResFltrMenu(false);

      setFilterLoading(true);

      resetFilter();

      setTimeout(() => {
        setResFltrMenu(false);
        setFilterLoading(false);
      }, 1000);

  }

  const applyFilterResponsive = () => {
    setFilterLoading(true);

      setTimeout(() => {
        setResFltrMenu(false);
        setFilterLoading(false);
      }, 1000);
  }


  const priceGap = 500;
  const maxRange = 1000000;

  const handleMinInput = (e) => {
    const value = e.target.value; // keep as string so user can type
    setPrice(Number(value), maxPrice); // temporarily update
  };

  // Handle max input change (allow typing freely)
  // const handleMaxInput = (e) => {
  //   const value = e.target.value;
  //   if (value === "") {
  //     setPrice(minPrice, "");
  //     return;
  //   }
  //   setPrice(minPrice, Number(value));
  // };
  const handleMaxInput = (e) => {
    let value = Number(e.target.value);

    if (isNaN(value)) return;
    if (value > maxRange) value = maxRange;

    // Maintain price gap
    if (value < minPrice + priceGap) {
      value = minPrice + priceGap;
    }
    setPrice(minPrice, value);
  };

  // Handle min slider range change
  const handleMinRange = (e) => {
    const value = Number(e.target.value);
    if (maxPrice - value >= priceGap) {
      setPrice(value, maxPrice);
    }
  };

  // Handle max slider range change
  const handleMaxRange = (e) => {
    const value = Number(e.target.value);
    if (value - minPrice >= priceGap) {
      setPrice(minPrice, value);
    }
  };

  // Enforce priceGap on blur or Enter
  const handleMinBlur = () => {
    let value = minPrice;
    if (value < 0) value = 0;
    if (value > maxPrice - priceGap) value = maxPrice - priceGap;
    // setPrice(value, maxPrice);
    applyPriceFilter(value, maxPrice);
  };

  const handleMaxBlur = () => {
    let value = Number(maxPrice);
    if (isNaN(value)) value = minPrice + priceGap;
    if (value > maxRange) value = maxRange;
    if (value < minPrice + priceGap) value = minPrice + priceGap;
    // setPrice(minPrice, value);
    applyPriceFilter(minPrice, value);
  };


  const handleMinEnter = (e) => {
    if (e.key === "Enter") handleMinBlur();
  };

  const handleMaxEnter = (e) => {
    if (e.key === "Enter") handleMaxBlur();
  };

  const applyPriceFilter = (min, max) => {
    if (window.innerWidth > 991) {
      setLoading(true);
    }
    setPrice(min, max);

    // stop loader after filter completes
    setTimeout(() => {
      setLoading(false);
    }, 1000); // replace with API response
  };

  if (loading) {
    return <Loader />;
  }


  return (
    <>
      <div>
        <div className="iushifjsdfsd">
          <div className="dkewjriwehrnjhweijrwer mb-4">
            <div className="disenihrenjr mb-3 pt-4 pb-3 d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Price</h5>

              <i onClick={() => setPriceExpand(prev => !prev)} className={`bi ${priceExpand ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </div>

            {priceExpand && (
              <div className="dohwekrjiwejr">
                <div className="wrapper">
                  <div className="price-input justify-content-between">
                    <div className="field">
                      <span>{currencySymbol}</span>

                      <div className="dioeuhiewrwer">
                        <span>Minimum</span>

                        <input
                          type="number"
                          value={minDisplay}
                          onChange={handleMinInput}
                          onBlur={handleMinBlur}
                          onKeyDown={handleMinEnter}
                        />
                      </div>
                    </div>

                    <div className="field">
                      <span>{currencySymbol}</span>

                      <div className="dioeuhiewrwer">
                        <span>Maximum</span>

                        {/* <input
                          type="number"
                          value={maxPrice}
                          min={minPrice + priceGap}
                          max={maxRange}
                          onChange={handleMaxInput}
                          onBlur={handleMaxBlur}
                          onKeyDown={handleMaxEnter}
                        /> */}
                        <input
                          type="number"
                          value={maxDisplay}
                          min={minPrice + priceGap}
                          max={maxRange}
                          onChange={handleMaxInput}
                          onBlur={handleMaxBlur}
                          onKeyDown={handleMaxEnter}
                          onWheel={(e) => e.target.blur()}/>
                      </div>
                    </div>
                  </div>

                  <div className="slider">
                    <div className="progress" style={{ left: `${(minPrice / maxRange) * 100}%`, right: `${100 - (maxPrice / maxRange) * 100}%` }}></div>
                  </div>

                  <div className="range-input">
                    <input
                      type="range"
                      min={productMinPrice}
                      max={maxRange}
                      value={minPrice === 0 ? productMinPrice : minPrice}
                      onChange={handleMinRange}
                      onMouseUp={() => applyPriceFilter(minPrice, maxPrice)}
                      onTouchEnd={() => applyPriceFilter(minPrice, maxPrice)}
                    />
                    <input
                      type="range"
                      min={productMinPrice}
                      max={maxRange}
                      value={maxPrice}
                      onChange={handleMaxRange}
                      onMouseUp={() => applyPriceFilter(minPrice, maxPrice)}
                      onTouchEnd={() => applyPriceFilter(minPrice, maxPrice)}
                    />
                  </div>

                  <div className="diwenjriwejrjhwer d-flex align-items-center justify-content-between mt-3">
                    <span>{currencySymbol}&nbsp;{Number(minDisplay).toLocaleString("en-IN")}</span>
                    <span>{currencySymbol}&nbsp;{Number(maxDisplay).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* {(category === "all-products" || hasSubCategories) && ( */}
            <div className="dkewjriwehrnjhweijrwer mb-4">
              <div className="disenihrenjr mb-3 pt-4 pb-3 d-flex align-items-center justify-content-between">
                <h5 className="mb-0">
                  {/* {category === "all-products"
                  ? "Main Categories"
                  : category && subcategory
                  ? `${category.replace(/-/g, " ")} - ${subcategory.replace(/-/g, " ")}`
                  : category} */}

                  {
                    category === "all-products"
                      ? "Main Categories"
                      : subcategory
                        ? "Sub Categories"
                        : category
                          ? "Main Categories"
                          : ""
                  }
                </h5>

                <i onClick={() => setMainCtgyOptions(prev => !prev)} className={`bi ${mainCtgyOptions ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
              </div>

              {mainCtgyOptions && (
                <div className="deowjnkrwere bdfgsdfseewewrr">
                  {filterCategories.map(filterCategory => {
                    const currentPath = window.location.pathname.toLowerCase().replace("/", "");
                    const mainCategorySlug = (filterCategory.mainCategory_slug || "").toLowerCase();
                    const urlParts = currentPath.split("/");
                    const urlMain = urlParts[0];
                    const urlSub = urlParts[1] || null;

                    const isAllProducts = currentPath.includes("all-products");
                    const isnewIn = currentPath.includes("new-in");
                    const isreadyToShip = currentPath.includes("ready-to-ship");
                    const iseidStore = currentPath.includes("eid-store");

                    const showMainCategory = isAllProducts || isnewIn || isreadyToShip || iseidStore || mainCategorySlug === urlMain;
                    if (!showMainCategory) return null;

                    const isSubCategoryURL = !!urlSub;

                    // Auto-expand correct category
                    const expandedCategoryId = isAllProducts
                      ? sbctgry
                      : filterCategories.find(fc => fc.mainCategory_slug.toLowerCase() === urlMain)?.id;

                    return (
                      <div key={filterCategory.id} className="doewjkrnhweiurwer mb-2">
                        {filterCategory.sub_categories.length > 0 && (
                          <div className="duiwehijnwerwer">
                            <div className="main-catgry-filter px-2">
                              <div className="radio-wrapper-5">
                                <div className="oijdmeiojewrer d-flex justify-content-between w-100 align-items-center">

                                  {/* HIDE MAIN CATEGORY LABEL & PLUS/MINUS WHEN URL HAS SUBCATEGORY */}
                                  {!isSubCategoryURL && mainCategorySlug !== currentPath && (
                                    <>
                                      <div className="doiwejirwer d-flex align-items-center">
                                        <div className="cdwehjirnweijrowejrowejr">
                                          <div className="checkbox-wrapper-33">
                                            <label htmlFor={`mnctgry-${filterCategory.id}`} className="checkbox">
                                              <input
                                                id={`mnctgry-${filterCategory.id}`}
                                                onChange={() => setMainCategory(filterCategory.mainCategory_name.toLowerCase())}
                                                // checked={mainCategory.includes(filterCategory.mainCategory_name.toLowerCase())}
                                                checked={mainCategory === filterCategory.mainCategory_name.toLowerCase()}
                                                value={filterCategory.mainCategory_name.toLowerCase()}
                                                className="checkbox__trigger visuallyhidden"
                                                type="checkbox"
                                              />
                                              <span className="checkbox__symbol">
                                                <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                                  <path d="M4 14l8 7L24 7"></path>
                                                </svg>
                                              </span>
                                              <p className="checkbox__textwrapper">{filterCategory.mainCategory_name}</p>
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      {filterCategory.sub_categories.length > 0 && (
                                        <i
                                          onClick={() => handleSbctgry(filterCategory.id)}
                                          className={`fa-solid ${(sbctgry === filterCategory.id || expandedCategoryId === filterCategory.id) ? "fa-minus" : "fa-plus"}`}
                                        ></i>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* SUBCATEGORY LIST */}
                              {(sbctgry === filterCategory.id || expandedCategoryId === filterCategory.id) && (
                                <div className="sub-catgry-filter indiewjrwerewr">
                                  {filterCategory.sub_categories
                                    .filter(sub => !isSubCategoryURL || sub?.subCategories_slug?.toLowerCase() === urlSub)
                                    .map((sub_category, index) => {
                                      const mainSlug = filterCategory.mainCategory_name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-");

                                      const subSlug = sub_category.subCategories_name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-");

                                      // const exactPath = `${mainSlug}/${subSlug}`;
                                      const exactPath = `${subSlug}`;

                                      // const isChecked = subCategory?.includes(exactPath);
                                      const isChecked = subCategory === exactPath;

                                      return (
                                        <div className="doewjroijwerwer mb-3" key={sub_category?.id || index}>
                                          <div className={`radio-wrapper-5 ${!isSubCategoryURL && mainCategorySlug !== currentPath ? "ps-3" : ""} justify-content-between align-items-center ${(sub_category?.subCategories_slug === urlSub) ? "d-none" : ""}`}>

                                            {/* ✅ SUBCATEGORY CHECKBOX */}
                                            {sub_category?.subCategories_name && !isSubCategoryURL && (
                                              <div className="doiwejirwer d-flex align-items-center">
                                                <div className="cdwehjirnweijrowejrowejr">
                                                  <div className="checkbox-wrapper-33">
                                                    <label htmlFor={`sbctgry-${sub_category.id}`} className="checkbox">
                                                      <input
                                                        id={`sbctgry-${sub_category.id}`}
                                                        onChange={() => setSubCategory(mainSlug, subSlug)}
                                                        checked={isChecked}
                                                        value={subSlug}
                                                        className="checkbox__trigger visuallyhidden"
                                                        type="checkbox"
                                                      />
                                                      <span className="checkbox__symbol">
                                                        <svg aria-hidden="true" className="icon-checkbox" width="28" height="28" viewBox="0 0 28 28">
                                                          <path d="M4 14l8 7L24 7"></path>
                                                        </svg>
                                                      </span>
                                                      <p className="checkbox__textwrapper">
                                                        {sub_category.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                                      </p>
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* ✅ PLUS/MINUS TOGGLE - ALWAYS SHOWS */}
                                            {!isSubCategoryURL && sub_category?.filter_categories?.length > 0 && (
                                              <div className="oijdmeiojewrer">
                                                <i
                                                  onClick={() => handleInSbctgry(sub_category.id)}
                                                  className={`fa-solid ${(insdSbctgry === sub_category.id) ? "fa-minus" : "fa-plus"}`}
                                                />
                                              </div>
                                            )}
                                          </div>

                                          {/* ✅ FILTER CATEGORIES - FIXED CONDITION */}
                                          {(insdSbctgry === sub_category.id || sub_category?.subCategories_slug === urlSub) && (
                                            <div className={`inside-sub-catgry-filter ${!isSubCategoryURL && sub_category?.filter_categories?.length > 0 ? "ps-3" : ""}`}>
                                              {sub_category.filter_categories.map(filter_category => {
                                                // eslint-disable-next-line
                                                const mainSlug = filterCategory.mainCategory_name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-");
                                                // eslint-disable-next-line
                                                  const subSlug = sub_category.subCategories_name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-");

                                                  const filterSlug = filter_category.filterCategories_name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-");

                                                  // const filterPath = `${mainSlug}/${subSlug}/${filterSlug}`;
                                                  const filterPath = `${filterSlug}`;

                                                return (
                                                  <div key={filter_category.id} className={`radio-wrapper-5 ${!isSubCategoryURL && sub_category.filter_categories.length > 0 ? "ps-3" : ""} mb-3 justify-content-between align-items-center`}>
                                                    <div className="doiwejirwer d-flex align-items-center">
                                                      <div className="cdwehjirnweijrowejrowejr">
                                                        <div className="checkbox-wrapper-33">
                                                          <label htmlFor={`insd-sb-ctgry-${filter_category.id}`} className="checkbox">
                                                            <input
                                                              onChange={() => setFilterCategory(
                                                                filterCategory.mainCategory_name.toLowerCase(),
                                                                sub_category.subCategories_name.toLowerCase(),
                                                                filter_category.filterCategories_name.toLowerCase()
                                                              )}
                                                              // checked={filterCategoryCntxt?.includes(filterPath)}
                                                              checked={filterCategoryCntxt === filterPath}
                                                              value={filter_category.filterCategories_name.toLowerCase()}
                                                              id={`insd-sb-ctgry-${filter_category.id}`}
                                                              className="checkbox__trigger visuallyhidden"
                                                              type="checkbox"
                                                            />
                                                            <span className="checkbox__symbol">
                                                              <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                                                <path d="M4 14l8 7L24 7"></path>
                                                              </svg>
                                                            </span>
                                                            <p className="checkbox__textwrapper">{filter_category.filterCategories_name}</p>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          {/* // )} */}

          {/* {allFilterMappingdata?.filter(item => item.filter_option !== 'filter_category_name').map((FilterMappingdata) => { */}
          {allFilterMappingdata?.filter(item => 
                item.filter_option !== 'filter_category_name' &&
                item.filter_values &&
                item.filter_values.trim() !== ""
              ).map((FilterMappingdata) => {
            const totalValues = FilterMappingdata.filter_values.split(",").length;
            const isExpanded = expandedFilters[FilterMappingdata.filter_option] || false;
            const valuesToShow = isExpanded ? totalValues : 6;

            return (
              <div key={FilterMappingdata.id} className="dkewjriwehrnjhweijrwer mb-4">
                <div className="disenihrenjr mb-3 pb-3 d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">
                    {/* {FilterMappingdata?.filter_option === 'filter_category_name'
                      ? 'Categories (F)'
                      : toTitleCase(FilterMappingdata?.filter_option || '')
                    } */}
                    {
                      FilterMappingdata?.filter_option === 'filter_category_name'
                        ? 'Categories (F)'
                        : FilterMappingdata?.filter_option === 'celebrity'
                          ? 'Styles'
                          : toTitleCase(FilterMappingdata?.filter_option || '')
                    }
                  </h5>

                  <i onClick={() => handleFilterOptionsToggle(FilterMappingdata.filter_option)} className={`bi ${closedFilterOptions.includes(FilterMappingdata.filter_option) ? "bi-chevron-down" : "bi-chevron-up" }`}></i>
                </div>

                {!closedFilterOptions.includes(FilterMappingdata.filter_option) && (
                  <>
                    <div className="doewjkrnhweiurwer bdfgsdfseewewrr">
                      {(FilterMappingdata.filter_option || "").toLowerCase() === "color" ? (
                        FilterMappingdata.colors?.slice(0, valuesToShow).map((colorObj, index) => {
                          const colorValue = colorObj.color_name;
                          const colorCode = colorObj.color_code;

                          return (
                            
                            <div className="doewjkrnhweiurwer clor-fltr-optn" key={index}>
                              <div className="cdwehjirnweijrowejrowejr">
                                <div className="checkbox-wrapper-33">
                                  <label htmlFor={colorValue} className={`checkbox ${(selectedTheme === colorCode) ? "clr-label" : ""} mb-2 px-2 py-1`}>
                                    <input
                                      onChange={() => { setSelectedTheme(colorCode); handleSelect("color", colorValue.toLowerCase()) }}
                                      data-color={colorValue}
                                      id={colorValue}
                                      // checked={color?.includes(colorValue.toLowerCase()) || false}
                                      checked={color === colorValue.toLowerCase()}
                                      name={FilterMappingdata.filter_option}
                                      className="checkbox__trigger visuallyhidden"
                                      type="checkbox"
                                    />
                                    <span className="checkbox__symbol">
                                      <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                      </svg>
                                    </span>
                                    <div className="dijwehirwer rounded-pill me-2" style={{ background: colorCode, border: "1px solid #b0bec5" }}></div>
                                    <p className="checkbox__textwrapper">{colorValue}</p>
                                  </label>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (

                      FilterMappingdata.filter_values
                        .split(",")
                        .map(item => item.trim())
                        .filter(item => item !== "")
                        .slice(0, valuesToShow)
                        .map((item, indexdsvd) => {

                        // FilterMappingdata.filter_values
                        //   .split(",")
                        //   .slice(0, valuesToShow)
                        //   .map((item, indexdsvd) => {
                            // const trimmedValue = (item || "").trim().toLowerCase();
                            if (typeof item !== "string") return null;

                            const trimmedValue = item.trim().toLowerCase();
                            const safeId = `${FilterMappingdata.filter_option}-${trimmedValue}-${indexdsvd}`;

                            let isChecked = false;

                            // Make filter_option lowercase for safety
                            const filterKey = FilterMappingdata.filter_option.toLowerCase();

                            if (filterKey === "material") {
                              // isChecked = material.includes(trimmedValue);
                              isChecked = material === trimmedValue.trim()
                                          .toLowerCase()
                                          .replace(/ /g, "-");
                            } else if (filterKey === "designers") {
                              // isChecked = designer.includes(trimmedValue);
                              isChecked = designer === trimmedValue;
                            } else if (filterKey === "plus_sizes") {
                              isChecked = plusSize === trimmedValue;
                              // isChecked = Array.isArray(plusSize) && plusSize.includes(trimmedValue);
                            } else if (filterKey === "occasion") {
                              // isChecked = occasion.includes(trimmedValue);
                              isChecked = occasion === trimmedValue.trim()
                                          .toLowerCase()
                                          .replace(/ /g, "-");
                            } else if (filterKey === "size" || filterKey === "sizes") {
                              // isChecked = size.includes(trimmedValue);
                              isChecked = size === trimmedValue;
                            } else if (filterKey === "celebrity") {
                              // isChecked = celebrity.includes(trimmedValue);
                              isChecked = celebrity === trimmedValue.trim()
                                          .toLowerCase()
                                          .replace(/ /g, "-");
                            } else if(filterKey === "discount") {
                              // isChecked = discount.includes(trimmedValue);
                              // isChecked = discount === trimmedValue;

                              const cleanValue = item
                                .replace(/%/g, "")
                                .replace(/\s+/g, "");

                              isChecked = discount === cleanValue;

                            } else if (filterKey === "shipping_time") {
                              // isChecked = shippingTime.includes(trimmedValue);
                              isChecked = shippingTime === trimmedValue.trim()
                                          .toLowerCase()
                                          .replace(/ /g, "-");
                            }

                            return (
                              <div key={`${FilterMappingdata.id}-${indexdsvd}`} className="radio-wrapper-5 px-2 mb-2">
                                <div className="cdwehjirnweijrowejrowejr">
                                  <div className="checkbox-wrapper-33">
                                    <label htmlFor={safeId} className="checkbox">
                                      <input
                                        id={safeId} 
                                        name={FilterMappingdata.filter_option}
                                        value={trimmedValue}
                                        type="checkbox"
                                        className="checkbox__trigger visuallyhidden"
                                        checked={isChecked}
                                        onChange={() => handleSelect(FilterMappingdata.filter_option, trimmedValue)}
                                      />
                                      <span className="checkbox__symbol">
                                        <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                          <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                      </span>
                                      <p className="checkbox__textwrapper">{item.trim()}</p>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {totalValues > 6 && (
                      <div
                        className="dokeawhiruwerwer_more ms-4"
                        onClick={() => toggleFilterExpand(FilterMappingdata.filter_option)}
                      >
                        {isExpanded ? "Show Less" : `+${totalValues - 6} more`}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="dweihruiwehrjnwer d-none">
          <div className="hgbdfbgbeedcfbrr d-flex align-items-center justify-content-between p-3">
            <h4 className="mb-0">Refine</h4>

            <i class="fa-solid fa-xmark" onClick={() => setResFltrMenu(false)}></i>
          </div>

          <div className="idjweihewr">
            <Tab.Container id="left-tabs-example" defaultActiveKey="resfilter-price-range">
              <Row className="h-100 gx-3">
                <Col xs={4}>
                  <Nav variant="pills" className="dfgefsertttt sticky-top flex-column h-100">
                    <Nav.Item>
                      <Nav.Link eventKey="resfilter-price-range">
                        <div className="disenihrenjr">
                          <p className="mb-0">Price</p>
                        </div>                        
                      </Nav.Link>
                    </Nav.Item>
                    
                    {/* {(category === "all-products" || hasSubCategories) && ( */}
                      <Nav.Item>
                        <Nav.Link eventKey="resfilter-categories">
                          <div className="disenihrenjr">
                            <p className="mb-0">
                              {/* {category === "all-products"
                                ? "Main Categories"
                                : category && subcategory
                                ? `${category.replace(/-/g, " ")} - ${subcategory.replace(/-/g, " ")}`
                                : category} */}

                              {
                                category === "all-products"
                                  ? "Main Categories"
                                  : subcategory
                                    ? "Sub Categories"
                                    : category
                                      ? "Main Categories"
                                      : ""
                              }
                            </p>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    {/* )} */}

                    {allFilterMappingdata?.filter(item => item.filter_option !== 'filter_category_name').map((FilterMappingdata) => {
                      
                      return (
                        <Nav.Item key={FilterMappingdata.id}>
                          <Nav.Link eventKey={`resfilter-${FilterMappingdata.filter_option}`}>
                            <div className="disenihrenjr">
                              <p className="mb-0">
                                {
                                  FilterMappingdata?.filter_option === 'filter_category_name'
                                    ? 'Categories (F)'
                                    : FilterMappingdata?.filter_option === 'celebrity'
                                      ? 'Styles'
                                      : toTitleCase(FilterMappingdata?.filter_option || '')
                                }
                              </p>
                            </div>
                          </Nav.Link>
                        </Nav.Item>
                      );   
                    })}
                  </Nav>
                </Col>

                <Col xs={8}>
                  <Tab.Content className="py-4">
                    <Tab.Pane className="h-100" eventKey="resfilter-price-range">
                      <div className="dohwekrjiwejr">
                        <div className="wrapper">
                          <div className="price-input justify-content-between">
                            <div className="field">
                              <span>{currencySymbol}</span>

                              <div className="dioeuhiewrwer">
                                <span>Minimum</span>

                                <input
                                  type="number"
                                  value={minDisplay}
                                  onChange={handleMinInput}
                                  onBlur={handleMinBlur}
                                  onKeyDown={handleMinEnter}
                                />
                              </div>
                            </div>

                            <div className="field">
                              <span>{currencySymbol}</span>

                              <div className="dioeuhiewrwer">
                                <span>Maximum</span>

                                {/* <input
                        type="number"
                        value={maxPrice}
                        min={minPrice + priceGap}
                        max={maxRange}
                        onChange={handleMaxInput}
                        onBlur={handleMaxBlur}
                        onKeyDown={handleMaxEnter}
                      /> */}
                                <input
                                  type="number"
                                  value={maxDisplay}
                                  min={minPrice + priceGap}
                                  max={maxRange}
                                  onChange={handleMaxInput}
                                  onBlur={handleMaxBlur}
                                  onKeyDown={handleMaxEnter}
                                  onWheel={(e) => e.target.blur()} />
                              </div>
                            </div>
                          </div>

                          <div className="slider">
                            <div className="progress" style={{ left: `${(minPrice / maxRange) * 100}%`, right: `${100 - (maxPrice / maxRange) * 100}%` }}></div>
                          </div>

                          <div className="range-input">
                            <input
                              type="range"
                              min={0}
                              max={maxRange}
                              value={minPrice}
                              onChange={handleMinRange}
                              onMouseUp={() => applyPriceFilter(minPrice, maxPrice)}
                              onTouchEnd={() => applyPriceFilter(minPrice, maxPrice)}
                            />
                            <input
                              type="range"
                              min={0}
                              max={maxRange}
                              value={maxPrice}
                              onChange={handleMaxRange}
                              onMouseUp={() => applyPriceFilter(minPrice, maxPrice)}
                              onTouchEnd={() => applyPriceFilter(minPrice, maxPrice)}
                            />
                          </div>

                          <div className="diwenjriwejrjhwer d-flex align-items-center justify-content-between mt-3">
                            {/* <span>{currencySymbol}{minDisplay}</span> */}
                            <span>{currencySymbol}{Number(minDisplay).toLocaleString("en-IN")}</span>
                            <span>{currencySymbol}{Number(maxDisplay).toLocaleString("en-IN")}</span>

                            {/* <span>{currencySymbol}{maxDisplay}</span> */}
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    
                    <Tab.Pane className="h-100" eventKey="resfilter-categories">
                      <div className="deowjnkrwere bdfgsdfseewewrr">
                        {filterCategories.map(filterCategory => {
                          const currentPath = window.location.pathname.toLowerCase().replace("/", "");
                          const mainCategorySlug = (filterCategory.mainCategory_slug || "").toLowerCase();
                          const urlParts = currentPath.split("/");
                          const urlMain = urlParts[0];
                          const urlSub = urlParts[1] || null;

                          // console.log(currentPath, 'currentPath');

                          const isAllProducts = currentPath.includes("all-products");
                          const isnewIn = currentPath.includes("new-in");
                          const isreadyToShip = currentPath.includes("ready-to-ship");
                          const iseidStore = currentPath.includes("eid-store");

                          // const showMainCategory = isAllProducts || mainCategorySlug === urlMain;
                          const showMainCategory = isAllProducts || isnewIn || isreadyToShip || iseidStore || mainCategorySlug === urlMain;
                          // if (!showMainCategory) return null;
                          if (!showMainCategory) return null;

                          const isSubCategoryURL = !!urlSub;

                          // Auto-expand correct category
                          const expandedCategoryId = isAllProducts
                            ? sbctgry
                            : filterCategories.find(fc => fc.mainCategory_slug.toLowerCase() === urlMain)?.id;
             
                          return (
                            <div key={filterCategory.id} className="doewjkrnhweiurwer mb-2">
                              {filterCategory.sub_categories.length > 0 && (
                                <div className="duiwehijnwerwer">
                                  <div className="main-catgry-filter px-2">
                                    <div className="radio-wrapper-5">
                                      <div className="oijdmeiojewrer d-flex justify-content-between w-100 align-items-center">

                                        {/* HIDE MAIN CATEGORY LABEL & PLUS/MINUS WHEN URL HAS SUBCATEGORY */}
                                        {!isSubCategoryURL && mainCategorySlug !== currentPath && (
                                          <>
                                            <div className="doiwejirwer d-flex align-items-center">
                                              <div className="cdwehjirnweijrowejrowejr">
                                                <div className="checkbox-wrapper-33">
                                                  <label htmlFor={`mnctgry-${filterCategory.id}`} className="checkbox">
                                                    <input
                                                      id={`mnctgry-${filterCategory.id}`}
                                                      onChange={() => setMainCategory(filterCategory.mainCategory_name.toLowerCase())}
                                                      // checked={mainCategory.includes(filterCategory.mainCategory_name.toLowerCase())}
                                                      checked={mainCategory === filterCategory.mainCategory_name.toLowerCase()}
                                                      value={filterCategory.mainCategory_name.toLowerCase()}
                                                      className="checkbox__trigger visuallyhidden"
                                                      type="checkbox"
                                                    />
                                                    <span className="checkbox__symbol">
                                                      <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                                        <path d="M4 14l8 7L24 7"></path>
                                                      </svg>
                                                    </span>
                                                    <p className="checkbox__textwrapper">{filterCategory.mainCategory_name}</p>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            {filterCategory.sub_categories.length > 0 && (
                                              <i
                                                onClick={() => handleSbctgry(filterCategory.id)}
                                                className={`fa-solid ${(sbctgry === filterCategory.id || expandedCategoryId === filterCategory.id) ? "fa-minus" : "fa-plus"}`}
                                              ></i>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* SUBCATEGORY LIST */}
                                    {(sbctgry === filterCategory.id || expandedCategoryId === filterCategory.id) && (
                                      <div className="sub-catgry-filter indiewjrwerewr">
                                        {filterCategory.sub_categories
                                          .filter(sub => !isSubCategoryURL || sub?.subCategories_slug?.toLowerCase() === urlSub)
                                          .map((sub_category, index) => {
                                            const mainSlug = filterCategory.mainCategory_name
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-");

                                            const subSlug = sub_category.subCategories_name
                                              .toLowerCase()
                                              .replace(/\s+/g, "-");

                                            // const exactPath = `${mainSlug}/${subSlug}`;
                                            const exactPath = `${subSlug}`;

                                            // const isChecked = subCategory?.includes(exactPath);
                                            const isChecked = subCategory === exactPath;

                                            return (
                                              <div className="doewjroijwerwer mb-3" key={sub_category?.id || index}>
                                                <div className={`radio-wrapper-5 ${!isSubCategoryURL && mainCategorySlug !== currentPath ? "ps-3" : ""} justify-content-between align-items-center ${(sub_category?.subCategories_slug === urlSub) ? "d-none" : ""}`}>

                                                  {/* ✅ SUBCATEGORY CHECKBOX */}
                                                  {sub_category?.subCategories_name && !isSubCategoryURL && (
                                                    <div className="doiwejirwer d-flex align-items-center">
                                                      <div className="cdwehjirnweijrowejrowejr">
                                                        <div className="checkbox-wrapper-33">
                                                          <label htmlFor={`sbctgry-${sub_category.id}`} className="checkbox">
                                                            <input
                                                              id={`sbctgry-${sub_category.id}`}
                                                              onChange={() => setSubCategory(mainSlug, subSlug)}
                                                              checked={isChecked}
                                                              value={subSlug}
                                                              className="checkbox__trigger visuallyhidden"
                                                              type="checkbox"
                                                            />
                                                            <span className="checkbox__symbol">
                                                              <svg aria-hidden="true" className="icon-checkbox" width="28" height="28" viewBox="0 0 28 28">
                                                                <path d="M4 14l8 7L24 7"></path>
                                                              </svg>
                                                            </span>
                                                            <p className="checkbox__textwrapper">
                                                              {sub_category.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                                            </p>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* ✅ PLUS/MINUS TOGGLE - ALWAYS SHOWS */}
                                                  {!isSubCategoryURL && sub_category?.filter_categories?.length > 0 && (
                                                    <div className="oijdmeiojewrer">
                                                      <i
                                                        onClick={() => handleInSbctgry(sub_category.id)}
                                                        className={`fa-solid ${(insdSbctgry === sub_category.id) ? "fa-minus" : "fa-plus"}`}
                                                      />
                                                    </div>
                                                  )}
                                                </div>

                                                {/* ✅ FILTER CATEGORIES - FIXED CONDITION */}
                                                {(insdSbctgry === sub_category.id || sub_category?.subCategories_slug === urlSub) && (
                                                  <div className={`inside-sub-catgry-filter ${!isSubCategoryURL && sub_category?.filter_categories?.length > 0 ? "ps-3" : ""}`}>
                                                    {sub_category.filter_categories.map(filter_category => {
                                                      // eslint-disable-next-line
                                                      const mainSlug = filterCategory.mainCategory_name
                                                          .toLowerCase()
                                                          .replace(/\s+/g, "-");
                                                      // eslint-disable-next-line
                                                        const subSlug = sub_category.subCategories_name
                                                          .toLowerCase()
                                                          .replace(/\s+/g, "-");

                                                        const filterSlug = filter_category.filterCategories_name
                                                          .toLowerCase()
                                                          .replace(/\s+/g, "-");

                                                        // const filterPath = `${mainSlug}/${subSlug}/${filterSlug}`;
                                                        const filterPath = `${filterSlug}`;

                                                      return (
                                                        <div key={filter_category.id} className={`radio-wrapper-5 ${!isSubCategoryURL && sub_category.filter_categories.length > 0 ? "ps-3" : ""} mb-3 justify-content-between align-items-center`}>
                                                          <div className="doiwejirwer d-flex align-items-center">
                                                            <div className="cdwehjirnweijrowejrowejr">
                                                              <div className="checkbox-wrapper-33">
                                                                <label htmlFor={`insd-sb-ctgry-${filter_category.id}`} className="checkbox">
                                                                  <input
                                                                    onChange={() => setFilterCategory(
                                                                      filterCategory.mainCategory_name.toLowerCase(),
                                                                      sub_category.subCategories_name.toLowerCase(),
                                                                      filter_category.filterCategories_name.toLowerCase()
                                                                    )}
                                                                    // checked={filterCategoryCntxt?.includes(filterPath)}
                                                                    checked={filterCategoryCntxt === filterPath}
                                                                    value={filter_category.filterCategories_name.toLowerCase()}
                                                                    id={`insd-sb-ctgry-${filter_category.id}`}
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                  />
                                                                  <span className="checkbox__symbol">
                                                                    <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                                                      <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                  </span>
                                                                  <p className="checkbox__textwrapper">{filter_category.filterCategories_name}</p>
                                                                </label>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Tab.Pane>

                    {allFilterMappingdata?.map((FilterMappingdata, dvbfbxdfbg) => (
                      <Tab.Pane eventKey={`resfilter-${FilterMappingdata.filter_option}`}>
                        <div className="doewjkrnhweiurwer bdfgsdfseewewrr">
                          {(FilterMappingdata.filter_option || "").toLowerCase() === "color" ? (
                            FilterMappingdata.colors?.map((colorObj, index) => {
                              const colorValue = colorObj.color_name; 
                              const colorCode = colorObj.color_code; 
                              return (
                                <div className="doewjkrnhweiurwer clor-fltr-optn" key={index}>
                                  <div className="cdwehjirnweijrowejrowejr">
                                    <div className="checkbox-wrapper-33">
                                      <label htmlFor={colorValue} className={`checkbox ${(selectedTheme === colorCode) ? "clr-label" : ""} mb-2 px-2 py-1`}>
                                        <input
                                          onChange={() => { setSelectedTheme(colorCode); handleSelect("color", colorValue.toLowerCase()) }}
                                          data-color={colorValue}
                                          id={colorValue}
                                          // checked={color?.includes(colorValue.toLowerCase()) || false}
                                          checked={color === colorValue.toLowerCase()}
                                          name={FilterMappingdata.filter_option}
                                          className="checkbox__trigger visuallyhidden"
                                          type="checkbox"
                                        />
                                        <span className="checkbox__symbol">
                                          <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 14l8 7L24 7"></path>
                                          </svg>
                                        </span>
                                        <div className="dijwehirwer rounded-pill me-2" style={{ background: colorCode, border: "1px solid #b0bec5" }}></div>
                                        <p className="checkbox__textwrapper">{colorValue}</p>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (

                            FilterMappingdata.filter_values
                                .split(",")
                                .map(item => item.trim())
                                .filter(item => item !== "")
                                // .slice(0, valuesToShow)
                                .map((item, indexdsvd) =>{

                            // FilterMappingdata.filter_values
                            //   .split(",")
                            //   .map((item, indexdsvd) => {
                                // const trimmedValue = (item || "").trim().toLowerCase();
                                if (typeof item !== "string") return null;

                                const trimmedValue = item.trim().toLowerCase();
                                const safeId = `${FilterMappingdata.filter_option}-${trimmedValue}-${indexdsvd}`;

                                let isChecked = false;

                                // Make filter_option lowercase for safety
                                const filterKey = FilterMappingdata.filter_option.toLowerCase();

                                if (filterKey === "material") {
                                  // isChecked = material.includes(trimmedValue);
                                  isChecked = material === trimmedValue.trim()
                                    .toLowerCase()
                                    .replace(/ /g, "-");
                                } else if (filterKey === "designers") {
                                  // isChecked = designer.includes(trimmedValue);
                                  isChecked = designer === trimmedValue;
                                } else if (filterKey === "plus_sizes") {
                                  isChecked = plusSize === trimmedValue;
                                  // isChecked = Array.isArray(plusSize) && plusSize.includes(trimmedValue);
                                } else if (filterKey === "occasion") {
                                  // isChecked = occasion.includes(trimmedValue);
                                  isChecked = occasion === trimmedValue.trim()
                                    .toLowerCase()
                                    .replace(/ /g, "-");
                                } else if (filterKey === "size" || filterKey === "sizes") {
                                  // isChecked = size.includes(trimmedValue);
                                  isChecked = size === trimmedValue;
                                } else if (filterKey === "celebrity") {
                                  // isChecked = celebrity.includes(trimmedValue);
                                  isChecked = celebrity === trimmedValue.trim()
                                    .toLowerCase()
                                    .replace(/ /g, "-");
                                } else if (filterKey === "discount") {
                                  // isChecked = discount.includes(trimmedValue);
                                  // isChecked = discount === trimmedValue;

                                  const cleanValue = item
                                    .replace(/%/g, "")
                                    .replace(/\s+/g, "");

                                  isChecked = discount === cleanValue;

                                } else if (filterKey === "shipping_time") {
                                  // isChecked = shippingTime.includes(trimmedValue);
                                  isChecked = shippingTime === trimmedValue.trim()
                                    .toLowerCase()
                                    .replace(/ /g, "-");
                                }

                                return (
                                  <div key={`${FilterMappingdata.id}-${indexdsvd}`} className="radio-wrapper-5 px-2 mb-2">
                                    <div className="cdwehjirnweijrowejrowejr">
                                      <div className="checkbox-wrapper-33">
                                        <label htmlFor={safeId} className="checkbox">
                                          <input
                                            id={safeId}
                                            name={FilterMappingdata.filter_option}
                                            value={trimmedValue}
                                            type="checkbox"
                                            className="checkbox__trigger visuallyhidden"
                                            checked={isChecked}
                                            onChange={() => handleSelect(FilterMappingdata.filter_option, trimmedValue)}
                                          />
                                          <span className="checkbox__symbol">
                                            <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28">
                                              <path d="M4 14l8 7L24 7"></path>
                                            </svg>
                                          </span>
                                          <p className="checkbox__textwrapper">{item.trim()}</p>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>

          <div className="doihweuijewrr bg-white d-flex align-items-center">
            <button onClick={handleResponsiveClearFilter} className="btn me-1 btn-main w-100 py-4 rounded-0">CLEAR ALL</button>

            {/* <button onClick={() => setResFltrMenu(false)} className="btn ms-1 btn-main w-100 py-4 rounded-0">APPLY</button> */}
            <button onClick={applyFilterResponsive} className="btn ms-1 btn-main w-100 py-4 rounded-0">APPLY</button>
          </div>
        </div>
      </div>
    </>
  );
}