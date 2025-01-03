const mongoose = require("mongoose");

// MongoDB connection - use a global variable to avoid reconnecting on each request
let conn = null;

async function connectToDatabase() {
  if (!conn) {
    conn = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await conn;
  }
}

// Schema and Model
const DaySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  actual: { type: Number, default: 0 },
  pc: { type: Number, default: 0 },
});
const Day = mongoose.models.Day || mongoose.model("Day", DaySchema);

module.exports = async (req, res) => {
  await connectToDatabase();

  if (req.method === "GET") {
    const days = await Day.find();
    return res.status(200).json(days);
  }

  if (req.method === "POST") {
    const { date, actual, pc } = req.body;
    try {
      const existingDay = await Day.findOneAndUpdate(
        { date },
        { actual, pc },
        { upsert: true, new: true }
      );
      return res.status(200).json(existingDay);
    } catch (error) {
      return res.status(500).json({ error: "Error saving data" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
};
