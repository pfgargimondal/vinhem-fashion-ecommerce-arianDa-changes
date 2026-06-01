import { Link } from "react-router-dom";
import "./Css/DropdownLoggedIn.css";
import { useAuth } from "../../../context/AuthContext";

export const DropdownLoggedIn = () => {

  // const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, dispatch } = useAuth(); // ✅ Access logout and user from context

  const handleLogout = () => {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    // navigate("/login");
    
    // logout();           
    // navigate("/login"); 
  };

  return (
    <div className="dropdown-loggedin bg-white position-absolute p-2 mt-1">
        <ul className="ps-0 mb-0">
            <li>
              <Link to="/profile" className="d-flex bfhtyrae align-items-center justify-content-between">
                <div className="deoiwjrwer">
                  <i class="fa-solid fa-user"></i> My Profile
                </div>

                <span className="prfl-optns-divider d-flex align-items-center">|</span>

                <div className="diewirjwejrwer">
                  <img src="./images/sadw.png" alt="" />
                </div>
              </Link>
            </li>

            <li><Link to={'/my-credits'}><i class="fa-solid fa-ticket"></i> My Credits</Link></li>
            
            <li><Link to={'/wishlist'}><i class="fa-regular fa-heart"></i> Your Wishlist</Link></li>

            <li><Link to={'/your-orders'}><i class="fa-solid fa-clock-rotate-left"></i> Your Orders</Link></li>

            <li><Link to={'/track-order'}><i class="fa-solid fa-shuffle"></i> Track Order</Link></li>

            <li onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i> Logout</li>            
        </ul>
    </div>
  )
}