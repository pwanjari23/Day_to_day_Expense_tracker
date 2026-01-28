const User = require("../models/user");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password 
    });

    res.status(201).json({ 
      message: "User created successfully", 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
