const express = require("express");
const {
    getHistory,
    getHistoryById,
    createHistoryById,
    deleteHistory,
    updateHistory
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique
router.get("/get_history/:userId", getHistory);
router.get("/get_history_by_id/:historyId", getHistoryById);

router.post("/create_history/:userId", createHistoryById);
router.delete("/delete_history/:historyId", deleteHistory);
router.put("/update_history/:historyId", updateHistory);


module.exports = router;
