const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // référence à la collection users du groupe A
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document', // référence à la collection documents du groupe A
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete'],  // actions principales sur documents
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Création du modèle History
const History = mongoose.model('History', historySchema);

module.exports = History;
