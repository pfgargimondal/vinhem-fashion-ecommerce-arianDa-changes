import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/OrderHistory.module.css";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useEffect, useState } from "react";
import { useMemo, useRef } from "react";
// eslint-disable-next-line
import { downloadInvoicePDF } from "../../utils/downloadInvoice";
// eslint-disable-next-line
import Invoice from "../Invoice/Invoice";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import jsPDF from "jspdf";
// eslint-disable-next-line
import html2canvas from "html2canvas";
import Loader from "../../components/Loader/Loader";

export const OrderHistory = () => {

    const { token, user } = useAuth();
    const [OrderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [resUsernavToggle, setResUsernavToggle] = useState(false);
    const [returnConfirmModal, setReturnConfirmModal] = useState(false);

    useEffect(() => {
        const body = document.querySelector("body");

        const flterClose = () => {
            setOpen(false);
        };

        body.addEventListener("click", flterClose);

        return () => body.removeEventListener("click", flterClose);
    }, []);
 
    const currentYear = new Date().getFullYear();

    // const years = [
    // `${currentYear - 2} - ${currentYear}`, 
    // ...Array.from(
    //     { length: currentYear - 2016 },
    //     (_, i) => (currentYear - 1 - i).toString()
    // ),
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
    // eslint-disable-next-line
    // const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userOrderProduct , setuserOrderProduct] = useState(null);

    const searchRef = useRef(null);

    /* =======================
        FETCH ORDER HISTORY
    ======================= */
    useEffect(() => {
        if (!token) return;

        const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const res = await http.get("/user/get-order-history", {
            headers: { Authorization: `Bearer ${token}` },
            });

            setOrderHistory(res?.data?.data?.orders || []);
        } catch (error) {
            console.error("Failed to fetch order history", error);
        } finally {
            setLoading(false);
        }
        };

        fetchOrderHistory();
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
    let data = [...OrderHistory];

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
        data = data.filter(
          order => new Date(order.order_date).getFullYear() === year
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
  }, [OrderHistory, selected, search]);


    const navigate = useNavigate();



    // const handleDownload = async (order) => {
    //     try {
    //         const res = await http.get("/user/get-invoice-details", {
    //         headers: { Authorization: `Bearer ${token}` },
    //         params: { id: order.order_id }, // 👈 send order_id as 'id'
    //         });

    //         const data = res.data.data || {};
    //         const userInfo = data.user || null;
    //         const orderProductDetails = data.user_order_product_details || null;
    //         const getProductDetails = data.get_product_details || null;
    //         const getGSTDetails = data.get_gst_value || null;

            

    //         localStorage.setItem(
    //         "invoiceData",
    //         JSON.stringify({
    //             order,
    //             user: userInfo,
    //             userOrderProduct: orderProductDetails,
    //             getProductDetails: getProductDetails,
    //             getGSTDetails: getGSTDetails,
    //         })
    //         );

    //     navigate("/invoice", {
    //         state: {
    //             order,
    //             user: userInfo,
    //             userOrderProduct: orderProductDetails,
    //             getProductDetails: getProductDetails,
    //             getGSTDetails: getGSTDetails,
    //             pdfView: true, // signal PDF preview
    //         },
    //     });
    //     } catch (error) {
    //         console.error("❌ Failed to fetch invoice details:", error);
    //     }
    // };

    const handleDownload = (orderHistoryVal) => {
        navigate(`/invoice/${orderHistoryVal.order_id}`);
    };

    const handleCancelOrder = async (order) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem("token");
            const response = await http.post(
            `/user/cancel-order/${order.order_id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );

            if (response.data.success) {
                alert("Your order cancelled request sent successfully!");
                navigate("/order-history"); 
            } else {
                alert(`${response.data.message || "Failed to sent request"}`);
            }
        } catch (err) {
            console.error(err);
            alert(" Something went wrong while cancelling the order.");
        }
    };


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

                                    <h4 className="mb-0">Your Orders</h4>
                                </div>

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
                                        <i className="fa-solid me-1 fa-arrow-left"></i>
                                        Back To Home
                                        <i className="fa-solid ms-1 fa-house"></i>
                                        </Link>
                                    </p>
                                    </div>


                                <div className={styles.dfgndfjhbgdfgdf}>
                                    <Table striped responsive bordered hover>
                                        <thead>
                                            <tr>
                                                <th className="text-center">Order Id</th>

                                                <th className="text-center">Order Information</th>

                                                <th className="text-center">Date</th>

                                                <th className="text-center">Total Amount</th>

                                                <th className="text-center">Status</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {filteredOrders.length > 0 ? (
                                                filteredOrders.map((orderHistoryVal) => (
                                                <tr>
                                                    <td className="text-center">{orderHistoryVal.order_id}</td>

                                                    <td className="text-center">
                                                        <div className={`${styles.sdfsdf} justify-content-between mb-3`}>
    
                                                            <p className="mb-0">No. of items: {orderHistoryVal.total_orderProduct}</p> 

                                                            <p className={`${styles.oknknkmer} mb-0`}   onClick={() => navigate(`/order-details/${orderHistoryVal.order_id}`)} ><i class={`bi ${styles.vew_dtls} bi-eye`}></i> View Details</p>
                                                        </div>

                                                        <div className={`d-flex ${styles.dweknriwehrwer} align-items-center justify-content-between`}>
                                                            {orderHistoryVal.order_status === "Placed" ? (
                                                                    orderHistoryVal.cancel_request === "Requested" ? (
                                                                        <button className="btn border-0 px-0 text-muted" disabled>
                                                                        <i className="bi me-1 bi-clock-history"></i> Cancellation Request Pending
                                                                        </button>
                                                                    ) : orderHistoryVal.order_status === "Declined" ? (
                                                                        <button className="btn border-0 px-0 text-muted" disabled>
                                                                        <i className="bi me-1 bi-clock-history"></i> Cancellation Declined By Admin
                                                                        </button>
                                                                    ) : orderHistoryVal.order_status === "Approved" ? (
                                                                        <button className="btn border-0 px-0 text-muted" disabled>
                                                                        <i className="bi me-1 bi-clock-history"></i> Cancel Approved
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                        className={`btn ${styles.cncl_ordr} border-0 px-0`}
                                                                        onClick={() => handleCancelOrder(orderHistoryVal)}
                                                                        >
                                                                        <i className="bi me-1 bi-folder-x"></i> Cancel Order
                                                                        </button>
                                                                    )
                                                                ) : orderHistoryVal.order_status === "Pending" ? (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-clock-history"></i> Pending Order
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Shipped" ? (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-folder-x"></i> Cancellation Not Available
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Delivered" ? (
                                                                    (() => {
                                                                       const deliveredDate = new Date(orderHistoryVal.delivery_date);
                                                                        const currentDate = new Date();

                                                                        const diffDays = Math.floor(
                                                                            (currentDate.getTime() - deliveredDate.getTime()) /
                                                                            (1000 * 60 * 60 * 24)
                                                                        );
                                                                        const canReturn = diffDays <= 2;
                                                                        return canReturn ? (

                                                                            <button onClick={() => setReturnConfirmModal(prev => !prev)}
                                                                                className={`btn ${styles.return_ordr} border-0 px-0`}
                                                                            >
                                                                                <i className="bi me-1 bi-arrow-counterclockwise"></i>
                                                                                Return Order
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn border-0 px-0 text-muted"
                                                                                disabled
                                                                            >
                                                                                <i className="bi me-1 bi-clock-history"></i>

                                                                                Return Period Expired
                                                                            </button>
                                                                        );
                                                                    })()
                                                                ) : orderHistoryVal.order_status === "Returned" ? (
                                                                <button className={`btn ${styles.return_ordr} border-0 px-0`}>
                                                                    <i className="bi me-1 bi-folder-x"></i> Return Completed
                                                                </button>
                                                                ) : (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-folder-x"></i> Cancellation Not Available
                                                                </button>
                                                                )}
                                                                {orderHistoryVal.order_status === "Delivered" && (
                                                                    <button className={`btn ${styles.dwnld_invce} text-success border-0 px-0`} onClick={() => handleDownload(orderHistoryVal)}>
                                                                        <i class="bi me-1 bi-file-earmark-arrow-down"></i> Download Invoice</button>
                                                                )}
                                                                
                                                        </div>
                                                        {/* <div style={{ display: "none" }}>
                                                            <Invoice />
                                                        </div> */}
                                                    </td>

                                                    <td className="text-center"> {orderHistoryVal.order_date
                                                        ? orderHistoryVal.order_date.split("-").reverse().join("-")
                                                        : ""}</td>

                                                    <td className="text-center">₹{orderHistoryVal.total_order_amount}</td>

                                                    <td className="text-center">
                                                        {orderHistoryVal.order_status === "Placed" ? (
                                                            <button className={styles.dfgfd5544}>{orderHistoryVal.order_status}</button>
                                                        ) : (orderHistoryVal.order_status === "Pending" && orderHistoryVal.action === "accepted") ? (
                                                            <button className={styles.dfgfd5544c}>In Process</button>
                                                        ) : orderHistoryVal.order_status === "Shipped" ? (
                                                            <button className={styles.dfgfd5544b}>{orderHistoryVal.order_status}</button>
                                                        ) : orderHistoryVal.order_status === "Dispatched" ? (
                                                            <button className={styles.dfgfd5544b}>IN-TRANSIT</button>
                                                        ) : orderHistoryVal.order_status === "Delivered" ? (
                                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                                <button className={styles.dfgfd5544}>
                                                                    {orderHistoryVal.order_status}
                                                                </button>

                                                                <span className="text-muted small">
                                                                    | {new Date(orderHistoryVal.delivery_date)
                                                                        .toLocaleDateString("en-GB")
                                                                        .replace(/\//g, "-")}
                                                                </span>
                                                            </div>
                                                        ) : orderHistoryVal.order_status === "Returned" ? (
                                                            <button className={styles.dfgfd5544dvxc}>{orderHistoryVal.order_status}</button>
                                                        ) : (
                                                            <button className={styles.dfgfd5544}>{orderHistoryVal.order_status}</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                            ) : (
                                                !loading && (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                                        No orders found
                                                    </td> 
                                                </tr>
                                                )
                                            )}
                                            
                                            {/* <tr>
                                                <td>AC7875845</td>

                                                <td>
                                                    <div className={styles.sdfsdf}>
                                                        <div className={styles.dsfhsd}>
                                                            <img src="./images/product1 (1).webp" alt="" />
                                                        </div>
                                                        <div className={styles.dbhdsf512}>
                                                            <h6>World's Most Expensive T Shirt</h6>
                                                            <p>Women's Clothes</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>17-07-25</td>

                                                <td>$1,190</td>

                                                <td>
                                                    <button className={styles.dfgfd5544a}>Cancel</button>
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div onClick={() => setReturnConfirmModal(false)} className={returnConfirmModal ? `${styles.retrn_cnfrm_mdal_backdrop}` : `${styles.retrn_cnfrm_mdal_backdrop_hide}`}></div>

            <div className={returnConfirmModal ? `${styles.retrn_cnfrm_mdal} bg-white` : `${styles.retrn_cnfrm_mdal} ${styles.retrn_cnfrm_mdal_hide} bg-white`}>
                <div className={`${styles.oasdopwelrwerwer} text-end px-4 py-3`}>
                    <i onClick={() => setReturnConfirmModal(false)} className="fa-solid fa-xmark mb-1"></i>
                </div>

                <div className="delkwlrwer p-5 pt-0">
                    <h3 className="mb-4 px-4 text-white py-3">Tell Us Why You're Returning This Item..!</h3>

                    <form className={styles.rp_form_wrapper}>
                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-1" className="checkbox">
                                    <input
                                        id="safgsg-1"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Defective / Does not work properly.</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-2" className="checkbox">
                                    <input
                                        id="safgsg-2"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Unflattering fit / Size Issue.</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-3" className="checkbox">
                                    <input
                                        id="safgsg-3"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Damaged product (crushed, torn, scratched).</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-4" className="checkbox">
                                    <input
                                        id="safgsg-4"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Wrong item was sent.</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-5" className="checkbox">
                                    <input
                                        id="safgsg-5"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Missing accessories or parts.</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-6" className="checkbox">
                                    <input
                                        id="safgsg-6"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Doesn't meet expectations / Poor quality.</p>
                                </label>
                            </div>
                        </div>

                        <div className="cdwehjirnweijrowejrowejr mb-0">
                            <div className="checkbox-wrapper-33">
                                <label htmlFor="safgsg-7" className="checkbox">
                                    <input
                                        id="safgsg-7"
                                        className="checkbox__trigger visuallyhidden"
                                        type="radio"
                                        defaultValue="pre-draped sarees"
                                        name="duihwerwer"
                                    />
                                    <span className="checkbox__symbol">
                                        <svg
                                            aria-hidden="true"
                                            className="icon-checkbox"
                                            width="28px"
                                            height="28px"
                                            viewBox="0 0 28 28"
                                        >
                                            <path d="M4 14l8 7L24 7" />
                                        </svg>
                                    </span>
                                    <p className="checkbox__textwrapper">Replacement Required.</p>
                                </label>
                            </div>
                        </div>

                        <div className={`${styles.duiewrweoplrwer} mt-4`}>
                            <label className="form-label">Return Reason<span style={{ color: "red" }}>*</span></label>

                            <textarea name="" id="" className="form-control" placeholder="Text Me..."></textarea>
                        </div>

                        <div className="iodneoiwjrwer">
                            <input type="file" id="file" className="d-none" />

                            <label htmlFor="file" className={`${styles.cfisjfrlkwerw} d-flex align-items-center p-3`}><i class="bi me-1 bi-plus-lg"></i> Attach a File</label>
                        </div>

                        <div className={`${styles.doeiwjrkweopr} text-center mt-3`}><button className="btn btn-main px-3">Submit</button></div>
                    </form>
                </div>
            </div>
        </div>
    )
}
