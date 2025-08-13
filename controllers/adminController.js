const History = require("../models/History");

//--------------------------------
//    Gestion des historiques
//--------------------------------

/**
 * Récupère tout l'historique lié à un utilisateur spécifique.
 * Exemple req postman : http://localhost:3000/history/get_history/689b63b4cfde2e1b8d3498a2
 * 
 * @param {Express.Request} req  requête d'Express avec l'ID utilisateur (req.params.userId)
 * @param {Express.Response} res  réponse d'Express utilisé pour renvoyer le tableau d'historique ou une erreur.
 * 
 * @returns {Promise} Renvoie au format Json l'historique de l'utilisateur ou l'erreur rencontrée
 */
const getHistory = async (req, res) => { 
    try {
        const reqUserId = req.params.userId;
        const history = await History.find({userId: reqUserId });

        return res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Récupère un enregistrement d'historique spécifique par son identifiant unique `_id`.
 * Exemple req postman : http://localhost:3000/history/get_history_by_id/689b63b4cfde2e1b8d3498b0
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
        const historyUserId = req.params.userId;
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
};

module.exports = {
    getHistoryById,
    getHistory,
    createHistoryById,
    deleteHistory,
    updateHistory
};
