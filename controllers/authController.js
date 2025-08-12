const User = require("../models/user");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ succes: false, message: "user no trouvé" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res
      .status(401)
      .json({ succes: false, message: "mot de passe incorrect" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  res.json({ succes: true, message: "vous etes connecté", token });
};

exports.register = async (req, res) => {
  res.send("register marche");
};
