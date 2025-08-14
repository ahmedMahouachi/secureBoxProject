const express = require("express");

const passport = require("passport");
const { login, register, me, googleAuth, registerAdmin } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, me);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
        failureMessage: true,
    }),
    googleAuth
);
router.post("/uregisterAdmin", registerAdmin);

module.exports = router;
