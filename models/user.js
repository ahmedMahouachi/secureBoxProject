const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            select: false,
            required: true,
        },
        role: {
            type: String,
            enum: ["client", "admin"],
            default: "client",
        },
    },
    { timestamps: true }
);

module.exports = model('User', userSchema);