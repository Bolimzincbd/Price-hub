const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Phone = require("./models/Phone"); 
const fs = require("fs");
const path = require("path");

// Load env vars
dotenv.config();

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Read the JSON file
const phonesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../public/phones.json"), "utf-8")
);

// KEY FIX: Remove the numeric '_id' so MongoDB generates a unique ObjectId string
const phonesToInsert = phonesData.map((phone) => {
  const { _id, ...phoneDataWithoutId } = phone;
  return phoneDataWithoutId;
});

const seedDB = async () => {
  try {
    // Clear existing data to avoid duplicates
    await Phone.deleteMany({});
    console.log("Old phones removed");

    // Insert new data with auto-generated IDs
    await Phone.insertMany(phonesToInsert);
    console.log("Phone data seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();