export const filterReducer = (state, action) => {
    switch (action.type) {
        /* ---------------- PRODUCT LIST ---------------- */
        case "PRODUCT_LIST":
            return {
                ...state,
                productList: action.payload.products
            };

        /* ---------------- PRICE ---------------- */
        case "PRICE":
            return {
                ...state,
                minPrice: action.payload.minPrice,
                maxPrice: action.payload.maxPrice
            };

        /* ---------------- MAIN CATEGORY ---------------- */
        // case "MAIN_CATEGORY":
        //     return {
        //         ...state,
        //         mainCategory: state.mainCategory.includes(action.payload.mainCategory)
        //             ? state.mainCategory.filter(v => v !== action.payload.mainCategory)
        //             : [...state.mainCategory, action.payload.mainCategory],
        //         // Reset children when main changes
        //         subCategory: [],
        //         filterCategory: []
        //     };

        case "MAIN_CATEGORY":
            return {
                ...state,
                mainCategory: action.payload.mainCategory, // single value
                subCategory: null,
                // filterCategory: [],
                filterCategory: null
            };

        // case "REMOVE_MAIN_CATEGORY":
        //     return {
        //         ...state,
        //         mainCategory: state.mainCategory.filter(v => v !== action.payload),
        //         subCategory: [],
        //         filterCategory: []
        //     };

        case "REMOVE_MAIN_CATEGORY":
            return {
                ...state,
                mainCategory: null,
                subCategory: null,
                filterCategory: null
                // filterCategory: []
            };

        /* ---------------- SUB CATEGORY (HIERARCHICAL PATH) ---------------- */
        // case "SUB_CATEGORY":
        //     const subPath = action.payload.subPath; // "women/kurta-sets"
        //     return {
        //         ...state,
        //         subCategory: state.subCategory.includes(subPath)
        //             ? state.subCategory.filter(v => v !== subPath)
        //             : [...state.subCategory, subPath],
        //         // Reset filter categories under this sub
        //         filterCategory: state.filterCategory.filter(fc => !fc.startsWith(subPath + '/'))
        //     };

        case "SUB_CATEGORY":
            return {
                ...state,
                subCategory: action.payload.subPath, // single value
                // filterCategory: []
                filterCategory: null
            };

        // case "REMOVE_SUB_CATEGORY":
        //     const removeSubPath = action.payload.subPath;
        //     return {
        //         ...state,
        //         subCategory: state.subCategory.filter(v => v !== removeSubPath),
        //         filterCategory: state.filterCategory.filter(fc => !fc.startsWith(removeSubPath + '/'))
        //     };

        case "REMOVE_SUB_CATEGORY":
            return {
                ...state,
                subCategory: null,
                filterCategory: null
                // filterCategory: []
            };

        /* ---------------- FILTER CATEGORY (FULL PATH: main/sub/filter) ---------------- */
        // case "FILTER_CATEGORY":
        //     const filterPath = action.payload.filterPath; // "women/kurta-sets/printed"
        //     return {
        //         ...state,
        //         filterCategory: state.filterCategory.includes(filterPath)
        //             ? state.filterCategory.filter(v => v !== filterPath)
        //             : [...state.filterCategory, filterPath]
        //     };

        case "FILTER_CATEGORY":
            return {
                ...state,
                filterCategory: action.payload.filterPath
            };

        case "REMOVE_FILTER_CATEGORY":
            return {
                ...state,
                filterCategory: null
            };

        case "PAGE":
            return {
                ...state,
                page: action.payload.page
            };

        case "MATERIAL":
            return {
                ...state,
                material: action.payload.material
            };

        case "DESIGNER":
            return {
                ...state,
                designer: action.payload.designer
            };

        case "OCCASION":
            return {
                ...state,
                occasion: action.payload.occasion
            };

        case "CELEBRITY":
            return {
                ...state,
                celebrity: action.payload.celebrity
            };

        case "SHIPPING_TIME":
            return {
                ...state,
                shippingTime: action.payload.shippingTime
            };

        case "DISCOUNT":
            return {
                ...state,
                discount: action.payload.discount
            };

        case "PLUS_SIZE":
            return {
                ...state,
                plusSize: action.payload.plusSize
            };

        case "SIZE":
            return {
                ...state,
                size: action.payload.size
            };

        case "COLOR":
            return {
                ...state,
                color: action.payload.color
            };

        /* ---------------- OTHER FILTERS (unchanged) ---------------- */
        case "FILTER_CATEGORY_NAME": {
        const keyMap = {
            FILTER_CATEGORY_NAME: "filterCategoryName",
        };

        const field = keyMap[action.type];
        const value = action.payload?.[field];

        if (!value) return state; // 🔒 stops undefined forever

        return {
            ...state,
            [field]: state[field].includes(value)
            ? state[field].filter(v => v !== value)
            : [...state[field], value],
        };
        }

        /* ---------------- REMOVE OTHER FILTERS ---------------- */
        // case "REMOVE_COLOR":
        // case "REMOVE_MATERIAL":
        // case "REMOVE_DESIGNER":
        // case "REMOVE_PLUS_SIZE":
        // case "REMOVE_OCCASION":
        // case "REMOVE_SIZE":
        // case "REMOVE_CELEBRITY":
        // case "REMOVE_DISCOUNT":
        // case "REMOVE_SHIPPING_TIME":
        //     const removeKeyMap = {
        //         "REMOVE_COLOR": "color",
        //         "REMOVE_MATERIAL": "material",
        //         "REMOVE_DESIGNER": "designer",
        //         "REMOVE_PLUS_SIZE": "plusSize",
        //         "REMOVE_OCCASION": "occasion",
        //         "REMOVE_SIZE": "size",
        //         "REMOVE_CELEBRITY": "celebrity",
        //         "REMOVE_DISCOUNT": "discount",
        //         "REMOVE_SHIPPING_TIME": "shippingTime"
        //     };
        //     const removeField = removeKeyMap[action.type];
        //     return {
        //         ...state,
        //         [removeField]: state[removeField].filter(v => v !== action.payload)
        //     };

        case "REMOVE_COLOR":
        case "REMOVE_MATERIAL":
        case "REMOVE_DESIGNER":
        case "REMOVE_PLUS_SIZE":
        case "REMOVE_OCCASION":
        case "REMOVE_SIZE":
        case "REMOVE_CELEBRITY":
        case "REMOVE_DISCOUNT":
        case "REMOVE_SHIPPING_TIME":
            const removeKeyMap = {
                "REMOVE_COLOR": "color",
                "REMOVE_MATERIAL": "material",
                "REMOVE_DESIGNER": "designer",
                "REMOVE_PLUS_SIZE": "plusSize",
                "REMOVE_OCCASION": "occasion",
                "REMOVE_SIZE": "size",
                "REMOVE_CELEBRITY": "celebrity",
                "REMOVE_DISCOUNT": "discount",
                "REMOVE_SHIPPING_TIME": "shippingTime"
            };

            const removeField = removeKeyMap[action.type];

            return {
                ...state,
                [removeField]: null
            };


        

        /* ---------------- SORT & FLAGS (unchanged) ---------------- */
        case "SORT_BY":
            return { ...state, sortBy: action.payload.sortBy };

        case "NEW_ARRIVAL":
            return { ...state, newIn: action.payload.newIn };
        case "READY_TO_SHIP":
            return { ...state, readyToShip: action.payload.readyToShip };
        case "CSTM_FIT":
            return { ...state, cstmFit: action.payload.cstmFit };
        case "ON_SALE":
            return { ...state, onSale: action.payload.onSale };

        case "RESTORE_FROM_URL":
            return { ...state, ...action.payload };

        case "REST_FILTER":
            return {
                ...state,
                minPrice: 0,
                maxPrice: 1000000,
                // mainCategory: [],
                // subCategory: [],
                // filterCategory: [],
                mainCategory: null,
                subCategory: null,
                filterCategory: null,
                filterCategoryName: [],
                color: "",
                material: "",
                designer: "",
                plusSize: "",
                occasion: "",
                size: "",
                celebrity: "",
                discount: "",
                shippingTime: "",
                sortBy: null,
                newIn: false,
                readyToShip: null,
                onSale: false,
                cstmFit: false
            };

        default:
            throw new Error("No matching action type!");
    }
};
