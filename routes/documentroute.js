const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const upload = require('../middlewares/uploadMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')


// Routes CRUD

// POST /documents → créer un document (upload d'un fichier)
router.post("/",authMiddleware, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {return res.status(400).json({ message: err.message })}
      next();
    })}, documentController.createDocument
);

// GET /documents → récupérer tous les documents
router.get("/",authMiddleware, documentController.getDocuments);

// GET /documents/:id → récupérer un document par ID
router.get("/:id",authMiddleware, documentController.getDocumentById);

// DELETE /documents/:id → supprimer un document
router.delete("/:id",authMiddleware, documentController.deleteDocument);

// PUT /documents/:id/rename → renommer un fichier 
router.put("/:id/rename", documentController.renameDocument);

module.exports = router;
