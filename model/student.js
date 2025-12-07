const mongoose = require("mongoose");


const StudentFinalSchema = new mongoose.Schema(
  {
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
    membercount: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentFinal", StudentFinalSchema);