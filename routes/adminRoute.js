const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getHistory,
    getHistoryById,
    createHistoryById,
    deleteHistory,
    getAllUser,
    deleteUserById
} = require("../controllers/adminController");

const router = express.Router();

//Route de l'historique 
router.get("/get_history/:id", getHistory);
router.get("/get_history_by_id/:historyId", getHistoryById);

router.post("/create_history",authMiddleware, createHistoryById);
router.delete("/delete_history/:historyId", deleteHistory);

//Route User
router.get("/get_all_user",getAllUser);
router.delete("/delete_user_by_id",authMiddleware, deleteUserById);
//router.put("/update_history/:historyId", updateHistory);


module.exports = router;
