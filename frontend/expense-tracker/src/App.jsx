import React, { useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Analytics from "./pages/Dashboard/Analytics";
import Goals from "./pages/Dashboard/Goals";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import personalizationService from "./services/personalizationService";

const App = () => {
  useEffect(() => {
    // Initialize personalization service
    personalizationService.initialize();
  }, []);

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/analytics" exact element={<Analytics />} />
            <Route path="/goals" exact element={<Goals />} />
            <Route path="/calendar" exact element={<div className="text-center p-8">Calendar feature coming soon! 📅</div>} />
            <Route path="/notifications" exact element={<div className="text-center p-8">Notifications feature coming soon! 🔔</div>} />
            <Route path="/settings" exact element={<div className="text-center p-8">Settings feature coming soon! ⚙️</div>} />
            <Route path="/help" exact element={<div className="text-center p-8">Help & Support feature coming soon! ❓</div>} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions = {{
          className: "",
          style: {
            fontSize: '13px'
          }
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};