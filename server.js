const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const dbURI = "mongodb+srv://kirsteneulesramos:YjSuJeOSVGLTpHDh@mke.8c0xo.mongodb.net/calendar?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const DaySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  actual: { type: Number, default: 0 },
  pc: { type: Number, default: 0 },
});
const Day = mongoose.model("Day", DaySchema);

// Routes
app.get("/days", async (req, res) => {
  try {
    const days = await Day.find();
    res.json(days);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/day", async (req, res) => {
  const { date, actual, pc } = req.body;
  try {
    const existingDay = await Day.findOneAndUpdate(
      { date },
      { actual, pc },
      { upsert: true, new: true }
    );
    res.status(200).json(existingDay);
  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
