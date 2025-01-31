import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./services/ProtectedRoute";
import "./App.css";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Event from "./pages/EventPage";
import Profile from "./pages/ProfilePage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Booking from "./pages/BookingPage";
import CreateEvent from "./pages/CreateEventPage";
import MultiStepForm from "./pages/MultiStepForm";
import UserDetails from "./components/event/AttendeeDetails";
import OrderSummary from "./components/event/OrderSummary";
import Account from "./components/common/AccountInfo";
import Email from "./components/common/ChangeEmail";
import Password from "./components/common/ProfPassword";
// import Testing from "./pages/Testing";
import { AuthProvider } from './context/AuthContext';
import NavMenu from './components/layout/NavBarElements';
import EventDetails from "./components/event/EventDetails";
import Unauthorized from "./components/common/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Event" element={<Event />} />
            <Route path="/Login" element={<SignIn />} />
            <Route path="/Register" element={<SignUp />} />
            <Route path="/*" element={<MultiStepForm />} />
            <Route path="/events/:event_id" element={<EventDetails />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            <Route path="/Profile" element={<ProtectedRoute element={Profile} requiredRoles={["Attendee", "Organizer"]} />} />
            <Route path="/Booking" element={<ProtectedRoute element={Booking} requiredRoles={["Attendee"]} />} />
            <Route path="/AccountInfo" element={<ProtectedRoute element={Account} requiredRoles={["Attendee", "Organizer"]} />} />
            <Route path="/CreateEvent" element={<ProtectedRoute element={CreateEvent} requiredRoles={["Organizer"]} />} />
            <Route path="/OrderSummary" element={<ProtectedRoute element={OrderSummary} requiredRoles={["Attendee", "Organizer"]} />} />
            <Route path="/AttendeeDetails" element={<ProtectedRoute element={UserDetails} requiredRoles={["Organizer"]} />} />
            <Route path="/ChangePassword" element={<ProtectedRoute element={Password} requiredRoles={["Attendee", "Organizer"]} />} />
            <Route path="/ChangeEmail" element={<ProtectedRoute element={Email} requiredRoles={["Attendee", "Organizer"]} />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
