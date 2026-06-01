import { useMemo } from "react";

export const UseFormattedDate = (dateString) => {
  const formattedDate = useMemo(() => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date)) return "";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
  }, [dateString]);

  return formattedDate;
}
