const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const upload = require('../middlewares/uploadMiddleware')


// Routes CRUD

// POST /documents → créer un document (upload d'un fichier)
router.post("/", upload.single("file"), documentController.createDocument);

// GET /documents → récupérer tous les documents
router.get("/", documentController.getDocuments);

// GET /documents/:id → récupérer un document par ID
router.get("/:id", documentController.getDocumentById);

// PUT /documents/:id → mettre à jour un document (avec potentiellement un nouveau fichier)
router.put("/:id", upload.single("file"), documentController.updateDocument);

// DELETE /documents/:id → supprimer un document
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
