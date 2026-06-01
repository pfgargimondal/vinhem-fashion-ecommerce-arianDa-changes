import { Tab } from "bootstrap";
import { useState } from "react";
import { Table, Tabs } from "react-bootstrap";

export const DesignerSizeChart = ({ productDetails }) => {
  const [isCms, setIsCms] = useState(false); // false = inches, true = cms

  const handleToggle = () => setIsCms(!isCms);

  const sizeChart = productDetails?.data?.designer_sizeChart || [];
  const firstSizeChart = productDetails?.data?.designer_sizeChart?.[0];

  // console.log(firstSizeChart);

  return (
    <Tabs
      defaultActiveKey="home"
      id="uncontrolled-tab-example"
      className="mb-3 justify-content-center"
    >
      <Tab eventKey="home" title="SIZE GUIDE">
        <div className="diekhjwerwer">
          {productDetails?.data?.product_category?.toLowerCase() === "accessories" ? (
            productDetails?.data?.product_sub_category?.toLowerCase() === "foot wear" ? (
              <>
                <div className="djnweuihrwer">
              <div className="opmkojwojoiwere d-flex justify-content-between">
                <div className="dkewhknewhirwer">
                  <h5>Footwear Measurement</h5>

                  <h6 className="mb-0">
                    Tip : If you don't find an exact match, go for the next size
                  </h6>
                </div>

                <div className="oidahijeoijer d-flex align-items-center">
                  <p className="mb-0">In</p>

                  <div className="checkbox-wrapper-2 mx-1">
                    <input
                      type="checkbox"
                      className="sc-gJwTLC ikxBAC"
                      checked={isCms}
                      onChange={handleToggle}
                    />
                  </div>

                  <p className="mb-0">Cm</p>
                </div>
              </div>
              <div className="jnmkjhihewirwer mt-3">
                <Table responsive="xl">
                      <thead>
                        <tr>
                          <th>Size Name</th>
                          <th>INDIA</th>
                          <th>US</th>
                          <th>UK</th>
                          <th>EURO</th>
                          <th>AUS</th>
                          <th>Foot Length ({isCms ? "CM." : "IN."})</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sizeChart.map((item) => (
                          <tr key={item.id}>
                            <td>{item.size_name || "-"}</td>
                            <td>{item.size_india || "-"}</td>
                            <td>{item.us || "-"}</td>
                            <td>{item.uk || "-"}</td>
                            <td>{item.size_euro || "-"}</td>
                            <td>{item.size_aus || "-"}</td>
                            <td>
                              {isCms
                                ? item.front_length_cm || "-"
                                : item.front_length_in || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                </Table>
              </div>
            </div>
              </>
            ) : (
              <>
              </>
            )
          ) : (
            <div className="djnweuihrwer">
              <div className="opmkojwojoiwere d-flex justify-content-between">
                <div className="dkewhknewhirwer">
                  {/* <h5>Size Chart for {productDetails?.data?.product_category}</h5> */}
                    {productDetails?.data?.product_category?.toLowerCase() === "men" ? (
                      <h6 className="mb-0">
                        BODY MEASUREMENTS [ 3-4 INCHES LOOSENING REQUIRED]
                      </h6>
                    ) : productDetails?.data?.product_category?.toLowerCase() === "women" ? (
                      <h6 className="mb-0">
                        BODY MEASUREMENTS [ 1-2 INCHES LOOSENING REQUIRED]
                      </h6>
                    ) : null}
                </div>

                <div className="oidahijeoijer d-flex align-items-center">
                  <p className="mb-0">In</p>

                  <div className="checkbox-wrapper-2 mx-1">
                    <input
                      type="checkbox"
                      className="sc-gJwTLC ikxBAC"
                      checked={isCms}
                      onChange={handleToggle}
                    />
                  </div>

                  <p className="mb-0">Cm</p>
                </div>
              </div>
              <div className="jnmkjhihewirwer mt-3">
                <Table responsive="xl">
                  {productDetails?.data?.product_category?.toLowerCase() === "women" && (
                    <>
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>UK</th>
                          <th>US</th>
                          <th>Bust ({isCms ? "Cm" : "In"})</th>
                          <th>Waist ({isCms ? "Cm" : "In"})</th>
                          <th>Hip ({isCms ? "Cm" : "In"})</th>

                          {/* Dynamic headers for extra fields */}
                          {firstSizeChart?.extra1 && (
                            <th>
                              {firstSizeChart.extra1} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra2 && (
                            <th>
                              {firstSizeChart.extra2} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra3 && (
                            <th>
                              {firstSizeChart.extra3} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {sizeChart.map((item) => (
                          <tr key={item.id}>
                            <td>{item.size_name || "-"}</td>
                            <td>{item.uk || "-"}</td>
                            <td>{item.us || "-"}</td>

                            <td>
                              {isCms ? item.bust_cm || "-" : item.bust_in || "-"}
                            </td>
                            <td>
                              {isCms
                                ? item.waist_cm || "-"
                                : item.waist_in || "-"}
                            </td>
                            <td>
                              {isCms ? item.hip_cm || "-" : item.hip_in || "-"}
                            </td>
                            {/* Dynamic extra fields */}
                            {firstSizeChart?.extra1 && (
                              <td>
                                {isCms
                                  ? item.extra1_cm || "-"
                                  : item.extra1_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra2 && (
                              <td>
                                {isCms
                                  ? item.extra2_cm || "-"
                                  : item.extra2_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra3 && (
                              <td>
                                {isCms
                                  ? item.extra3_cm || "-"
                                  : item.extra3_in || "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {productDetails?.data?.product_category?.toLowerCase() === "men" && (
                    <>
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th style={{ width: "80px" }}>UK</th>
                          <th>US</th>
                          <th>Chest ({isCms ? "Cm" : "In"})</th>
                          <th>Shoulder ({isCms ? "Cm" : "In"})</th>
                          <th>Waist ({isCms ? "Cm" : "In"})</th>
                          <th>Length ({isCms ? "Cm" : "In"})</th>

                          {/* Dynamic headers for extra fields */}
                          {firstSizeChart?.extra1 && (
                            <th>
                              {firstSizeChart.extra1} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra2 && (
                            <th>
                              {firstSizeChart.extra2} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra3 && (
                            <th>
                              {firstSizeChart.extra3} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {sizeChart.map((item) => (
                          <tr key={item.id}>
                            <td>{item.size_name || "-"}</td>
                            <td style={{ width: "80px" }}>{item.uk || "-"}</td>
                            <td>{item.us || "-"}</td>
                            <td>
                              {isCms ? item.chest_cm || "-" : item.chest_in || "-"}
                            </td>
                            <td>
                              {isCms
                                ? item.shoulder_cm || "-"
                                : item.shoulder_in || "-"}
                            </td>
                            <td>
                              {isCms ? item.waist_cm || "-" : item.waist_in || "-"}
                            </td>
                            
                            <td>
                              {isCms ? item.length_cm || "-" : item.length_in || "-"}
                            </td>
                            {/* Dynamic extra fields */}
                            {firstSizeChart?.extra1 && (
                              <td>
                                {isCms
                                  ? item.extra1_cm || "-"
                                  : item.extra1_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra2 && (
                              <td>
                                {isCms
                                  ? item.extra2_cm || "-"
                                  : item.extra2_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra3 && (
                              <td>
                                {isCms
                                  ? item.extra3_cm || "-"
                                  : item.extra3_in || "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {productDetails?.data?.product_category?.toLowerCase() === "kids wear" && (
                    <>
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Age</th>
                          <th>Top Chest ({isCms ? "Cm" : "In"})</th>
                          <th>Top Length ({isCms ? "Cm" : "In"})</th>
                          <th>Bottom Length ({isCms ? "Cm" : "In"})</th>

                          {/* Dynamic headers for extra fields */}
                          {firstSizeChart?.extra1 && (
                            <th>
                              {firstSizeChart.extra1} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra2 && (
                            <th>
                              {firstSizeChart.extra2} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                          {firstSizeChart?.extra3 && (
                            <th>
                              {firstSizeChart.extra3} ({isCms ? "Cm" : "In"})
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {sizeChart.map((item) => (
                          <tr key={item.id}>
                            <td>{item.size_name || "-"}</td>
                            <td>{item.age || "-"}</td>
                            <td>
                              {isCms ? item.top_chest_cm || "-" : item.top_chest_in || "-"}
                            </td>
                            <td>
                              {isCms ? item.top_length_cm || "-" : item.top_length_in || "-"}
                            </td>
                            <td>
                              {isCms
                                ? item.bottom_length_cm || "-"
                                : item.bottom_length_in || "-"}
                            </td>
                            {/* Dynamic extra fields */}
                            {firstSizeChart?.extra1 && (
                              <td>
                                {isCms
                                  ? item.extra1_cm || "-"
                                  : item.extra1_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra2 && (
                              <td>
                                {isCms
                                  ? item.extra2_cm || "-"
                                  : item.extra2_in || "-"}
                              </td>
                            )}
                            {firstSizeChart?.extra3 && (
                              <td>
                                {isCms
                                  ? item.extra3_cm || "-"
                                  : item.extra3_in || "-"}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </Table>
              </div>
            </div>
          )}
          

          <div className="oijdkejwjewr p-4">
            <h6>
              <i class="fa-brands me-1 fa-whatsapp"></i> Whatsapp Us at{" "}
              <span>+91 7003672926</span> if you are unsure of your size.
            </h6>

            <p className="mb-0">
              This is a standard size guide for the basic measurements. Length
              will vary according to style. There may also be variations in some
              brands commonly with Indian clothing, so please refer to the
              product measurements displayed on the product page. Alternatively,
              you may contact our customer care for specific queries at
              vinhemfashion.com
            </p>
          </div>
        </div>
      </Tab>

      <Tab eventKey="profile" title="MEASURING GUIDE">
        {productDetails?.data?.product_category?.toLowerCase() === "men" && (
          <img src="/images/Mens Wear.png" className="img-fluid" alt="" />
        )}
        {productDetails?.data?.product_category?.toLowerCase() === "women" && (
          <img src="/images/Womens Wear.png" className="img-fluid" alt="" />
        )}

        {productDetails?.data?.product_sub_category?.includes("(Boys)") && (
          <img src="/images/Boys.png" className="img-fluid" alt="" />
        )}

        {productDetails?.data?.product_sub_category?.includes("(Girls)") && (
          <img src="/images/Girls.png" className="img-fluid" alt="" />
        )}

        {productDetails?.data?.product_category?.toLowerCase() === "accessories" && (
            productDetails?.data?.product_sub_category?.toLowerCase() === "foot wear" && (
            <>
            <img src="/images/foot-measurment-1.png" alt="" />
            </>
        ))}
      </Tab>
    </Tabs>
  );
};
