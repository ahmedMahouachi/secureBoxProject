const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");
const User = require('../models/user')
const jwt = require('jsonwebtoken');

// Créer un document
exports.createDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    //const userId = "66b4d97b8d2a4a8d2a4a8d2a"; 
    console.log(userId);
    

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier uploadé" });
    }

    //Créer un nouveau document dans la base 
    const newDocument = new Document({
      userId,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: detectFileType(req.file.mimetype),
      mimeType: req.file.mimetype,
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'upload du document" });
  }
};

// Récupérer tous les documents
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id
    const documents = await Document.find({userId}).populate("userId", "name email")
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

// Récupérer un document par ID
exports.getDocumentById = async (req, res) => {
  try {
    const userId = req.user.id
    const document = await Document.findById(req.params.id).populate("userId", "name email");
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }
    res.status(200).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

// Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    const fileFullPath = path.join(__dirname, "..", "uploads", document.fileName);
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    // Supprimer le fichier physique
    fs.unlinkSync(fileFullPath);
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// Renommer un document
exports.renameDocument = async (req, res) => {
  try {
    const { newName } = req.body;

    // Vérifier que le nouveau nom est fourni
    if (!newName) {
      return res.status(400).json({ message: "Le nouveau nom est requis" });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    const oldPath = document.filePath; // chemin actuel du fichier
    const timestamp = Date.now();
    const newFileName = `${timestamp}-${newName}${path.extname(document.fileName)}`;
    const newPath = path.join(path.dirname(oldPath), newFileName); // chemin complet avec le nouveau nom

    // Renommer le fichier sur le disque
    fs.renameSync(oldPath, newPath);

    // Mettre à jour la base de données
    document.fileName = newFileName;
    document.filePath = newPath;
    await document.save();

    res.status(200).json({ message: "Fichier renommé avec succès", document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du renommage" });
  }
};


// Fonction utilitaire : détecter le type de fichier
function detectFileType(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word") || mimeType.includes("doc")) return "word";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "excel";
  return "other";
}