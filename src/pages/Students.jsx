import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Students = () => {
  const [students, setStudents] = useState([]);
  // const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [token, setToken] = useState(Cookies.get("token"));

  useEffect(() => {
    // This effect will run whenever the token changes.
    if (token) {
      axios
        .get("https://tokenauth-latest.onrender.com/students", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setStudents(response.data))
        .catch((error) => console.error("Error fetching students", error));
    }
  }, [token]);

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (!isConfirmed) return; // If user cancels, exit the function
    try {
      // Call the backend API to blacklist the token
      const response = await axios.post(
        "https://tokenauth-latest.onrender.com/auth/logout", // Assuming your backend logout endpoint
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
      alert("Logout successfull");
      // Redirect to the login page after successful logout
      navigate("/login");
      alert("loguttttt");
      console.log("Logout successful:", response.data);
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error if any
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Student List</h2>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/add-student")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Student
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-gray-600 text-center">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-100 transition">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {student.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {student.date}
                    </td>
                    {/* <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => navigate(`/edit-student/${student.id}`)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      >
                        Edit
                      </button>
                    </td> */}
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {student.isEditable && (
                        <button
                          onClick={() =>
                            navigate(`/edit-student/${student.id}`)
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
