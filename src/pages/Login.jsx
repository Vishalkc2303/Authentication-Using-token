import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post("http://localhost:8080/auth/login", { username, password });
  //       localStorage.setItem("token", response.data.token);
  //       setToken(response.data.token);
  //       navigate("/students");
  //     } catch (error) {
  //       alert("Login failed!");
  //     }
  //   };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      const token = response.data?.token || response.data;

      if (token && typeof token === "string") {
        const trimmedToken = token.trim();

        // Store in localStorage
        localStorage.setItem("token", trimmedToken);
        setToken(trimmedToken);

        // ✅ Store in cookie (1-hour expiration as example)
        Cookies.set("token", trimmedToken, {
          expires: 1 / 24,
          secure: true,
          sameSite: "Strict",
        });

        navigate("/students");
      } else {
        alert("Invalid login response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  // const handleLogin = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post("http://localhost:8080/auth/login", { username, password });
  //       console.log("Login Response:", response.data); // Debugging

  //       if (response.data && response.data) {
  //         const token = response.data.trim();
  //         localStorage.setItem("token", token);
  //         setToken(token);
  //         navigate("/students");
  //       } else {
  //         alert("Invalid response from server!");
  //       }
  //     } catch (error) {
  //       console.error("Login error:", error);
  //       alert("Login failed!");
  //     }
  //   };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
