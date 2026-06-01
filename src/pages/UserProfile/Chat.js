import { Link } from "react-router-dom";
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/Chat.module.css";
import { useEffect, useRef, useState } from "react";
import http, { BASE_URL } from "../../http";
import EmojiPicker from "emoji-picker-react";
import Loader from "../../components/Loader/Loader";
import { optimizeImage } from "../../utils/optimizeImage";

export const Chat = () => {

  const [loading, setLoading] = useState(false);  
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatAdmins, setChatAdmins] = useState([]);
  const [chatSupportAvatarBaseURL, setChatSupportAvatarBaseURL] =
    useState(null);
  // eslint-disable-next-line
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  // When file selected
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
    } else {
        setFilePreview("/file-icon.png"); // pdf/doc icon
    }
    };

  // Remove file
    const removeFile = () => {
    setSelectedFile(null);
    setFilePreview("");
    fileInputRef.current.value = "";
    };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !selectedSupport) return;

    const tempId = Date.now();

    // ✅ OPTIMISTIC MESSAGE (MATCH BACKEND STRUCTURE)
    const optimisticMsg = {
      id: tempId,
      message: message,
      sender: "me",
      user_type: "User",
      status: "sending",
      attachment: selectedFile ? selectedFile.name : null,
      attachment_type: selectedFile ? selectedFile.type : null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessage("");
    setSelectedFile(null);
    setShowEmoji(false);

    try {

      setLoading(true);

      const formData = new FormData();
      formData.append("reciver_id", selectedSupport.id);
      formData.append("message", optimisticMsg.message);

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      await http.post("/user/post-chat-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "sent" } : msg,
        ),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "error" } : msg,
        ),
      );
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const getresponse = await http.get("/fetch-all-admin");
        const chatWithAdmins = getresponse.data.data;

        setChatSupportAvatarBaseURL(getresponse.data.image_url);
        setChatAdmins(chatWithAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!selectedSupport) return;

    const fetchMessages = async () => {
      try {
        const response = await http.post("/user/fetch-chat-message", {
          reciver_id: selectedSupport.id,
        });
        setMessages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Fetch immediately
    fetchMessages();

    // Auto refresh every 5 seconds
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [selectedSupport]);

  // const sendMessage = async () => {
  //     if (!message.trim() || !selectedSupport) return;

  //     const messageText = message.trim();

  //     const newMessage = {
  //         id: Date.now(),
  //         text: messageText,
  //         sender: "me",
  //         created_at: new Date().toISOString(),
  //         status: "sending",
  //     };

  //     // Optimistic UI update
  //     setMessages((prev) => [...prev, newMessage]);
  //     setMessage("");

  //     try {
  //         await http.post("/user/post-chat-message", {
  //         reciver_id: selectedSupport.id,
  //         message: messageText,
  //         });

  //         setMessages((prev) =>
  //         prev.map((msg) =>
  //             msg.id === newMessage.id
  //             ? { ...msg, status: "sent" }
  //             : msg
  //         )
  //         );
  //     } catch (error) {
  //         console.error("Error sending message:", error);

  //         setMessages((prev) =>
  //         prev.map((msg) =>
  //             msg.id === newMessage.id
  //             ? { ...msg, status: "error" }
  //             : msg
  //         )
  //         );
  //     }
  // };

  // ✅ Auto scroll chat box
  useEffect(() => {
    const chatBox = document.querySelector(`.${styles.ldknwejknlkkekrrr}`);
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.ffhfdf}>
        {loading && <Loader />}
      <div className="ansjidnkuiweer">
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu />
            </div>

            <div className="col-lg-9">
              <div className={styles.fgcbdfgdf}>
                <div
                  className={`${styles.alojdkmlkoljeirr} row border border-start-0 border-bottom-0 rounded shadow-sm`}
                  style={{ height: "90vh" }}
                >
                  {/* Left Users Panel */}
                  <div className="col-lg-3 border-end p-0">
                    <div className="p-3 border-bottom fw-bold">Support</div>

                    <div className={styles.diewnrnwekhriwejrwejr}>
                      {chatAdmins.map((chatAdmin) => (
                        <div
                          key={chatAdmin.id}
                          className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom user-item"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedSupport(chatAdmin);
                            setMessages([]);
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={optimizeImage(`${chatSupportAvatarBaseURL}/${chatAdmin.profile_picture}`)}
                              alt={chatAdmin.name}
                              className="rounded-circle me-2"
                              width="40"
                              height="40"
                            />
                            <div>
                              <div className="fw-semibold">
                                {chatAdmin.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Chat Panel */}
                  <div className="col-lg-9 d-flex flex-column">
                    <div className="border-bottom d-flex align-items-center justify-content-between p-3 fw-semibold">
                      {selectedSupport
                        ? `Chat with ${selectedSupport.name}`
                        : "Please select a support option to start chatting"}

                      <div className="d-flex align-items-center justify-content-end">
                        <p
                          className={`${styles.ndiwhermweoewrr} mb-0 me-3 d-none`}
                        >
                          <Link to="/">
                            <i className="fa-solid me-1 fa-arrow-left" />
                            Back To Home
                            <i className="fa-solid ms-1 fa-house" />
                          </Link>
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div
                      className={`${styles.ldknwejknlkkekrrr} flex-grow-1 p-3 bg-light`}
                    >
                      {loadingMessages ? (
                        <div className="text-muted text-center mt-5">
                          Loading messages...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-muted text-center mt-5">
                          {selectedSupport
                            ? "Start chatting..."
                            : "Select a support person from the user panel"}
                        </div>
                      ) : (
                        messages.map((msg, index) => {
                          const isUser =
                            msg.user_type === "User" || msg.sender === "me";
                          const align = isUser
                            ? "justify-content-end"
                            : "justify-content-start";

                          const color = isUser
                            ? `${styles.bg_pink} text-white`
                            : "bg-secondary text-white";

                          const messageContent = [];

                          const text = msg.message ?? msg.text;
                          if (text) {
                            messageContent.push(<div key="text">{text}</div>);
                          }

                          if (msg.attachment && msg.attachment_type) {
                            const fileUrl = `${BASE_URL}/public/all_images/chat_attachments/${msg.attachment}`;

                            if (msg.attachment_type.startsWith("image/")) {
                              messageContent.push(
                                <img
                                  key="img"
                                  src={optimizeImage(fileUrl)}
                                  alt=""
                                  className="img-fluid rounded mt-1"
                                  style={{ maxWidth: "200px" }}
                                />,
                              );
                            } else if (
                              msg.attachment_type.startsWith("video/")
                            ) {
                              messageContent.push(
                                <video
                                  key="video"
                                  controls
                                  className="mt-1"
                                  style={{ maxWidth: "220px" }}
                                >
                                  <source
                                    src={fileUrl}
                                    type={msg.attachment_type}
                                  />
                                </video>,
                              );
                            } else {
                              messageContent.push(
                                <a
                                  key="file"
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="d-inline-flex align-items-center gap-1 mt-1 fw-semibold"
                                  style={{ color: isUser ? "#fff" : "#000" }}
                                >
                                  <i className="bx bx-paperclip"></i> Download
                                  file
                                </a>,
                              );
                            }
                          }

                          return (
                            <div key={index} className={`mb-2 d-flex ${align}`}>
                              <div
                                className={`p-2 rounded ${color}`}
                                style={{ maxWidth: "70%" }}
                              >
                                {messageContent}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Input */}
                    <div className={styles.cdrgbghjjfgrfvrt}>
                        {selectedFile && (
                        <div className={styles.filePreview}>
                            <div className={styles.fileLeft}>
                            <img src={filePreview} alt="file" />
                            <span title={selectedFile.name}>
                                {selectedFile.name}
                            </span>
                            </div>
                            <i
                            className="bi bi-x-lg"
                            onClick={removeFile}
                            style={{ cursor: "pointer" }}
                            ></i>
                        </div>
                        )}
                        <br/>
                      <div className={styles.inputBox}>
                        <input
                          type="text"
                          placeholder="Type a message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={!selectedSupport}
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            onChange={handleFileChange}
                        />
                        <span className={styles.divider}></span>
                        <div className={styles.icons}>
                          <i class="bi bi-paperclip" onClick={() => fileInputRef.current.click()}></i>
                          <i
                            className="bi bi-emoji-smile"
                            onClick={() => setShowEmoji((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
                      {showEmoji && (
                        <div className={styles.emojiBox}>
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                      )}
                      <button
                        className="btn btn-main ms-2"
                        onClick={sendMessage}
                        disabled={!selectedSupport}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
