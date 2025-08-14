const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    { id: user._id, role: user.role, prenom: user.firstName },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    succes: true,
    message: "vous etes connecté",
    token,
    role: user.role,
  });
};
exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password)
    return res.json({
      success: false,
      message: "Tous les champs sont requis.",
    });

  const alreadyExists = await User.findOne({ email });

  if (alreadyExists)
    return res.send({ success: false, message: "Email déjà utilisé." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName: prenom,
    lastName: nom,
    email: email,
    password: hashedPassword,
  });
  await user.save();

  res.status(201).json({ success: true, message: "Utilisateur créé." });
};



exports.me = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "utilisateur no trouvé " });
  }
  res.json({
    success: true,
    nom: user.lastName,
    prenom: user.firstName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
};

exports.googleAuth = (req, res) => {
    if (!req.user)
        return res
            .status(401)
            .json({ success: false, message: "Authentication echouée." });
    const token = jwt.sign(
        {
            id: req.user._id,
            role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.redirect(`/home.html?token=${token}`);
};


exports.registerAdmin = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password)
    return res.json({
      success: false,
      message: "Tous les champs sont requis.",
    });

  const alreadyExists = await User.findOne({ email });

  if (alreadyExists)
    return res.send({ success: false, message: "Email déjà utilisé." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName: prenom,
    lastName: nom,
    email: email,
    password: hashedPassword,
    role: "admin",
  });
  await user.save();

  res.status(201).json({ success: true, message: "Administrateur créé." });
};