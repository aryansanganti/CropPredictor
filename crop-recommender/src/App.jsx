import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [inputs, setInputs] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [prediction, setPrediction] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Get prediction from Flask
    const res = await axios.post("http://127.0.0.1:5000/predict", inputs);
    const predicted_crop = res.data.prediction;
    setPrediction(predicted_crop);

    // 2️⃣ Save prediction + inputs to MongoDB via Express
    await axios.post("http://localhost:5001/save", {
      ...inputs,
      predicted_crop
    });
  } catch (error) {
    console.error("Prediction or saving error:", error);
  }
};


  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>🌾 Crop Recommendation</h2>
      <form onSubmit={handleSubmit}>
        {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field) => (
          <div key={field} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>{field}</label>
            <input
              type="number"
              name={field}
              value={inputs[field]}
              onChange={handleChange}
              required
              step="any"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: "0.7rem", width: "100%" }}>
          Predict Crop
        </button>
      </form>
      {prediction && (
        <div style={{ marginTop: "2rem", fontSize: "1.2rem", fontWeight: "bold" }}>
          Recommended Crop: 🌱 {prediction}
        </div>
      )}
    </div>
  );
};

export default App;
