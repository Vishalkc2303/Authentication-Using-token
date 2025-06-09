// // import { useState } from "react";
// // import reactLogo from "./assets/react.svg";
// // import viteLogo from "/vite.svg";
// import { useState, useEffect } from "react";
// import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";

// import "./App.css";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Students from "./pages/Students";
// import AddStudent from "./pages/AddStudent";
// // import { Navigate } from "react-router-dom";

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem("token"));
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <Router>
//     <Routes>
//       <Route path="/login" element={<Login setToken={setToken} />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/students" element={token ? <Students /> : <Navigate to="/login" />} />
//       <Route path="/add-student" element={token ? <AddStudent /> : <Navigate to="/login" />} />
//       <Route path="/edit-student/:id" element={token ? <AddStudent /> : <Navigate to="/login" />} />
//       <Route path="*" element={<Navigate to="/students" />} />
//     </Routes>
//   </Router>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Cookies from "js-cookie"; // for cookies management

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  useEffect(() => {
    // Here, we check the token whenever the cookie changes
    const handleCookieChange = () => {
      setToken(Cookies.get("token"));
    };

    // Listen for changes in the cookie (if needed)
    window.addEventListener("storage", handleCookieChange);
    return () => window.removeEventListener("storage", handleCookieChange);
  }, []);

  const checkTokenExpiry = (token) => {
    // Add token expiry logic here if necessary
    return token;
  };
  // const checkTokenExpiry = (token) => {
  //   // Here, you can add logic to check the token expiry and return a boolean
  //   // Example: if token has expired, return false
  //   // return token && Date.now() < new Date(Cookies.get("tokenExpiry")).getTime();
  //   return token;
  // };

  const logout = async () => {
    try {
      // Call the backend API to blacklist the token
      const response = await axios.post(
        "http://localhost:8080/auth/logout", // Assuming your backend logout endpoint
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Remove token from cookies
      Cookies.remove("token");
      setToken(null);

      console.log("Logout successful:", response.data);
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error if any
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            token ? <Navigate to="/students" /> : <Login setToken={setToken} />
          }
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/students" /> : <Register />}
        />
        <Route
          path="/students"
          element={
            token && checkTokenExpiry(token) ? (
              <Students />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-student"
          element={
            token && checkTokenExpiry(token) ? (
              <AddStudent />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-student/:id"
          element={
            token && checkTokenExpiry(token) ? (
              <AddStudent />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/students" />} />
      </Routes>
    </Router>
  );
}

export default App;
