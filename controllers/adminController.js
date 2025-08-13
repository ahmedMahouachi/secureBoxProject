const History = require("../models/History");
const User = require("../models/user");

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
        const historyUserId = req.user.id;
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
    const historyId = req.params.historyId;

    const history = await History.findById(historyId);

    if (!history) {
        return res.status(404).json({ message: "Enregistrement non trouvé" });
    }

    return res.json(history);
};

const createHistoryById = async (req, res) => {
    try {
        const historyUserId = req.user.id;
        const historyRoute = req.body.route;
        const historyAdresseIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || "0.0.0.0";

        const history = await History.create({
            userId : historyUserId,
            action : "creation",
            route : historyRoute, 
            method : "CREATE",
            adresseIP : historyAdresseIP
        });

        res.status(201).json(history);

    } catch (error) {
        res.status(500).json({message: "une erreur est survenu", error : error.message});

    }
};

const deleteHistory = async (req, res) =>{
    const historyId = req.params.historyId;
        const historyRoute = req.body.route;

    const history = await History.findById(historyId);

    if (!history) {
        return res.status(404).json({ message: "Enregistrement non trouvé" });
    }

    await history.deleteOne();
    res.status(204).send();
}

/*
//A vérifié
const updateHistory = async (req, res) => {
    const historyId = req.params.historyId;
    const historyRoute = req.body.route;

    const history = await History.findById(historyId);
    if (!history) {
        return res.status(404).json({ message: "Enregistrement non trouvé" });
    }
    
    const filter = {id: historyId};
    const update = {route: historyRoute};

    history = await History.findOneAndUpdate(filter, update);
    
    res.status(201).json(history);
};*/

//------------------------
//          User
//------------------------

const getAllUser = async (req, res) => {
    const users = await User.find({role: "client"});
    res.status(200).json(users);
}

module.exports = {
    getHistoryById,
    getHistory,
    createHistoryById,
    deleteHistory,
    getAllUser
};
