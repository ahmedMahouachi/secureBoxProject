const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getHistory,
    getHistoryById,
    createHistoryById,
    deleteHistory
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique
router.get("/get_history/",authMiddleware, getHistory);
router.get("/get_history_by_id/:historyId", getHistoryById);

router.post("/create_history",authMiddleware, createHistoryById);
router.delete("/delete_history/:historyId", deleteHistory);
//router.put("/update_history/:historyId", updateHistory);


module.exports = router;
