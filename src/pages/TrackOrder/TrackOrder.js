import Table from "react-bootstrap/Table";
import "./Css/TrackOrder.css";
import { useEffect, useState } from "react";
// eslint-disable-next-line
import http, { BASE_URL } from "../../http";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useMetaData } from "../../hooks/useMetaData";
import { useLocation } from "react-router-dom";
import { optimizeImage } from "../../utils/optimizeImage";

export const TrackOrder = () => {

  const [TrackingOrderDetails, setTrackingOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [pageMetaData, setPageMetaData] = useState([]);
                  
  const pathName = useLocation().pathname;

  useEffect(() => {
    const fetchAboutUsData = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/get-tracking-order-details");
        const getMetaDataResponse = await http.get("/get-all-page-meta-title");
        setTrackingOrderDetails(getresponse.data);
        setPageMetaData(getMetaDataResponse.data.data.get_all_meta_title);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  const matchedMeta = pageMetaData.find((item) => {
      const slug = item.page_name
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

      return `/${slug}` === pathName;
  });

  useMetaData({
      meta_title: matchedMeta?.meta_title || "Vinhem Fashion",
      meta_description: matchedMeta?.meta_description || "",
      meta_keyword: matchedMeta?.meta_keyword || ""
  });


  const [inputs, setInputs] = useState({
    order_number: "",
    email_id: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.order_number || !inputs.email_id) {
      toast.error("Order number and Email are required");
      return;
    }

    setLoading(true);

    try {
      const response = await http.post("/track-order", {
        order_number: inputs.order_number,
        email: inputs.email_id,
      });

      if (response.data.success) {
        setOrderData(response.data.data);
        // toast.success("Order found successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  // console.log(orderData, 'orderData');

  return (
    <>
      {loading && <Loader />}
      
      <div>
        <div className="container-fluid">
          <div className="aboutusbannr">
            <img src={TrackingOrderDetails?.image_url && TrackingOrderDetails?.data?.banner_image
                ? optimizeImage(`https://fastwork.space/public/FTP-&-Excels/Main-Frame/All-Banners/CMS-Pages/track-orders.jpg`)
                : "none"} className="w-100" style={{borderRadius: "27px", marginTop: "1rem", overflow: "hidden"}} alt="" />
            <div className="sdfgdfgdfg">
                <div className="dfgnhdfjhgdf">
                    <div className="row">
                        <div className="col-lg-8"></div>
                        <div className="col-lg-4">
                            <div className="dfbhdf">
                                {/* <h2>{TrackingOrderDetails.data?.banner_title && TrackingOrderDetails.data.banner_title}</h2> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
        
      <div className="track-order-wrapper">
        <div className="lksnkjererr container-fluid px-5">
          <div className="fdgfrwtyrt row py-5">
            <div className="col-lg-8 mb-5">
              <div className="odkioowepow">
                <h2 className="order-status-title">Track Your Order</h2>
                
                <div className="dieihiewjr">
                  <label className="me-2 mb-2">PLease enter the below details to know about the status of your current order.</label>
                  <form onSubmit={handleSubmit}>
                    <div className="dftgyttredd">
                        <div className="col-lg-8 mb-3">
                            <input className="form-control" name="order_number" placeholder="Order Number *"  value={inputs.order_number}
                              onChange={handleChange}/>
                        </div>

                        <div className="col-lg-8 mb-3">
                            <input className="form-control" name="email_id" placeholder="Email Id *" value={inputs.email_id}
                              onChange={handleChange}/>
                        </div>
                        <button className="btn btn-main px-5 py-2" disabled={loading}>{loading ? "Please wait..." : "SUBMIT"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-12 mb-4">
              {/* <div className="dsfghjyrtrew">
                <h2 className="order-status-title">Your Order Status</h2>

                <p className="order-number">
                  Order Number: <span>0519cb87e4clf274</span>
                </p>

                <p className="updated-time">Estimated Delivery: Friday, Sep 08</p>

                <div className="track-order-container mb-5">
                  <div className="d-flex justify-content-between">
                    <div className="order-tracking completed">
                      <span className="is-complete" />
                      <p>
                        <b>Ordered</b>
                        <br />
                        <span>Mon, June 24</span>
                      </p>
                    </div>
                    <div className="order-tracking completed">
                      <span className="is-complete" />
                      <p>
                        <b>Shipped</b>
                        <br />
                        <span>Tue, June 25</span>
                      </p>
                    </div>
                    <div className="order-tracking">
                      <span className="is-complete" />
                      <p>
                        <b>Delivered</b>
                        <br />
                        <span>Fri, June 28</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="delivery-status">Your order has been delivered!</p>

                <hr />

                <h4 className="past-history-title">Tracking History</h4>

                <div className="history-item">
                  <span className="history-date">27 Sep 23:41</span>Order for{" "}
                  <span className="bold-text">ALL YOU NEED IS LESS</span> - LONG
                  SLEEVE placed
                </div>

                <div className="history-item">
                  <span className="history-date">29 Sep 03:53</span>The campaign
                  successfully reached its goal!
                </div>

                <div className="history-item">
                  <span className="history-date">29 Sep 04:09</span>The campaign
                  has ended and your order is now being printed!
                </div>
              </div> */}

              <div className="dkiejwrnjiowejrwer">
                {/* <h4 className="mb-3">Order Details</h4> */}

                {orderData && (
                  <div className="pkdoewkpoerrr text-center">
                    <Table responsive="lg">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Dispatched By</th>
                          <th>Order Status</th>
                          <th>Current Status Updated On</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>{orderData.order_id}</td>

                          {/* <td>
                            {orderData.shipping_method} &nbsp;
                            {orderData?.pod && (
                              <>
                                :  &nbsp;
                                <a
                                   href={`${BASE_URL}/all_images/pod_files/${orderData.pod}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                >
                                  Click Here
                                </a>
                              </>
                            )}
                          </td> */}

                          <td>
                            {orderData.shipping_method} &nbsp;
                            {orderData?.shipping_method && (
                              <>:  &nbsp;</>
                            )}
                            {orderData?.tracking_link && (
                              <>
                                <a
                                   href={`${orderData.tracking_link}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                >
                                  Click Here
                                </a>
                              </>
                            )}
                          </td>

                          <td>
                            <span className="badge bg-success">
                              {orderData.order_status}
                            </span>
                          </td>

                          <td>
                            Date :
                            {new Date(orderData.updated_at).toLocaleDateString("en-IN")} |
                            {new Date(orderData.updated_at).toLocaleTimeString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="col-lg-5">
              <div className="right-box d-none mb-4">
                <p className="mb-0">
                  Specific details are hidden for privacy reasons,{" "}
                  <a href="/" className="log-in-link">
                    Log in
                  </a>{" "}
                  to view complete details
                </p>
              </div>            
            </div> */}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
