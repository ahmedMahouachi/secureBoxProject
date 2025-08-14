const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const createHistoryMiddleware = require("../middlewares/historyMiddleware")
const {
    getHistory,
    getHistoryById,
//    createHistoryById,
    deleteHistory,
    getAllUser,
    deleteUserById,
    updateHistory
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique 
router.get("/get_history/:id",createHistoryMiddleware, getHistory);
router.get("/get_history_by_id/:historyId",authMiddleware, createHistoryMiddleware, getHistoryById);

//router.post("/create_history",authMiddleware,createHistoryMiddleware, createHistoryById);
router.delete("/delete_history/:historyId",authMiddleware, createHistoryMiddleware, deleteHistory);
router.put("/update_history/:historyId",authMiddleware, createHistoryMiddleware, updateHistory);

//Route User
router.get("/get_all_user",getAllUser);
router.delete("/delete_user_by_id", deleteUserById);


module.exports = router;
