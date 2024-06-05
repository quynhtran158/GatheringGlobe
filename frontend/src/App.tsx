import LoginPage from "./components/loginPage/loginPage";
import "./global.css";
import DiscoverEvent from "./components/Discover_Event/DiscoverEvent";
import EventDetail from "./components/Discover_Event/EventDetail";
import AboutUs from "./components/aboutUs/about-us";
import EventForm from "./components/newEventForm/EventForm";
import ChatPage from "./components/chatRoom/Chat";
import Homepage from "./components/homepage/homepage";
import { SocketProvider } from "./components/providers/socket-provider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layouts/layout";
import Faq from "./components/FAQ/faq";
import ContactUs from "./components/contact-us/contactUs";
import ProtectedRoute from "./utils/ProtectedRoute";
import ForgotPassword from "./components/loginPage/Forgotpassword";
import ResetPassword from "./components/loginPage/ResetPassword";
// import EventDetailMock from "./components/Discover_Event/EventDetail";
import Booking from "./components/BookingForm/Booking";
import { OrderConfirmationModal } from "./components/modals/order-confirmation-modal";
import OrderDetails from "./components/order/OrderDetails";
import KeysPage from "./components/streaming/keys/KeysPage";
import ViewerPage from "./components/streaming/[username]/ViewerPage";
import WatchChannelPage from "./components/streaming/[username]/WatchChannelPage";
import CreatorPageWrapper from "./components/streaming/[username]/CreatorPageWrapper";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />
        <Route path="/register" element={<LoginPage />} />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/u/:username/keys" element={<KeysPage />} />

          <Route
            path="/create-new-event"
            element={
              <Layout>
                <EventForm />
              </Layout>
            }
          />
          <Route
            path="/messages/c/:ownerId/t/:roomId"
            element={
              <SocketProvider>
                <ChatPage />
              </SocketProvider>
            }
          />
          <Route
            path="/messages"
            element={
              <SocketProvider>
                <ChatPage />
              </SocketProvider>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <OrderConfirmationModal />
                <Booking />
              </Layout>
            }
          />
          <Route
            path="/your-account/order-details/:id"
            element={
              <Layout>
                <OrderDetails />
              </Layout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/discover"
          element={
            <Layout>
              <DiscoverEvent />
            </Layout>
          }
        />
        <Route
          path="/help"
          element={
            <Layout>
              <Faq />
            </Layout>
          }
        />

        <Route
          path="/discover/:eventName/event/:eventId"
          element={
            <Layout>
              <EventDetail />
            </Layout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }
        />

        <Route
          path="/stream/:username"
          element={
            <Layout>
              <CreatorPageWrapper />
            </Layout>
          }
        />
        <Route
          path="/stream/:username/watch"
          element={
            <Layout>
              <ViewerPage />
            </Layout>
          }
        />
        <Route
          path="/stream/channel/watch"
          element={
            <Layout>
              <WatchChannelPage />
            </Layout>
          }
        />

        <Route
          path="/discover-event-details"
          element={
            <Layout>
              <EventDetail />
            </Layout>
          }
        />
        <Route path="/booking/:ticketId" element={<EventDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/create-new-event"
          element={
            <Layout>
              <EventForm />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
