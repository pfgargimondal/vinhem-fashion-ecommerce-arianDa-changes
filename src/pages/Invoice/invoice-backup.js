import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "./Css/Invoice.css";
import "./Css/InvoiceResponsive.css";

const Invoice = () => {
  const location = useLocation();
  const invoiceRef = useRef();
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // ✅ Load data from location or localStorage
  const storedData = JSON.parse(localStorage.getItem("invoiceData")) || {};
  const {
    order = storedData.order,
    // eslint-disable-next-line
    user = storedData.user,
    userOrderProduct = storedData.userOrderProduct,
    getProductDetails = storedData.getProductDetails,
    getGSTDetails = storedData.getGSTDetails,
    pdfView = storedData.pdfView,
  } = location.state || {};

  // ✅ Function to generate + preview PDF automatically
  const previewPDF = useCallback(async () => {
    if (!invoiceRef.current) return;

    // Show temporarily to capture
    invoiceRef.current.style.display = "block";

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    // eslint-disable-next-line
    const imgData = canvas.toDataURL("image/png");

    // Hide again
    invoiceRef.current.style.display = "none";

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Margins
    const marginTop = 15;
    const marginRight = 10;
    const marginBottom = 15;
    const marginLeft = 10;

    const usableWidth = pdfWidth - marginLeft - marginRight;
    // eslint-disable-next-line
    const usableHeight = pdfHeight - marginTop - marginBottom;

    const imageHeight = (canvas.height * usableWidth) / canvas.width;
    let y = marginTop;

    pdf.addImage(canvas, "PNG", marginLeft, y, usableWidth, imageHeight);

   // ✅ Auto preview
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // Opens in new tab
    pdf.save(`invoice-${order?.order_id || "Invoice"}.pdf`);

    // ✅ Redirect to previous page after 1s
    setTimeout(() => {
      navigate(-1); // 🔙 goes back to previous route
    }, 100);
  }, [navigate, order]);

  // ✅ Trigger auto-preview only once when pdfView is true
  useEffect(() => {
    if (pdfView) {
      // delay a bit to ensure content fully rendered
      const timer = setTimeout(() => {
        setReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pdfView]);

  useEffect(() => {
    if (pdfView && ready) {
      previewPDF();
    }
  }, [pdfView, ready, previewPDF]);

  return (
    <div id="invoice-content" className="invoice-box my-5">

      <div ref={invoiceRef} >
        <div className="invoicetable">

            <table className="header">
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000"}}> 
                    <span className="logo d-block py-3 text-center">
                      <img src="./images/logo.png" alt="" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Date & Invoice No */}
            
            <table>
              <tbody>
                <tr>
                  <td style={{ borderRight: "1px solid #000", borderLeft: "1px solid #000", borderBottom: 0 }}>
                    {(order?.order_date || order?.order_time) && (
                      <b>
                        Date : {order?.order_date || "-"} - Time : {order?.order_time || "-"}
                      </b>
                    )}

                  </td>
                  <td
                    className="right pe-5"
                    style={{ borderLeft: 0, borderRight: "1px solid #000", borderBottom: 0 }}
                  >
                    <b>INVOICE NO : {order?.invoice_no}</b>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Sold To */}
            <table>
              <tbody>
                <tr>
                  <td
                    style={{ borderBottom: "2px dashed", borderLeft: "1px solid #000", borderRight: "1px solid #000" }}
                    className="pb-3"
                  >
                    <span>Sold To:</span>
                    <br />
                    <b>{order?.billingName}<br />
                    {order?.billingCity}<br/>
                    {order?.billingFullAddress}<br/>
                    {order?.billingCountry}</b>
                    
                    {/* <br />
                    <b>WILMINGTON, NC 28409-3124</b>
                    <br />
                    <b>United States</b> */}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Order ID */}
            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      borderTop: 0,
                      borderBottom: "2px dashed",
                      borderLeft: "1px solid #000",
                      borderRight: "1px solid #000"
                    }}
                    className="py-3"
                  >
                    <b>Order ID: {order?.order_id}</b> <br />
                    Thank you for buying from VinHem Fashion.
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Shipping & Order Details */}
            <table >
              <tbody>
                <tr>
                  <td style={{ borderTop: 0, borderLeft: "1px solid #000", }} className="py-3">
                    <b>Shipping Address:</b>
                    <br />
                    {order?.shippingName} , {order?.shippingFullAddress}
                    <br />
                    {order?.shippingCountry}
                  </td>
                  <td className="py-3" style={{ borderTop: 0, borderRight: "1px solid #000" }}>
                    Order Date : {new Date(order?.order_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })} <br />
                    Buyer Name: {order?.billingName} <br />
                    {order?.shipping_method && (
                      <p><b>Shipping Service:</b> {order?.shipping_method}</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

          {/* 🧾 Product + Shipping + Subtotal Table */}
            <table style={{ border: "1px solid #000", borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", textAlign: "center" }}>Quantity</th>
                  <th style={{ border: "1px solid #000", textAlign: "center" }}>Product Details</th>
                  <th style={{ border: "1px solid #000", textAlign: "center", width: "34.2%" }}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {(() => {
                  // eslint-disable-next-line
                  const subTotal = userOrderProduct?.reduce(
                    (sum, item) => sum + parseFloat(item.total_price || 0),
                    0
                  );

                  const shipping = parseFloat(order?.shipping_charge || 0);

                  return (
                    <>
                      {userOrderProduct?.map((item) => {
                        const productDetail = getProductDetails?.find(
                          (p) => p.id === item.product_id
                        );

                        return (
                          <tr key={item.id}>
                            {/* Quantity */}
                            <td
                              style={{
                                border: "1px solid #000",
                                borderBottom:0,
                                textAlign: "center",
                                padding: "6px",
                              }}
                            >
                              {item.quantity}
                            </td>

                            {/* Product details nested table */}
                            <td style={{ border: "1px solid #000", padding: "0" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                  <tr>
                                    <td style={{ padding: "6px", borderBottom: "1px solid #000" }}>
                                      <b>{item.product_name}</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "6px", borderBottom: "1px solid #000" }}>
                                      ITEM ID: {productDetail?.item_id}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "6px", borderBottom: "1px solid #000" }}>
                                      SIZE: {item.product_size || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "6px" }}>
                                      HSN CODE: {getGSTDetails?.[0]?.hsn || "(8 Digit Code)"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>

                            {/* Product price */}
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                              ₹{item.total_price}
                            </td>
                          </tr>
                        );
                      })}

                      {/* ✅ SHIPPING ROW OUTSIDE PRODUCT LOOP */}
                      <tr>
                        <td style={{ border: "1px solid #000", borderTop: "0" }}></td>
                        <td
                          style={{
                            border: "1px solid #000",
                            borderTop: "0",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Shipping & Duties
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            borderTop: "0",
                            textAlign: "center",
                          }}
                        >
                          ₹{shipping > 0 ? shipping.toFixed(2) : "Free"}
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>

            {/* 🧮 TAX COLLECT Table */}
            <table style={{ border: "1px solid #000", borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {(() => {
                  const subTotal = userOrderProduct?.reduce(
                    (sum, item) => sum + parseFloat(item.total_price || 0),
                    0
                  );

                  const shippingState = order?.shippingState || "west bengal"; // Fallback
                  let cgst = 0, sgst = 0, igst = 0, totalGst = 0;

                  if (shippingState === "west bengal") {
                    cgst = subTotal * 0.09;
                    sgst = subTotal * 0.09;
                    totalGst = cgst + sgst;
                  } else {
                    igst = subTotal * 0.18;
                    totalGst = igst;
                  }

                  return (
                    <>
                      <tr>
                        <td rowSpan={shippingState === "west bengal" ? 3 : 2} style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontWeight: "bold",
                          fontSize: "1.2rem", width: "79.5%"
                        }}>
                          TAX COLLECT
                        </td>

                        {shippingState === "west bengal" ? (
                          <>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                              CGST @ 9%
                            </td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                              ₹{cgst.toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                              IGST @ 18%
                            </td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                              ₹{igst?.toFixed(2)}
                            </td>
                          </>
                        )}
                      </tr>

                      {shippingState === "west bengal" && (
                        <tr>
                          <td style={{ border: "1px solid #000", textAlign: "center" }}>
                            SGST @ 9%
                          </td>
                          <td style={{ border: "1px solid #000", textAlign: "center" }}>
                            ₹{sgst?.toFixed(2)}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td style={{ border: "1px solid #000", textAlign: "center" }}>
                          Total GST
                        </td>
                        <td style={{ border: "1px solid #000", textAlign: "center" }}>
                          ₹{totalGst?.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>

            {/* 💰 TOTAL Table */}
            <table style={{ border: "1px solid #000", borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {(() => {
                  const subTotal = userOrderProduct?.reduce(
                    (sum, item) => sum + parseFloat(item.total_price || 0),
                    0
                  );
                  const shipping = parseFloat(order?.shipping_charge || 0);
                  const billingCountry = order?.billingCountry || "India";

                  let cgst = 0, sgst = 0, igst = 0, totalGst = 0;
                  if (billingCountry === "India") {
                    cgst = subTotal * 0.09;
                    sgst = subTotal * 0.09;
                    totalGst = cgst + sgst;
                  } else {
                    igst = subTotal * 0.18;
                    totalGst = igst;
                  }
                  // eslint-disable-next-line
                  const grandTotal = subTotal + totalGst + shipping;

                  return (
                    <tr>
                      <td style={{
                        border: "1px solid #000",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        width: "79.5%",
                      }}>
                        TOTAL
                      </td>
                      <td style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        fontSize: "1.4rem",
                        fontWeight: "bold",
                      }}>
                        ₹{order?.total_order_amount || 0}
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>





        {/* Payment Mode */}
        <table  style={{border:1 }}>
          <tbody>
            <tr>
              <td
                className="text-center bold"
                style={{ fontSize: "1.2rem", width: "79.5%" }}
              >
                PAYMENT MODE
              </td>
            <td
                className="text-center"
                style={{ fontSize: "1.2rem", borderRight: "1px solid #000" }}
              >
                <b>
                {order?.payment_method === "prepaid" 
                  ? "PREPAID" 
                  : order?.payment_method === "cash_on_delivery" 
                    ? "COD" 
                    : ""}

                    </b>
              </td>

            </tr>
          </tbody>
        </table>


        {/* Footer */}
        <table className="no-border">
          <tbody>
            <tr>
              <td className="text-center" style={{border: "1"}}>
                <b>Returning your item:</b>
                <br />
                Go to "Your Account" on Vinhemfashion.com.com, click "Your Orders" and
                then click the "Mark Return" link for this order to get information
                about the return and refund policies that apply.
              </td>
            </tr>
          </tbody>
        </table>

        {/* PDF buttons below footer */}
        </div>
      </div>

  {/* <button onClick={previewPDF}>Preview PDF</button> */}


    </div>


   
  )
}
export default Invoice;