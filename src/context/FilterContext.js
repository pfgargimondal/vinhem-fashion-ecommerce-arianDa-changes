import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { filterReducer } from "../reducers/filterReducers";

const filterInitialState = {
    productList: [],
    minPrice: 0,
    maxPrice: 1000000,
    // mainCategory: [],
    // subCategory: [],
    // filterCategory: [],
    mainCategory: null,
    subCategory: null,
    filterCategory: null,
    filterCategoryName: [],
    color: null,
    material: null,
    designer: null,
    plusSize: null,
    occasion: null,
    size: null,
    celebrity: null,
    discount: null,
    shippingTime: null,
    sortBy: null,
    newIn: false,
    readyToShip: null,
    onSale: false,
    cstmFit: false,
    page: 1
}


const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);
    const navigate = useNavigate();
    const location = useLocation();    



    // function updateURLWithFilters(newState) {

    //     // const searchParams = new URLSearchParams(location.search);
    //      const searchParams = new URLSearchParams(); 

    //     if (newState.mainCategory)
    //         searchParams.set("main", newState.mainCategory);
    //     else
    //         searchParams.delete("main");

    //     if (newState.subCategory)
    //         searchParams.set("subpaths", newState.subCategory);
    //     else
    //         searchParams.delete("subpaths");

    //     if (newState.filterCategory) {
    //         searchParams.set("filterpaths", newState.filterCategory);
    //     } else {
    //         searchParams.delete("filterpaths");
    //     }

    //     if (newState.filterCategoryName.length)
    //         searchParams.set("filter", newState.filterCategoryName.join(","));

    //     if (newState.color)
    //         searchParams.set("color", newState.color);
    //     else
    //         searchParams.delete("color");

    //     // if (newState.color.length)
    //     //     searchParams.set("color", newState.color.join(","));

    //     if (newState.material)
    //         searchParams.set("material", newState.material);
    //     else
    //         searchParams.delete("material");

    //     if (newState.designer)
    //         searchParams.set("designer", newState.designer);
    //     else
    //         searchParams.delete("designer");

    //     // if (newState.plusSize.length)
    //     //     searchParams.set("plusSize", newState.plusSize.join(","));

    //     if (newState.plusSize)
    //         searchParams.set("plusSize", newState.plusSize);
    //     else
    //         searchParams.delete("plusSize");

    //     if (newState.occasion)
    //         searchParams.set("occasion", newState.occasion);
    //     else
    //         searchParams.delete("occasion");

    //     if (newState.size)
    //         searchParams.set("size", newState.size);
    //     else
    //         searchParams.delete("size");

    //     // if (newState.size.length)
    //     //     searchParams.set("size", newState.size.join(","));

    //     if (newState.celebrity)
    //         searchParams.set("celebrity", newState.celebrity);
    //     else
    //         searchParams.delete("celebrity");

    //     // ❌ REMOVE DISCOUNT FROM URLSearchParams
    //     searchParams.delete("discount");

    //     if (newState.shippingTime)
    //         searchParams.set("shippingTime", newState.shippingTime);
    //     else
    //         searchParams.delete("shippingTime");

    //     if (typeof newState.page === "number") {
    //         if (newState.page > 1)
    //             searchParams.set("page", newState.page);
    //         else
    //             searchParams.delete("page");
    //     }

    //     // ✅ Convert to string FIRST
    //     let queryString = searchParams.toString();

    //     // 🔥 Manually append discount to keep % visible
    //     if (newState.discount) {
    //         queryString += (queryString ? "&" : "") + `discount=${newState.discount}`;
    //     }

    //     // navigate(`${location.pathname}?${queryString}`, { replace: true });
    //     navigate(
    //         queryString
    //             ? `${location.pathname}?${queryString}`
    //             : location.pathname,
    //         { replace: true }
    //     );
    // }


    // function restoreFiltersFromURL() {
    //     const params = new URLSearchParams(location.search);

    //     const newState = {
    //         ...state,
    //         // mainCategory: params.get("main")?.split(",") || [],
    //         // subCategory: params.get("subpaths")?.split(",") || [],

    //         mainCategory: params.get("main") || null,
    //         subCategory: params.get("subpaths") || null,

    //         filterCategory: params.get("filterpaths")?.split(",") || [],
    //         filterCategoryName: params.get("filter")?.split(",") || [],

    //         // ✅ ADD THIS
    //         plusSize: params.get("plusSize")
    //             ? params.get("plusSize").split(",")
    //             : [],

    //         // (optional but recommended)
    //         color: params.get("color")?.split(",") || [],
    //         material: params.get("material")?.split(",") || [],
    //         designer: params.get("designer")?.split(",") || [],
    //         occasion: params.get("occasion")?.split(",") || [],
    //         size: params.get("size")?.split(",") || [],
    //         celebrity: params.get("celebrity")?.split(",") || [],
    //         shippingTime: params.get("shippingTime")?.split(",") || [],
    //     };


    //     dispatch({ type: "RESTORE_FROM_URL", payload: newState });
    // }

    function updateURLWithFilters(newState, options = {}) {

        const {
            clearAll = false
        } = options;

        // ✅ if category changed -> start fresh URL
        const searchParams = clearAll
            ? new URLSearchParams()
            : new URLSearchParams(location.search);

        // =========================
        // PRESERVE SEARCH ONLY
        // =========================

        const existingSearch = location.search
            ? new URLSearchParams(location.search).get("search")
            : null;

        // =========================
        // MAIN CATEGORY
        // =========================

        if (newState.mainCategory)
            searchParams.set("main", newState.mainCategory);
        else
            searchParams.delete("main");

        // =========================
        // SUB CATEGORY
        // =========================

        if (newState.subCategory)
            searchParams.set("subpaths", newState.subCategory);
        else
            searchParams.delete("subpaths");

        // =========================
        // FILTER CATEGORY
        // =========================

        if (newState.filterCategory)
            searchParams.set("filterpaths", newState.filterCategory);
        else
            searchParams.delete("filterpaths");

        // =========================
        // FILTER NAME
        // =========================

        if (newState.filterCategoryName?.length)
            searchParams.set("filter", newState.filterCategoryName.join(","));
        else
            searchParams.delete("filter");

        // =========================
        // COLOR
        // =========================

        if (newState.color)
            searchParams.set("color", newState.color);
        else
            searchParams.delete("color");

        // =========================
        // MATERIAL
        // =========================

        if (newState.material)
            searchParams.set("material", newState.material);
        else
            searchParams.delete("material");

        // =========================
        // DESIGNER
        // =========================

        if (newState.designer)
            searchParams.set("designer", newState.designer);
        else
            searchParams.delete("designer");

        // =========================
        // PLUS SIZE
        // =========================

        if (newState.plusSize)
            searchParams.set("plusSize", newState.plusSize);
        else
            searchParams.delete("plusSize");

        // =========================
        // OCCASION
        // =========================

        if (newState.occasion)
            searchParams.set("occasion", newState.occasion);
        else
            searchParams.delete("occasion");

        // =========================
        // SIZE
        // =========================

        if (newState.size)
            searchParams.set("size", newState.size);
        else
            searchParams.delete("size");

        // =========================
        // CELEBRITY
        // =========================

        if (newState.celebrity)
            searchParams.set("celebrity", newState.celebrity);
        else
            searchParams.delete("celebrity");

        // =========================
        // DISCOUNT
        // =========================

        if (newState.discount)
            searchParams.set("discount", newState.discount);
        else
            searchParams.delete("discount");

        // =========================
        // SHIPPING
        // =========================

        if (newState.shippingTime)
            searchParams.set("shippingTime", newState.shippingTime);
        else
            searchParams.delete("shippingTime");

        // =========================
        // PRICE
        // =========================

        if (
            newState.minPrice > 0 ||
            newState.maxPrice < 1000000
        ) {
            searchParams.set(
                "price",
                `${newState.minPrice}-${newState.maxPrice}`
            );
        } else {
            searchParams.delete("price");
        }

        // =========================
        // PAGE
        // =========================

        if (newState.page > 1)
            searchParams.set("page", newState.page);
        else
            searchParams.delete("page");

        // =========================
        // KEEP SEARCH
        // =========================

        if (!clearAll && existingSearch) {
            searchParams.set("search", existingSearch);
        }

        // =========================
        // NAVIGATE
        // =========================

        navigate(
            searchParams.toString()
                ? `${location.pathname}?${searchParams.toString()}`
                : location.pathname,
            { replace: true }
        );
    }


    function restoreFiltersFromURL() {
        const params = new URLSearchParams(location.search);

        // const plusSizeFromUrl = params.get("plusSize")
        //     ? params.get("plusSize")
        //         .split(",")
        //         .map(v => v.trim().toLowerCase())  // trim & lowercase
        //         .filter(Boolean)                   // remove empty strings
        //     : [];

        const getArray = (key) => {
            const value = params.get(key);
            return value ? value.split(",").filter(Boolean) : [];
        };
        const pageFromUrl = Number(params.get("page")) || 1;

        const price = params.get("price");

        dispatch({
            type: "RESTORE_FROM_URL",
            payload: {
                mainCategory: params.get("main") || null,
                subCategory: params.get("subpaths") || null,

                filterCategory: params.get("filterpaths") || null,
                filterCategoryName: getArray("filter"),

                color: params.get("color") || "",
                material: params.get("material") || "",
                designer: params.get("designer") || "",
                plusSize: params.get("plusSize") || "", 
                occasion: params.get("occasion") || "",
                size: params.get("size") || "",
                celebrity: params.get("celebrity") || "",
                discount: params.get("discount") || "",
                shippingTime: params.get("shippingTime") || "",
                page: pageFromUrl,
            }
        });

        if (price) {
            const [min, max] = price.split("-").map(Number);

            dispatch({
                type: "PRICE",
                payload: {
                minPrice: min || 0,
                maxPrice: max || 1000000
                }
            });
        }
    }


    // useEffect(() => {
    //     restoreFiltersFromURL();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        restoreFiltersFromURL();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);



    //productlist

    function initialProductList(products) {
        dispatch({
            type: "PRODUCT_LIST",
            payload: {
                products: products
            }
        })
    }


    //price

    function setPrice(min, max) {
        const newState = { ...state, minPrice: min, maxPrice: max };
        dispatch({ type: "PRICE", payload: { minPrice: min, maxPrice: max } });
        updateURLWithFilters(newState);
    }

    function filterPrice(products) {
        return products.filter(product => {
            const price = Number(product?.selling_price || 0);
            return price >= state.minPrice && price <= state.maxPrice;
        });
    }


    //main category

    // function setMainCategory(mainCategory) {
    //     const newState = {
    //         ...state,
    //         mainCategory: state.mainCategory.includes(mainCategory)
    //             ? state.mainCategory.filter(v => v !== mainCategory)
    //             : [...state.mainCategory, mainCategory]
    //     };

    //     dispatch({
    //         type: "MAIN_CATEGORY",
    //         payload: { mainCategory }
    //     });
        
    //     updateURLWithFilters(newState);
    // }

    function setMainCategory(mainCategory) {
        if (!mainCategory) return;

        const value =
            state.mainCategory === mainCategory
                ? null              // 🔥 UNCHECK
                : mainCategory;

        const newState = {
            ...state,
            mainCategory: value,
            subCategory: null,      // clear child
            filterCategory: null    // ✅ MUST be null (not array)
        };

        dispatch({
            type: "MAIN_CATEGORY",
            payload: { mainCategory: value }
        });

        // updateURLWithFilters(newState);
        updateURLWithFilters(newState, {
            clearAll: true
        });
    }
    

    function filterMainCategory(products) {
        // if (!state.mainCategory || state.mainCategory.length === 0) {
        //     return products;
        // }

        // return products.filter(product => {
        //     const productCategory = product?.product_category?.toLowerCase();
        //     return state.mainCategory.includes(productCategory);
        // });

        if (!state.mainCategory) return products;

        return products.filter(product =>
            product?.product_category?.toLowerCase() === state.mainCategory
        );
    }


    //sub category

    // function setSubCategory(mainCategory, subCategoryName) {
    //     if (!mainCategory || !subCategoryName) return;

    //     // BUILD FULL PATH: "women/kurta-sets"
    //     const subPath = `${mainCategory}/${subCategoryName}`.toLowerCase().replace(/ /g, '-');
        
    //     const newState = {
    //         ...state,
    //         subCategory: state.subCategory.includes(subPath)
    //             ? state.subCategory.filter(v => v !== subPath)
    //             : [...state.subCategory, subPath]
    //     };

    //     dispatch({
    //         type: "SUB_CATEGORY",
    //         payload: { subPath }  // Pass full path to reducer
    //     });

    //     updateURLWithFilters(newState);
    // }

    function setSubCategory(mainCategory, subCategoryName) {
        if (!mainCategory || !subCategoryName) return;

        // const subPath = `${mainCategory}/${subCategoryName}`
        const subPath = `${subCategoryName}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.subCategory === subPath
                ? null              // 🔥 UNCHECK
                : subPath;

        const newState = {
            ...state,
            subCategory: value,
            filterCategory: null    // ✅ MUST be null
        };

        dispatch({
            type: "SUB_CATEGORY",
            payload: { subPath: value }
        });

        // updateURLWithFilters(newState);

        updateURLWithFilters(newState, {
            clearAll: true
        });
    }

    function filterSubCategory(products) {
        // const selectedSubs = state.subCategory || [];
        // if (!selectedSubs.length) return products;

        // return products.filter(product => {
        //     const mainCat = product.product_category?.toLowerCase().trim();
        //     const subCat = product.product_sub_category?.toLowerCase().trim();
        //     if (!mainCat || !subCat) return false;
            
        //     const productSubPath = `${mainCat}/${subCat}`;
        //     return selectedSubs.includes(productSubPath);
        // });

        if (!state.subCategory) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase();
            const subCat = product.product_sub_category?.toLowerCase();
            if (!mainCat || !subCat) return false;

            // return `${mainCat}/${subCat}` === state.subCategory;
            // return `${subCat}` === state.subCategory;
            return slugify(subCat) === state.subCategory;
        });
    }





    //filter category

    function setFilterCategory(mainCategory, subCategoryName, filterCategoryName) {
        if (!mainCategory || !subCategoryName || !filterCategoryName) return;

        // const filterPath = `${mainCategory}/${subCategoryName}/${filterCategoryName}`
        const filterPath = `${filterCategoryName}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.filterCategory === filterPath
                ? null               // 🔥 UNCHECK
                : filterPath;

        dispatch({
            type: "FILTER_CATEGORY",
            payload: { filterPath: value }
        });

        updateURLWithFilters({
            ...state,
            filterCategory: value
        });
    }

    function filterFilterCategory(products) {
        const selectedFilters = state.filterCategory || [];
        if (!selectedFilters.length) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();
            const filterCat = product.filter_categories?.toLowerCase().trim();
            
            if (!mainCat || !subCat || !filterCat) return false;
            
            // const productFilterPath = `${mainCat}/${subCat}/${filterCat}`;
            // const productFilterPath = `${filterCat}`;
            const productFilterPath = slugify(filterCat);
            return selectedFilters.includes(productFilterPath);
        });
    }



    //filter category name

    function setFilterCategoryName(filterCategoryName) {
        dispatch({
            type: "FILTER_CATEGORY_NAME",
            payload: filterCategoryName.toLowerCase()
        });
    }

    function filterFilterCategoryName(products) {
        if (!state.filterCategoryName.length) {
            return products;
        }

        return products.filter(product => {
            const productCategories = product?.filter_categories;

            if (!productCategories) return false;

            if (typeof productCategories === "string") {
                return productCategories
                    .toLowerCase()
                    .split(",")
                    .map(v => v.trim())
                    .some(cat => state.filterCategoryName.includes(cat));
            }

            if (Array.isArray(productCategories)) {
                return productCategories
                    .map(v => v.toLowerCase())
                    .some(cat => state.filterCategoryName.includes(cat));
            }

            return false;
        });
    }

    //designer

    function setDiscount(discount) {
        if (!discount) return;

        // Convert "10% - 20%" → "10-20"
        const cleanRange = discount
            .replace(/%/g, "")
            .replace(/\s+/g, "");

        const value =
            state.discount === cleanRange
                ? null
                : cleanRange;

        const newState = {
            ...state,
            discount: value,
            page: 1
        };

        dispatch({
            type: "DISCOUNT",
            payload: { discount: value }
        });

        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterDiscount(products) {
        const selectedRange = state.discount;
        if (!selectedRange) return products;

        const [min, max] = selectedRange
            .replace(/%/g, "")
            .split("-")
            .map(v => Number(v.trim()));

        return products.filter(product => {
            const productDiscount = Number(product.discount);
            if (isNaN(productDiscount)) return false;

            return productDiscount >= min && productDiscount <= max;
        });
    }


    //color

    function setColor(color) {
        if (!color) return;

        const isSame = state.color === color;

        const newState = {
            ...state,
            color: isSame ? null : color,  // single value
            page: 1
        };

        dispatch({
            type: "COLOR",
            payload: { color: newState.color }
        });

        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterColor(products) {
        const selectedColor = state.color;
        if (!selectedColor) return products;

        return products.filter(product => {
            const productColors = product.filter_color
                ?.toLowerCase()
                .split(",")
                .map(c => c.trim());

            if (!productColors?.length) return false;

            return productColors.includes(selectedColor.toLowerCase());
        });
    }



    //material

    function setMaterial(material) {

        if (!material) return;

        const materialPath = `${material}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.material === materialPath
                ? null              // 🔥 UNCHECK
                : materialPath;

        const newState = {
            ...state,
            material: value,
            page: 1
        };

        dispatch({ type: "MATERIAL", payload: { material: newState.material } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);

    }

    function filterMaterial(products) {
        // const selectedMaterial = state.material;
        // if (!selectedMaterial) return products;

        // return products.filter(product => {
        //     const productMaterials = product.filter_material
        //         ?.toLowerCase()
        //         .split(",")
        //         .map(m => m.trim());

        //     if (!productMaterials?.length) return false;

        //     return productMaterials.some(material =>
        //         material.includes(selectedMaterial.toLowerCase())
        //     );
        // });

        const selectedMaterial = state.material;

        if (!selectedMaterial) return products;

        return products.filter(product => {
            const productMaterial = product.filter_material
                ?.toLowerCase()
                .replace(/ /g, "-");

            return productMaterial === selectedMaterial;
        });
    }



    //designer

    function setDesigner(designer) {
        if (!designer) return;

        const newState = {
            ...state,
            designer: state.designer === designer ? "" : designer, // toggle single select
            page: 1
        };
        dispatch({
            type: "DESIGNER",
            payload: { designer: newState.designer }
        });
        dispatch({
            type: "PAGE",
            payload: { page: 1 }
        });

        updateURLWithFilters(newState);
    }


    function filterDesigner(products) {
        if (!state.designer) return products;

        return products.filter(
            product =>
                product.designer?.toLowerCase() === state.designer.toLowerCase()
        );
    }


    //plus size

    // function setPlusSize(plusSize) {
    //     if (!plusSize) return;

    //     const newState = {
    //         ...state,
    //         plusSize: state.plusSize.includes(plusSize)
    //             ? state.plusSize.filter(v => v !== plusSize)
    //             : [...state.plusSize, plusSize]
    //     };

    //     dispatch({ type: "PLUS_SIZE", payload: { plusSize } });
    //     updateURLWithFilters(newState);
    // }


    function setPlusSize(plusSize) {
        if (!plusSize) return;

        // const normalizedSize = plusSize.trim().toLowerCase();
        // if (!normalizedSize) return;

        // const updatedPlusSize = state.plusSize.includes(normalizedSize)
        //     ? state.plusSize.filter(v => v !== normalizedSize)
        //     : [...state.plusSize, normalizedSize];

        // // Dispatch
        // dispatch({ type: "PLUS_SIZE", payload: { plusSize } });

        // // Update URL
        // updateURLWithFilters({
        //     ...state,
        //     plusSize: updatedPlusSize.filter(Boolean)  // ✅ clean array
        // });

        const isSame = state.plusSize === plusSize;

        const newState = {
            ...state,
            plusSize: isSame ? null : plusSize,
            page: 1
        };

        dispatch({ type: "PLUS_SIZE", payload: { plusSize: newState.plusSize } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }




    // function filterPlusSize(products) {
    //     const selectedSizes = state.plusSize || [];
    //     if (!selectedSizes.length) return products;

    //     return products.filter(product => {
    //         const sizes = product.product_plus_size;

    //         if (Array.isArray(sizes)) {
    //             return selectedSizes.some(size => sizes.map(s => s.toLowerCase()).includes(size));
    //         }

    //         if (typeof sizes === "string") {
    //             const sizeArray = sizes.split(",").map(s => s.trim().toLowerCase());
    //             return selectedSizes.some(size => sizeArray.includes(size));
    //         }

    //         return false;
    //     });
    // }



    //occasion

    function filterPlusSize(products) {
        const selectedSize = state.plusSize;
        if (!selectedSize) return products;

        return products.filter(product => {
            const productSizes = product.product_plus_size
                ?.split(",")
                .map(size => size.trim().toLowerCase());

            return productSizes?.includes(selectedSize.toLowerCase());
        });

    }

    function setOccasion(occasion) {

        if (!occasion) return;

        const occasionPath = `${occasion}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.occasion === occasionPath
                ? null              // 🔥 UNCHECK
                : occasionPath;

        const newState = {
            ...state,
            occasion: value,
            page: 1
        };

        dispatch({ type: "OCCASION", payload: { occasion: newState.occasion } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);

    }

    function filterOccasion(products) {
        // const selectedOccasion =
        //     typeof state.occasion === "string"
        //         ? state.occasion.toLowerCase()
        //         : "";

        // if (!selectedOccasion) return products;

        // return products.filter(product => {
        //     const productOccasions =
        //         typeof product?.filter_occasion === "string"
        //             ? product.filter_occasion
        //                 .toLowerCase()
        //                 .split(",")
        //                 .map(o => o.trim())
        //             : [];

        //     return productOccasions.includes(selectedOccasion);
        // });

        // const selectedOccasion = state.occasion;
        // if (!selectedOccasion) return products;

        // return products.filter(product =>
        //     product.filter_occasion?.toLowerCase() === selectedOccasion.toLowerCase()
        // );

        const selectedOccasion = state.occasion;

        if (!selectedOccasion) return products;

        // return products.filter(product => {
        //     const productOccasion = product.filter_occasion
        //         ?.toLowerCase()
        //         .replace(/ /g, "-");

        //     return productOccasion === selectedOccasion;
        // });

        return products.filter(product => {
            if (!product.filter_occasion) return false;

            // Split multiple values by comma
            const occasions = product.filter_occasion
                .split(",")
                .map(item =>
                    item.trim().toLowerCase().replace(/ /g, "-")
                );

            return occasions.includes(selectedOccasion);
        });
    }

    //size

    function setSize(size) {
        if (!size) return;
        const isSame = state.size === size;

        const newState = {
            ...state,
            size: isSame ? null : size,
            page: 1
        };

        dispatch({ type: "SIZE", payload: { size: newState.size } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    // function filterSize(products) {
    //     const selectedSizes = state.size || [];
    //     if (!selectedSizes.length) return products;

    //     return products.filter(product => {
    //         const productSizes = product?.product_size?.split(",").map(s => s.trim().toLowerCase()) || [];
    //         return selectedSizes.some(size => productSizes.includes(size));
    //     });
    // }

    function filterSize(products) {
        // const selectedSizes = state.size || [];
        // if (!selectedSizes.length) return products;

        // return products.filter(product => {
        //     const productSizes =
        //         typeof product?.product_size === "string"
        //             ? product.product_size.split(",").map(s => s.trim().toLowerCase())
        //             : [];

        //     return selectedSizes.some(size => productSizes.includes(size));
        // });

        const selectedSizes = state.size;
        if (!selectedSizes) return products;

        return products.filter(product => {
            const productSizes = product.product_size
                ?.split(",")
                .map(size => size.trim().toLowerCase());

            return productSizes?.includes(selectedSizes.toLowerCase());
        });
    }



    //celebrity

    // function setCelebrity(celebrity) {
    //     if (!celebrity) return;

    //     const newState = {
    //         ...state,
    //         celebrity: state.celebrity.includes(celebrity)
    //             ? state.celebrity.filter(v => v !== celebrity)
    //             : [...state.celebrity, celebrity],

    //         page: 1 
    //     };

    //     dispatch({ type: "CELEBRITY", payload: { celebrity } });
    //     dispatch({ type: "PAGE", payload: { page: 1 } });
    //     updateURLWithFilters(newState);
    // }

    function setCelebrity(celebrity) {
        if (!celebrity) return;

        const celebrityPath = `${celebrity}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.celebrity === celebrityPath
                ? null             
                : celebrityPath;

        const newState = {
            ...state,
            celebrity: value,
            page: 1
        };

        dispatch({ type: "CELEBRITY", payload: { celebrity: newState.celebrity } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterCelebrity(products) {
        // const selectedCelebrities = state.celebrity || [];
        // if (!selectedCelebrities.length) return products;

        // return products.filter(product => {
        //     const productCelebrity = product.celebrity?.toLowerCase();
        //     return selectedCelebrities.includes(productCelebrity);
        // });
        // const selectedCelebrity = state.celebrity;
        // if (!selectedCelebrity) return products;

        // return products.filter(product =>
        //     product.celebrity?.toLowerCase() === selectedCelebrity.toLowerCase()
        // );

        const selectedCelebrity = state.celebrity;

        if (!selectedCelebrity) return products;

        return products.filter(product => {
            const productCelebrity = product.celebrity
                ?.toLowerCase()
                .replace(/ /g, "-");

            return productCelebrity === selectedCelebrity;
        });
    }



    //shipping time

    // function setShippingTime(shippingTime) {
    //     if (!shippingTime) return;

    //     const newState = {
    //         ...state,
    //         shippingTime: state.shippingTime.includes(shippingTime)
    //             ? state.shippingTime.filter(v => v !== shippingTime)
    //             : [...state.shippingTime, shippingTime],

    //         page: 1 
    //     };

    //     dispatch({ type: "SHIPPING_TIME", payload: { shippingTime } });
    //     dispatch({ type: "PAGE", payload: { page: 1 } });
    //     updateURLWithFilters(newState);
    // }

    function setShippingTime(shippingTime) {
        if (!shippingTime) return;

        const shippingTimePath = `${shippingTime}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.shippingTime === shippingTimePath
                ? null             
                : shippingTimePath;

        const newState = {
            ...state,
            shippingTime: value,
            page: 1
        };

        dispatch({ type: "SHIPPING_TIME", payload: { shippingTime: newState.shippingTime } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }


    function filterShippingTime(products) {

        // const selectedShippingTimes = state.shippingTime || [];
        // if (!selectedShippingTimes.length) return products;

        // return products.filter(product => {
        //     const productShippingTime = product.shipping_time?.toLowerCase();
        //     return selectedShippingTimes.includes(productShippingTime);
        // });
        // const selectedShippingTime = state.shippingTime;
        // if (!selectedShippingTime) return products;

        // return products.filter(product =>
        //     product.shipping_time?.toLowerCase() === selectedShippingTime.toLowerCase()
        // );

        const selectedShippingTime = state.shippingTime;

        if (!selectedShippingTime) return products;

        return products.filter(product => {
            const productShippingTime = product.shipping_time
                ?.toLowerCase()
                .replace(/ /g, "-");

            return productShippingTime === selectedShippingTime;
        });
    }


    function setPage(page) {
        const newState = { ...state, page };

        dispatch({
            type: "PAGE",
            payload: { page }
        });

        updateURLWithFilters(newState);
    }


    function slugify(text) {
        return text
            ?.toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }


    //sortby

    function setSortBy(sortBy) {
        const isNewArrival = sortBy === "NEW_ARRIVAL";

        const newState = { ...state, sortBy, newIn: isNewArrival };

        dispatch({
            type: "SORT_BY",
            payload: { sortBy }
        });

        dispatch({
            type: "NEW_ARRIVAL",
            payload: { newIn: isNewArrival }
        });

        updateURLWithFilters(newState);
    }

    function filterSortBy(products) {
        if (state.sortBy === "LOW_TO_HIGH") {
            return products.sort((a, b) => a.selling_price - b.selling_price);
        } else if (state.sortBy === "HIGH_TO_LOW") {
            return products.sort((a, b) => b.selling_price - a.selling_price);
        } else if (state.sortBy === "BEST_SELLER") {
            return products.filter(product => product.best_seller === "1");
        } else if (state.sortBy === "DISCOUNT_HIGH_TO_LOW") {
            return products.sort((a, b) => b.discount - a.discount);
        } else {
            return products;
        }
    }



    //new arrival

    function setNewArrival(value) {
        const newState = {
            ...state,
            newIn: value,
            sortBy: value ? "NEW_ARRIVAL" : null
        };

        dispatch({
            type: "NEW_ARRIVAL",
            payload: { newIn: value }
        });

        dispatch({
            type: "SORT_BY",
            payload: {
                sortBy: value ? "NEW_ARRIVAL" : null
            }
        });

        updateURLWithFilters(newState);
    }

    function filterNewArrival(products) {
        return state.newIn ? products.filter(product => product.new_arrival === "1" || product?.new_arrival === true) : products;
    }



    //ready to ship

    function setReadyToShip(value) {
        const newState = { ...state, readyToShip: value };
        dispatch({ type: "READY_TO_SHIP", payload: { readyToShip: value } });
        updateURLWithFilters(newState);
    }

    function filterReadyToShip(products) {
        return state.readyToShip ? products.filter(product => (product?.rts_quantity * 1) > 0) : products;
    }


    // custom fit

    function setCstmFit(value) {
        const newState = { ...state, cstmFit: value };
        dispatch({ type: "CSTM_FIT", payload: { cstmFit: value } });
        updateURLWithFilters(newState);
    }

    function filterCstmFit(products) {
        return state.cstmFit ? products.filter(product => product?.custom_fit?.toString().trim().toLowerCase() === "yes") : products;
    }


    //on sale

    function setOnSale(value) {
        const newState = { ...state, onSale: value };
        dispatch({ type: "ON_SALE", payload: { onSale: value } });
        updateURLWithFilters(newState);
    }

    function filterOnSale(products) {
        return state.onSale ? products.filter(product => product?.discount >= 17) : products;
    }


    //reset

    function resetFilter() {
        dispatch({
            type: "REST_FILTER"
        });
        navigate(location.pathname, { replace: true });
    }

    function removeMainCategory(value) {
        dispatch({ type: "REMOVE_MAIN_CATEGORY", payload: value });
    }

    function removeSubCategory(subPath) {
        dispatch({ type: "REMOVE_SUB_CATEGORY", payload: { subPath } });
    }

    function removeFilterCategory(filterPath) {
        dispatch({ type: "REMOVE_FILTER_CATEGORY", payload: { filterPath } });
    }

    function removeColor(value) {
        dispatch({ type: "REMOVE_COLOR", payload: value });
    }

    function removeMaterial(value) {
        dispatch({ type: "REMOVE_MATERIAL", payload: value });
    }

    function removeDesigner(value) {
        dispatch({ type: "REMOVE_DESIGNER", payload: value });
    }

    function removePlusSize(value) {
        dispatch({ type: "REMOVE_PLUS_SIZE", payload: value });
    }

    function removeOccasion(value) {
        dispatch({ type: "REMOVE_OCCASION", payload: value });
    }

    function removeSize(value) {
        dispatch({ type: "REMOVE_SIZE", payload: value });
    }

    function removeCelebrity(value) {
        dispatch({ type: "REMOVE_CELEBRITY", payload: value });
    }

    function removeDiscount(value) {
        dispatch({ type: "REMOVE_DISCOUNT", payload: value });
    }

    function removeShippingTime(value) {
        dispatch({ type: "REMOVE_SHIPPING_TIME", payload: value });
    }


    const filteredProducts = filterReadyToShip(
        filterNewArrival(
            filterOnSale(
                filterCstmFit(
                    filterSortBy(
                        filterShippingTime(
                            filterDiscount(
                                filterCelebrity(
                                    filterSize(
                                        filterOccasion(
                                            filterPlusSize(
                                                filterDesigner(
                                                    filterMaterial(
                                                        filterColor(
                                                            filterFilterCategoryName(
                                                                filterFilterCategory(
                                                                    filterSubCategory(
                                                                        filterMainCategory(
                                                                            filterPrice(state.productList)
                                                                        )
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );



    const value = {
        products: filteredProducts,

        onSale: state.onSale,
        newIn: state.newIn,
        readyToShip: state.readyToShip,
        cstmFit: state.cstmFit,

        initialProductList,

        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        setPrice,

        mainCategory: state.mainCategory,
        setMainCategory,

        subCategory: state.subCategory,
        setSubCategory,

        filterCategoryCntxt: state.filterCategory,
        setFilterCategory,

        filterCategoryName: state.filterCategoryName,
        setFilterCategoryName,

        color: state.color,
        setColor,

        material: state.material,
        setMaterial,

        designer: state.designer,
        setDesigner,

        plusSize: state.plusSize,
        setPlusSize,

        occasion: state.occasion,
        setOccasion,

        size: state.size,
        setSize,

        celebrity: state.celebrity,
        setCelebrity,

        discount: state.discount,
        setDiscount,

        shippingTime: state.shippingTime,
        setShippingTime,

        page: state.page,
        setPage,

        sortBy: state.sortBy,
        setSortBy,

        setNewArrival,
        setReadyToShip,
        setCstmFit,
        setOnSale,

        // remove handlers
        removeMainCategory,
        removeSubCategory,
        removeFilterCategory,
        removeColor,
        removeMaterial,
        removeDesigner,
        removePlusSize,
        removeOccasion,
        removeSize,
        removeCelebrity,
        removeDiscount,
        removeShippingTime,

        resetFilter
        };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilter = () => {
    const context = useContext(FilterContext);

    return context;
}