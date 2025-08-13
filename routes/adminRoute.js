const express = require("express");
const {
    getHistory,
    getHistoryById
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique
router.get("/get_history/:userId", getHistory);
router.get("/get_history_by_id/:historyId", getHistoryById);

module.exports = router;
