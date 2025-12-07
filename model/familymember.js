const mongoose = require("mongoose");
const student = require("./student");

const familyMemberSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "StudentFinal",
      required: true,
    },
    membername: {
        type: String,
        max: 500,
    },
    memberemail: {
        type: String,
        required: false
    },
    membercontactno: {
        type: String,
      required: false
      },
    memberrelation: {
        type: String,
        required: false
    },
    qrcoderead: {
        type: Boolean,
        default: false,
        required: false
    },
   
  },
  { timestamps: true });

  module.exports = mongoose.model("FamilyMemberSchema", familyMemberSchema);