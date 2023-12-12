const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const jwtSecret = "jwtSecret";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/register", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a mongoose schema for the user
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a mongoose model
const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());

//login authintication
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting to authenticate:", email);


  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Check if the provided password matches the user's password
    if (password !== user.password) {
      console.log("Incorrect password for user:", email);
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to handle user registration
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get all registered users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to update user data
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // Find the user by ID and update their data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      // If the user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a DELETE endpoint for deleting a user
app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Use mongoose to find and delete the user by their ID
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
