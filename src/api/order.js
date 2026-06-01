import http from "../http";

export const placeOrderAPI = async (data) => {
  try {
    const res = await http.post("/user/placed-order", data, {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    return res.data;
  } catch (error) {
    console.error("order api error", error);
    throw error;
  }
};
