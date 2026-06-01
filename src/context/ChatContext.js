import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatProfileDetailsShow, setChatProfileDetailsShow] = useState(false);

  return (
    <ChatContext.Provider
      value={{ chatProfileDetailsShow, setChatProfileDetailsShow }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);