import { useEffect, useState } from "react";
import { toggleZohoChatWindow } from "../../../utils/zohoChat";
import { useLocation } from "react-router-dom";

const GlobalChat = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      toggleZohoChatWindow(false);
    }, 1500);
  }, []);

  const handleClick = () => {
    toggleZohoChatWindow(!isOpen);
    setIsOpen(!isOpen);
  };

  if (location.pathname.startsWith("/blog")) {
    return null;
  }

  return (
    <div
      className="dkwejkrhiwenrower position-fixed"
      onClick={handleClick}
    >
      <i
        className={`bi text-white position-absolute ${
          isOpen ? "bi-x-lg" : "bi-chat-dots-fill"
        }`}
      ></i>
    </div>
  );
};

export default GlobalChat;