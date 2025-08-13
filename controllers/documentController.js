const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");

// Créer un document
exports.createDocument = async (req, res) => {
  try {
    //const { userId } = req.body;
    const userId = "66b4d97b8d2a4a8d2a4a8d2a"; 

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier uploadé" });
    }

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

// 📌 Récupérer tous les documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
    res.status(200).json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

// Récupérer un document par ID
exports.getDocumentById = async (req, res) => {
  try {
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

// Mettre à jour un document (remplacer fichier ou infos)
exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    if (req.file) {
      // Supprimer l'ancien fichier
      fs.unlinkSync(document.filePath);
      document.fileName = req.file.originalname;
      document.filePath = req.file.path;
      document.fileType = detectFileType(req.file.mimetype);
      document.mimeType = req.file.mimetype;
    }

    if (req.body.userId) document.userId = req.body.userId;

    await document.save();
    res.status(200).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// 📌 Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    const fileFullPath = path.join(__dirname, "..", "uploads", document.fileName);
    if (!document) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    // Supprimer le fichier physique
    console.log("Nom enregistré en DB :", document.fileName);
console.log("Chemin complet :", fileFullPath);
    fs.unlinkSync(fileFullPath);
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// 📌 Fonction utilitaire : détecter le type de fichier
function detectFileType(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word") || mimeType.includes("doc")) return "word";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "excel";
  return "other";
}