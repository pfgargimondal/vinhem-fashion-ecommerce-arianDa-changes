import { createContext, useContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

/* ===============================
   1️⃣ CHECK TOKEN EXPIRY ON LOAD
================================ */
const token = localStorage.getItem("jwtToken");
// const expiry = localStorage.getItem("tokenExpiry");

let validToken = null;
let validUser = null;

if (token) {
  validToken = token;
  validUser = JSON.parse(localStorage.getItem("user"));
} else {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  // localStorage.removeItem("tokenExpiry");
}

const initialState = {
  token: validToken,
  user: validUser,
};

/* ===============================
   2️⃣ REDUCER
================================ */
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.payload.token, user: action.payload.user };

    case "LOGOUT":
      return { token: null, user: null };

    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
}
 
/* ===============================
   3️⃣ PROVIDER
================================ */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* 🔐 Auto logout if expired (extra safety) */
  // useEffect(() => {
  //   const expiry = localStorage.getItem("tokenExpiry");

  //   if (expiry && new Date().getTime() > parseInt(expiry)) {
  //     localStorage.clear();
  //     dispatch({ type: "LOGOUT" });
  //     // navigate("/login");//////////
  //   }
  // }, [navigate]);

  /* ✅ Fetch profile if token exists but user not loaded */
  useEffect(() => {
    if (state.token && !state.user) {
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${state.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch({ type: "UPDATE_PROFILE", payload: data.user });
          } else {
            localStorage.clear();
            // navigate("/login");
          }
        })
        .catch(() => {
          localStorage.clear();
          // navigate("/login");
        });
    }
  }, [state.token, state.user, navigate]);

  /* ===============================
     4️⃣ CUSTOM DISPATCH
  ================================ */
  const customDispatch = (action) => {
    switch (action.type) {
      case "LOGIN":
        // const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours

        localStorage.setItem("jwtToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        // localStorage.setItem("tokenExpiry", expiryTime);

        dispatch(action);
        // navigate("/");
        break;

      case "LOGOUT":
        localStorage.clear();
        dispatch(action);
        // navigate("/login");
        break;

      case "UPDATE_PROFILE":
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state.user, ...action.payload })
        );
        dispatch(action);
        break;

      default:
        dispatch(action);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch: customDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);