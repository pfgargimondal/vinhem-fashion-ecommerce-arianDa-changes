import React, { createContext, useContext, useState } from "react";

const MeasurementContext = createContext();

export const useMeasurement = () => useContext(MeasurementContext);

export const MeasurementProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [pendingSubmit, setPendingSubmit] = useState(false);

  return (
    <MeasurementContext.Provider
      value={{ formData, setFormData, pendingSubmit, setPendingSubmit }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};
