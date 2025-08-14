const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const audit = require("../middlewares/historyMiddleware")
const {
    getHistory,
    getHistoryById,
    createHistoryById,
    deleteHistory,
    getAllUser,
    deleteUserById,
    updateHistory
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique 
router.get("/get_history/:id", getHistory);
router.get("/get_history_by_id/:historyId",authMiddleware, audit("get_history_by_id"), getHistoryById);

router.post("/create_history",authMiddleware,audit("test_Middleware"), createHistoryById);
router.delete("/delete_history/:historyId", deleteHistory);
router.put("/update_history/:historyId",authMiddleware, audit("update_history"), updateHistory);

//Route User
router.get("/get_all_user",getAllUser);
router.delete("/delete_user_by_id/:id", deleteUserById);


module.exports = router;
