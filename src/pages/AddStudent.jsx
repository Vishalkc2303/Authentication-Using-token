import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`https://tokenauth-latest.onrender.com/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setName(response.data.name);
          setDescription(response.data.description);
          setDate(response.data.date);
        })
        .catch((error) => console.error("Error fetching student", error));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentData = { name, description, date };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (id) {
        await axios.put(`https://tokenauth-latest.onrender.com/students/${id}`, studentData, config);
      } else {
        await axios.post("https://tokenauth-latest.onrender.com/add", studentData, config);
      }
      navigate("/students");
    } catch (error) {
      alert("Operation failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{id ? "Edit Student" : "Add Student"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300">
            {id ? "Update" : "Add"}
          </button>
        </form>
        <button
          onClick={() => navigate("/students")}
          className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
