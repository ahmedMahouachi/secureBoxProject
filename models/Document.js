const {Schema, model} = require("mongoose")

const documentSchema= new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required : true
    },

    fileName : {
      type : String,
      required : true
    },

    filePath : {
        type : String,
        required : true 
    },

    fileType : {
        type : String,
        enum : ["image","pdf","word","excel","other"], 
        default : "other" 
    
    },

    mimeType : {
        type : String,
        required : true 
    },

    uploadedAt : {
        type : Date,
        default : Date.now
    },


})

module.exports = model("Document", documentSchema)