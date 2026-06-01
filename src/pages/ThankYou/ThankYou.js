import { Link } from "react-router-dom";
import "./Css/ThankYou.css";
import "./Css/ThankYouResponsive.css";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const ThankYou = () => {
  return (
    <>
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon-container">
          <div className="circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-icon"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Decorative dots */}
            <div className="particles">
                {Array.from({ length: 22 }).map((_, i) => (
                    <span key={i} className={`dot dot-${i}`}></span>
                ))}
            </div>
        </div>

        <h2>Thank you for ordering!</h2>
        <p>
          Your order has been placed and being processed. You will receive an order confirmation email
          with details shortly.
        </p>

        <div className="button-group">
          <Link to={"/your-orders"}><button className="btn-outline"><i className="fa-solid me-1 fa-clock-rotate-left"></i> VIEW ORDER</button></Link>
          <Link to={"/"}><button className="btn-primary"><i className="bi me-1 bi-house-door"></i> CONTINUE SHOPPING</button></Link>
        </div>
      </div>
    </div>
    <hr className="doewjirhweiewrer"/>
    
    <FooterTopComponent />
    </>
  )
}