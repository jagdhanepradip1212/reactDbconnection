app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Attempting to authenticate:", email);
  
    try {
      const user = await User.findOne({ email });
      console.log("User found:", user);
  
      if (!user) {
        console.log("User not found for email:", email);
        return res.status(401).json({ message: "Authentication failed. User not found." });
      }
  
      if (password !== user.password) {
        console.log("Incorrect password for user:", email);
        return res.status(401).json({ message: "Authentication failed. Incorrect password." });
      }
  
      // ... rest of the code ...
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  