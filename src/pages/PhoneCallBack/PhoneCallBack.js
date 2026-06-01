import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../http";

export const PhoneCallBack = ({ setCompleteLoginModal, setVerifiedContact }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const query = window.location.search;

      const res = await http.get(
        `/user/phone-callback${query}`,
        { withCredentials: true }
      );

      if (res.data.status === "login") {
        localStorage.setItem("token", res.data.token);
        // navigate("/");
      }

      if (res.data.status === "register") {
        setVerifiedContact(res.data);
        setCompleteLoginModal(true);
        // navigate("/");
      }
    };

    handleAuth();
  }, [navigate, setCompleteLoginModal, setVerifiedContact]);

  return <h3>Verifying...</h3>;
};
