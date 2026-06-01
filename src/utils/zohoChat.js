export const toggleZohoChatWindow = (open = true) => {
  const waitForZoho = (callback) => {
    const interval = setInterval(() => {
      if (
        window.$zoho &&
        window.$zoho.salesiq &&
        window.$zoho.salesiq.floatwindow
      ) {
        clearInterval(interval);
        callback();
      }
    }, 300);
  };

  waitForZoho(() => {
    if (open) {
      window.$zoho.salesiq.floatwindow.visible("show");
      window.$zoho.salesiq.floatwindow.open();
    } else {
      window.$zoho.salesiq.floatwindow.visible("hide");
    }
  });
};