import { useState } from "react";
import "./Css/ChatProfileDetails.css";
import { optimizeImage } from "../../../utils/optimizeImage";

// ✅ GLOBAL FLAG (IMPORTANT)
let zohoInitialized = false;

// ✅ INIT FUNCTION (RUN ONLY ONCE)
const initZohoUser = () => {
  if (window.$zoho && window.$zoho.salesiq && !zohoInitialized) {
    window.$zoho.salesiq.visitor.name("Customer");
    window.$zoho.salesiq.visitor.email("customer@email.com");

    zohoInitialized = true;
  }
};

export const ChatProfileDetails = ({ setChatProfileDetailsShow }) => {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      avatar: "/Fevicon.png",
      text: "Welcome to VinHem Fashion! How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;

    // ✅ Add user message in UI
    setMessages(prev => [
      ...prev,
      { sender: "user", avatar: "/Fevicon.png", text: userMessage }
    ]);

    setInput("");

    // ✅ Initialize Zoho (only once)
    initZohoUser();

    // ✅ Open Zoho chat safely
    if (window.$zoho && window.$zoho.salesiq) {
      try {
        window.$zoho.salesiq.floatwindow.visible("show");
      } catch (e) {
        console.log("Zoho not ready yet");
      }
    }

    // ✅ Show system message
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        avatar: "/Fevicon.png",
        text: "We’ve opened live support. Please continue there →",
      },
    ]);
  };

  return (
    <div className="chat-profile-details-wrapper position-fixed">
      <i
        onClick={() => setChatProfileDetailsShow(false)}
        className="bi bi-x position-absolute"
      ></i>

      <div className="coisdejnkfrhewir">
        <div className="dcsdfnhrtdfsv p-3">
          <div className="text-center">
            <img src="/images/logo.png" className="bg-white p-2 rounded-2 mb-3" alt="" />
          </div>

          <h6 className="mb-1 text-white">VinHem Fashion CRM Support</h6>
          <p className="mb-0 text-white">Typically replies within 7 minutes</p>
        </div>

        <div className="domwejewrwer bg-white px-3 py-2">
          <div className="doiewnjrwerwer bg-white px-2 py-3">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex align-items-center mb-4 ${
                  msg.sender === "user"
                    ? "flex-row-reverse user-msge"
                    : "admn-msge"
                }`}
              >
                <div className="text-center rounded-pill mx-1">
                  <img src={optimizeImage(msg.avatar)} alt="avatar" />
                </div>

                <div>
                  <div
                    className={`p-3 ${
                      msg.sender === "user"
                        ? "rounded-end-1 rounded-bottom-4 rounded-start-4"
                        : "rounded-end-4 rounded-bottom-4 rounded-top-1"
                    }`}
                  >
                    <h6 className="mb-0">{msg.text}</h6>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="depjorierer position-relative">
          <textarea
            className="form-control rounded-0"
            placeholder="Reply here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          ></textarea>
        </div>
      </div>
    </div>
  );
};