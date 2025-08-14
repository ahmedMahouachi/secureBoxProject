const History = require("../models/History");
module.exports = function audit(action) {

    return async (req, res, next) =>{
        try {
            //Soit dans le token soit dans le params de la req
            const historyUserId = req.user?.id || req.params.id;
            const historyRoute = req.originalUrl; // par défaut l'URL appelée
            const historyAction = action;
            const historyMethod = req.method;
            const historyAdresseIP = req.ip;

            await History.create({
                userId: historyUserId,
                action: historyAction,
                route: historyRoute,
                method: historyMethod,
                adresseIP: historyAdresseIP
            });

            // On continue avec la suite de la requête
            next();
        } catch (error) {
            console.error("Erreur lors de la création de l'historique :", error.message);
            next(error);
        }
    }
}