import { Route, Routes } from "react-router-dom";
import { AboutUs, ContactUs, Filter, Home, OnSale, PageNotFound, ProductDetail, Wedding, TermsCondition, PrivacyPolicy, ReturnPolicy, OrderPolicy, ShippingPolicy, Testimonial, Career, Profile, CancelOrder, OrderHistory, ChangePassword, Wishlist, Cart, Blog, BlogDetails, Invoice, BecomeVendor, Checkout, Chat, TrackOrder, FAQ, PaymentOptions, ThankYou, OrderDetails, PaypalPaymentSuccess, RazorpayPaymentSuccess} from "../pages";
import ProtectedRoute from "../components/ProtectedRoute ";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home /> } />

      <Route path="about-us" element={ <AboutUs /> } />
      <Route path="contact-us" element={ <ContactUs /> } />
      <Route path="on-sale" element={ <OnSale /> } />
      <Route path="wedding" element={ <Wedding /> } />
      <Route path="all-products" element={ <Filter /> } />
      {/* <Route path="/:category" element={ <Filter /> } /> */}
      {/* <Route path="/:category/:subcategory" element={ <Filter /> } /> */}
      <Route path="/:category/*" element={<Filter />} />

      {/* <Route path="new-in" element={ <NewIn /> } /> */}
      {/* <Route path="ready-to-ship" element={ <ReadyToShip /> } />
      <Route path="festive-shop" element={ <FestiveShop /> } /> */}

      <Route path="products/:slug" element={ <ProductDetail /> } />
      {/* <Route path="register" element={ <Register /> } />
      <Route path="login" element={ <Login /> } /> */}
      <Route path="terms-&-condition" element={ <TermsCondition /> } />
      <Route path="privacy-policy" element={ <PrivacyPolicy /> } />
      <Route path="return-policy" element={ <ReturnPolicy /> } />
      <Route path="order-policy" element={ <OrderPolicy /> } />
      <Route path="shipping-policy" element={ <ShippingPolicy /> } />
      <Route path="testimonial" element={ <Testimonial /> } />
      <Route path="career" element={ <Career /> } />
      <Route path="faq" element={ <FAQ /> } />
      <Route path="payment-options" element={ <PaymentOptions /> } />
      <Route path="track-order" element={ <TrackOrder /> } />
      <Route path="become-vendor" element={ <BecomeVendor /> } />
      


      <Route path="blog" element={ <Blog /> } />
      <Route path="blog/:slug" element={ <BlogDetails /> } />
      <Route path="blog/category/:blog_category" element={ <Blog /> } />
      <Route path="blog/tag/:blog_tag" element={ <Blog /> } />

      <Route element={<ProtectedRoute />}>
          <Route path="profile" element={ <Profile /> } />
          <Route path="my-credits" element={ <ChangePassword /> } />
          <Route path="cancelled-order" element={ <CancelOrder/> } />
          <Route path="your-orders" element={ <OrderHistory/> } />
          <Route path="order-details/:id" element={ <OrderDetails /> } />
          <Route path="wishlist" element={ <Wishlist/> } />
          <Route path="cart" element={ <Cart/> } />
          <Route path="checkout" element={ <Checkout/> } />
          <Route path="thank-you" element={ <ThankYou /> } />
          <Route path="payment-success" element={<PaypalPaymentSuccess />} />
          <Route path="razorpay-payment-success" element={<RazorpayPaymentSuccess />} />
          <Route path="chat" element={ <Chat/> } />

          {/* <Route path="invoice" element={ <Invoice /> } /> */}
          <Route path="/invoice/:orderId" element={<Invoice />} />
          
      </Route>
      
      <Route path="*" element={ <PageNotFound /> } />
    </Routes>
  )
}