import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import http from "../http";
import { toast } from "react-toastify";

export default function useFilterData() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filterMapping, setFilterMapping] = useState([]);

  // Extract category / subcategory from URL
  const segments = location.pathname.split("/").filter(Boolean);
  const category = segments[0] || null;
  const subcategory = segments[1] || null;

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await http.post("/fetch-product", {
          category,
          subcategory,
        });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, [location.pathname, category, subcategory]);

  // Fetch filter mapping
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await http.post("/fetch-filter-details", {
          category,
          subcategory,
        });
        setFilterMapping(res.data.data || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
        toast.error("Failed to load filter details");
      }
    };
    fetchFilters();
  }, [location.pathname, category, subcategory]);

  return { category, subcategory, products, filterMapping };
}
