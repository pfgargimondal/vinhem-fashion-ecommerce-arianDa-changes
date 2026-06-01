import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Table from "react-bootstrap/Table";

import { UserProfileNavMenu } from "../../components";
import styles from "./Css/CancelOrder.module.css";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

export const CancelOrder = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [CanceledOrder, setCanceledOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [resUsernavToggle, setResUsernavToggle] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
      const body = document.querySelector("body");

      const flterClose = () => {
          setOpen(false);
      };

      body.addEventListener("click", flterClose);

      return () => body.removeEventListener("click", flterClose);
  }, []);

  /* =======================
      YEAR FILTER OPTIONS
  ======================= */
  const currentYear = new Date().getFullYear();

  // const years = [
  //   `${currentYear - 2} - ${currentYear}`,
  //   ...Array.from(
  //     { length: currentYear - 2016 },
  //     (_, i) => (currentYear - 1 - i).toString()
  //   ),
  // ];

  const years = useMemo(() => {
        if (!user?.created_at) return [];

        const createdYear = new Date(user.created_at).getFullYear();

        // ✅ If only one year exists
        if (createdYear === currentYear) {
            return [currentYear.toString()];
        }

        // ✅ If multiple years
        return [
            `${createdYear} - ${currentYear}`,
            ...Array.from(
                { length: currentYear - createdYear + 1 },
                (_, i) => (currentYear - i).toString()
            )
        ];
    }, [user, currentYear]);

    const [selected, setSelected] = useState("");
    useEffect(() => {
        if (years.length > 0) {
            setSelected(years[0]);
        }
    }, [years]);

  /* =======================
      FETCH CANCELLED ORDERS
  ======================= */
  useEffect(() => {
    if (!token) return;

    const fetchCancelOrder = async () => {
      try {
        setLoading(true);
        const res = await http.get("/user/get-cancel-order", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCanceledOrder(res?.data?.data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch cancel order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelOrder();
  }, [token]);

  /* =======================
      AUTO FOCUS SEARCH (ONCE)
  ======================= */
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  /* =======================
      FILTER LOGIC (NO BLINK)
  ======================= */
  const filteredOrders = useMemo(() => {
    let data = [...CanceledOrder];

    // Year filter
    if (selected) {
      if (selected.includes("-")) {
        const [start, end] = selected.split("-").map(Number);
        data = data.filter(order => {
          const year = new Date(order.order_date).getFullYear();
          return year >= start && year <= end;
        });
      } else {
        const year = Number(selected);
        data = data.filter(order =>
          new Date(order.order_date).getFullYear() === year
        );
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(order =>
        order?.order_id?.toString().toLowerCase().includes(q)
      );
    }

    return data;
  }, [CanceledOrder, selected, search]);

  /* =======================
      UI
  ======================= */
  return (
    <div className={styles.ffhfdf}>
      {loading && <Loader />}

      <div className="ansjidnkuiweer">
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu resUsernavToggle={resUsernavToggle} setResUsernavToggle={setResUsernavToggle} />
            </div>

            <div className="col-lg-9">
              <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                  <div className={`${styles.doiewhrwerr} d-flex align-items-center`}>
                    <p className="mb-0 d-flex align-items-center"><i class="bi me-1 bi-chevron-left"></i> Profile <span className="mx-2">/</span> </p>

                    <h4 className="mb-0">Cancelled Orders</h4>
                  </div>                  

                  {/* SEARCH */}
                  <div className={styles.customSearchWrapper}>
                    <i className={`bi bi-search ${styles.customSearchIcon}`} />
                    <input
                      ref={searchRef}
                      type="text"
                      className={styles.customSearchInput}
                      placeholder="Search by Order No."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* FILTER */}
                  <div className={styles.filterWrapper}>
                    <button
                    className={styles.filterBtn}
                    onClick={(e) => {e.stopPropagation(); setOpen(!open);}}
                    >
                    <i className="bi bi-sliders" /> Filter
                    </button>

                    {open && (
                    <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                        <div
                        className={`${styles.option} ${styles.active}`}
                        style={{ pointerEvents: "none" }}
                        >
                        {selected}
                        </div>

                        {years
                        .filter(year => year !== selected)
                        .map((year, index) => (
                            <div
                            key={index}
                            className={styles.option}
                            onClick={() => {
                                setSelected(year);
                                setOpen(false);
                            }}
                            >
                            {year}
                            </div>
                        ))}
                    </div>
                    )}
                </div>


                  <p className="ndiwhermweoewrr mb-0 d-none">
                    <Link to="/">
                      <i className="fa-solid me-1 fa-arrow-left" /> Back To Home{" "}
                      <i className="fa-solid ms-1 fa-house" />
                    </Link>
                  </p>
                </div>

                {/* TABLE */}
                <div className={styles.dfgndfjhbgdfgdf}>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Order Id</th>
                        <th className="text-center">Order Information</th>
                        <th className="text-center">Order Date</th>
                        <th className="text-center">Cancel Date</th>
                        <th className="text-center">Total Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(CanceledOrderVal => (
                          <tr key={CanceledOrderVal.order_id}>
                            <td className="text-center">{CanceledOrderVal.order_id}</td>

                            <td className="text-center">
                                <div className={`${styles.sdfsdf} justify-content-between mb-3`}>
                                <p className="mb-0">
                                    No. of items: {CanceledOrderVal.total_orderProduct}
                                </p>

                                <p className={`${styles.oknknkmer} mb-0`} onClick={() => navigate(`/order-details/${CanceledOrderVal.order_id}`)}>
                                    <i className={`bi ${styles.vew_dtls} bi-eye`}></i> View Details
                                </p>
                                </div>

                                <div
                                className={`d-flex ${styles.dweknriwehrwer} align-items-center justify-content-between`}
                                >
                                <button className={`btn ${styles.cncl_ordr} border-0 px-0`}>
                                    <i className="bi me-1 bi-folder-x"></i> Cancelled Order
                                </button>
                                </div>
                            </td>

                            <td className="text-center">
                                {CanceledOrderVal.order_date
                                ? CanceledOrderVal.order_date.split("-").reverse().join("-")
                                : ""}
                            </td>

                            <td className="text-center">
                                {CanceledOrderVal.cancel_date
                                ? CanceledOrderVal.cancel_date.split("-").reverse().join("-")
                                : ""}
                            </td>

                            <td className="text-center">₹{CanceledOrderVal.total_order_amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No orders found
                          </td> 
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
