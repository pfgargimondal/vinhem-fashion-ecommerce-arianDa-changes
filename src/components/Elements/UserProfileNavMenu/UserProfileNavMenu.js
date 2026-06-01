import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Css/UserProfileNavMenu.css";
import "./Css/UserProfileNavMenuResponsive.css";
import { useAuth } from "../../../context/AuthContext";

export const UserProfileNavMenu = ({ resUsernavToggle, setResUsernavToggle }) => {
    const { user } = useAuth();       

    const pathName = useLocation().pathname;

    useEffect(() => {
        const html = document.querySelector("html");

        const bodyScrollFixed = () => {
            if (resUsernavToggle) {
                html.classList.add("overflow-hidden");
            } else {
                html.classList.remove("overflow-hidden");
            }
        };

        bodyScrollFixed();
    }, [resUsernavToggle]);

    // const navigate = useNavigate();
    const { dispatch } = useAuth(); 

    const handleLogout = () => {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");

        dispatch({ type: "LOGOUT" });
        // navigate("/login");
    };

    return (
        <>
            <div className="nmkewjirwerr">
                {pathName !== "/profile" && (
                    <div className="user-res-nav-menu-btn d-none my-4" onClick={() => setResUsernavToggle(true)} id="user-prfile-res-btn">
                        <div className="dowerkwerwer d-flex align-items-center">
                            <div className="sdfjhsdfs">
                                <img src="./images/pfle.jpg" alt="" />
                            </div>

                            <h4 className="mb-0 ms-2">{user.name}</h4>
                        </div>

                        <i class="fa-solid ms-2 fa-angles-right"></i>
                    </div>
                )}

                {/* <p className="dokejrlwerwer d-none mb-0">
                    <Link to="/"><i className="fa-solid me-1 fa-arrow-left"></i> Back To Home <i className="fa-solid ms-1 fa-house"></i></Link>
                </p> */}
            </div>

            <div onClick={() => setResUsernavToggle(false)} className={resUsernavToggle ? "user-dashboard-nav-backdrop d-none position-fixed w-100 h-100" : "user-dashboard-nav-backdrop d-none user-dashboard-nav-backdrop-hide position-fixed w-100 h-100"}></div>

            <div className={resUsernavToggle ? "hdkgdfg h-100 sticky-top" : "hdkgdfg h-100 user-dashboard-nav-hide sticky-top"} id="user-dashboard-nav">
                <div className="dfbdf position-relative mb-2 p-3">
                    <h4 className="mb-0">Hi, {user.name}</h4>

                    <i class="fa-solid d-none fa-xmark" onClick={() => setResUsernavToggle(false)}></i>
                </div>

                <div className="p-4">
                    <Link to="/profile">
                        <button className="btn akdhjkashriwerwer pt-0">
                            <i className="fa-solid fa-user"></i> My Profile
                        </button>
                    </Link>

                    <Link to="/wishlist">
                        <button className="btn akdhjkashriwerwer">
                            <i className="fa-regular fa-heart"></i> Your Wishlist
                        </button>
                    </Link>                

                    <Link to="/your-orders">
                        <button className="btn akdhjkashriwerwer">
                            <i className="fa-solid fa-clock-rotate-left"></i> Your Orders
                        </button>
                    </Link>                

                    <Link to="/cancelled-order">
                        <button className="btn akdhjkashriwerwer">
                            <i className="fa-solid fa-ban"></i> Cancelled Order
                        </button>
                    </Link>

                    <Link to="/my-credits">
                        <button className="btn akdhjkashriwerwer">
                            <i class="fa-solid fa-ticket"></i> My Vouchers & Credits
                        </button>
                    </Link>

                    {/* <Link to="/chat">
                        <button className="btn d-flex align-items-center sodmfjlskpflser akdhjkashriwerwer">
                            <i class="fa-regular me-1 fa-comments"></i>
                            
                            <p className="position-relative mb-0">Chat <span></span></p>
                        </button>
                    </Link> */}

                    <Link onClick={handleLogout}>
                        <button className="btn akdhjkashriwerwer">
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </Link>
                </div>

                <div className="njkcfnuwffsdfsf px-4 pb-4">
                    <Link to="/contact-us"><i class="fa-solid me-1 fa-headphones-simple"></i> Get Help</Link>
                </div>
            </div>
        </>
    )
}