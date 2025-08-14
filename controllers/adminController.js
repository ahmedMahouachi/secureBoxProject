const History = require("../models/History");
const User = require("../models/user");
const mongoose = require("mongoose");
const sanitizeHtml = require('sanitize-html');

//--------------------------------
//    Gestion des historiques
//--------------------------------

/**
 * Récupère tout l'historique lié à un utilisateur spécifique.
 * 
 * @param {Express.Request} req  requête d'Express avec l'ID utilisateur (req.params.userId)
 * @param {Express.Response} res  réponse d'Express utilisé pour renvoyer le tableau d'historique ou une erreur.
 * 
 * @returns {Promise} Renvoie au format Json l'historique de l'utilisateur ou l'erreur rencontrée
 */
const getHistory = async (req, res) => { 
    try {
        const historyUserId = req.params.id;
        const history = await History.find({userId: historyUserId });

        return res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Récupère un enregistrement d'historique spécifique par son identifiant unique `_id`.
 * 
 * @param {Express.Request} req L'objet de requête Express contenant l'ID d'historique dans `req.params.historyId`.
 * @param {Express.Response} res L'objet de réponse Express utilisé pour renvoyer le document trouvé ou une erreur.
 * 
 * @returns {Promise} Renvoie au format Json l'enregistrement de l'historique spécifique ou l'erreur rencontrée
 */
const getHistoryById = async (req, res) => {
    try {
    const historyId = req.params.historyId;

    //L'id ne correspond pas à un id type de mongoose
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
        return res.status(400).json({ message: "ID invalide" });
    }

    const history = await History.findById(historyId);
    if (!history || history === null) {
        return res.status(404).json({ message: "Enregistrement non trouvé" });
    }

    return res.json(history);
    } catch (err) {
        // Sécurité : capture toute autre erreur de cast
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

const createHistoryById = async (req, res) => {
    try {
        const historyUserId = sanitizeHtml(req.user.id);
        const historyRoute = sanitizeHtml(req.body.route);
        const historyAction = sanitizeHtml(req.body.action);
        const historyMethod = sanitizeHtml(req.body.method);
        const historyAdresseIP = sanitizeHtml(req.adresseIP);

        const history = await History.create({
            userId : historyUserId,
            action : historyAction,
            route : historyRoute, 
            method : historyMethod,
            adresseIP : historyAdresseIP
        });

        res.status(201).json(history);

    } catch (error) {
        res.status(500).json({message: "une erreur est survenu", error : error.message});

    }
};

const deleteHistory = async (req, res) =>{
    try {
        const historyId = req.params.historyId;

        //L'id ne correspond pas à un id type de mongoose
        if (!mongoose.Types.ObjectId.isValid(historyId)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const history = await History.findById(historyId);

        if (!history || history === null) {
            return res.status(404).json({ message: "Enregistrement non trouvé" });
        }

        await history.deleteOne();
        res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
}


const updateHistory = async (req, res) => {
    try{
        const historyId = req.params.historyId;

        const historyRoute = sanitizeHtml(req.body.route);
        const historyAction = sanitizeHtml(req.body.action);
        const historyMethod = sanitizeHtml(req.body.method);
        const historyAdrIp = sanitizeHtml(req.body.adresseIP);
        
        //L'id ne correspond pas à un id type de mongoose
        if (!mongoose.Types.ObjectId.isValid(historyId)) {
            return res.status(400).json({ message: "ID invalide" });
        }   
        
        const history = await History.findById(historyId);

        if (!history) {
            return res.status(404).json({ message: "Enregistrement non trouvé" });
        }
        
        const filter = {_id: historyId};
        const update = {route: historyRoute, action: historyAction, method: historyMethod, adresseIP:historyAdrIp};

        const resHistory = await History.findOneAndUpdate(filter, update, {new : true});
        
        res.status(201).json(resHistory);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

//------------------------
//          User
//------------------------

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({role: "client"});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        //L'id ne correspond pas à un id type de mongoose
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID invalide" });
        }   

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Supprimer tous les historiques liés à cet utilisateur
        await History.deleteMany({ userId });

        // Supprimer l'utilisateur
        await user.deleteOne();

        res.status(200).json({ message: "Utilisateur et historiques supprimés avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

module.exports = {
    getHistoryById,
    getHistory,
    createHistoryById,
    deleteHistory,
    getAllUser,
    deleteUserById,
    updateHistory
};
