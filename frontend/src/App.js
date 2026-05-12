import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AdminNavbar from "./components/AdminNavbar/AdminNavbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import EventDetails from "./pages/EventDetails/EventDetails";
import Cart from "./pages/Cart/Cart";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import MyBookings from "./pages/MyBookings/MyBookings";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  if (token) {
    const role = String(localStorage.getItem("role") || "")
      .trim()
      .toLowerCase();
    return (
      <Navigate to={role === "admin" ? "/admin-dashboard" : "/home"} replace />
    );
  }

  return element;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = String(localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/register";
  const showAdminNavbar = token && role === "admin" && !hideNavbar;
  const showUserNavbar = !showAdminNavbar && !hideNavbar;

  return (
    <>
      {showAdminNavbar && <AdminNavbar />}
      {showUserNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<AuthRoute element={<Login />} />} />
            <Route
              path="/register"
              element={<AuthRoute element={<Register />} />}
            />

            <Route
              path="*"
              element={
                <div className="text-center mt-5">404 - Page Not Found</div>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
