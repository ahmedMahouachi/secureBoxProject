const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // référence à la collection users du groupe A
    required: true,
  },

//   A faire après le cours si envie
//   documentId: { 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Document', // référence à la collection documents du groupe A
//     required: true,
//   },
  action: {
    type: String,
    required: true,
    // actions principales sur documents
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  route: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  adresseIP: {
    type: String,
    required: true,
  }
});


const History = mongoose.model('History', historySchema);

module.exports = History;
