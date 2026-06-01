import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {

 const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    return savedCurrency
      ? JSON.parse(savedCurrency)
      : {
          country: "India",
          currency_code: "INR",
          exchange_rate_to_inr: 1,
          locale: "en-IN",
        };
  });

  // ✅ Save to localStorage whenever it changes
  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem("selectedCurrency", JSON.stringify(selectedCurrency));
    }
  }, [selectedCurrency]);

const formatPrice = (priceInInr = 0, options = {}) => {
  const { showDecimals = false, returnParts = false } = options;

  const currency = selectedCurrency || {
    currency_code: "INR",
    currency_symbol: "₹",
    exchange_rate_to_inr: 1,
    locale: "en-IN",
  };

  const convertedPrice =
    priceInInr / (currency.exchange_rate_to_inr || 1);

  const displayPrice = showDecimals
    ? convertedPrice
    : Math.round(convertedPrice);

  // ✅ Number only formatter
  const formatter = new Intl.NumberFormat(currency.locale || "en-IN", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  const formattedNumber = formatter.format(displayPrice);

  const symbol = currency.currency_symbol || "₹";

  if (!returnParts) {
    return `${symbol} ${formattedNumber}`;
  }

  return {
    symbol,
    number: formattedNumber,
    raw: convertedPrice,
  };
};



  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, formatPrice}}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
