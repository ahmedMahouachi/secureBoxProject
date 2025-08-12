const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const documentController = require("../controllers/documentController");

// Configuration Multer pour le stockage des fichiers uploadés dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // dossier où seront stockés les fichiers
  },
  filename: (req, file, cb) => {
    // Générer un nom unique avec timestamp + nom d'origine
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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
