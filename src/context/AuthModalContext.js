import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [loginModal, setLoginModal] = useState(false);
  const [loginModalBackdrop, setLoginModalBackdrop] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [completeLoginModal, setCompleteLoginModal] = useState(false);

  // Open login modal with optional redirect
  const handleLoginModal = () => {
    setLoginModal(true);
    setLoginModalBackdrop(true);
  };

  // Close everything
  const handleLoginClose = () => {
    setLoginModal(false);
    setLoginModalBackdrop(false);
    setOtpModal(false);
    setCompleteLoginModal(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        loginModal,
        loginModalBackdrop,
        otpModal,
        completeLoginModal,
        setOtpModal,
        setCompleteLoginModal,
        handleLoginModal,
        handleLoginClose,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
