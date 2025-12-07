const mongoose = require("mongoose");
const student = require("./student");

const scanlistSchema = new mongoose.Schema({
  studentname: {
    type: String,
    max: 500,
  },
  studentid: {
    type: String,
    required: false
  },
  studentrollno: {
    type: String,
    required: false
  },
  studentclass: {
    type: String,
    required: false
  },
  studentsection: {
    type: String,
    required: false
  },
    familymember: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "FamilyMemberSchema",
      required: true,
    },
    
  },
  { timestamps: true }

);

  module.exports = mongoose.model("ScanlistSchema", scanlistSchema);