const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    res.send("login marche");
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

    res.status(201).json({success: true, message: "Utilisateur créé."});
};
