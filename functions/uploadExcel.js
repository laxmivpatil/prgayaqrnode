const mongoose = require("mongoose");
const XLSX = require("xlsx");

const Student = require("./models/student");
const Family = require("./models/familyMemberSchema");

// ---- MONGO CONNECT ----
mongoose
  .connect("mongodb://127.0.0.1:27017/school", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ---- READ EXCEL ----
const workbook = XLSX.readFile("./students.xlsx");   // your file path
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

// ---- PROCESS EACH ROW ----
(async () => {
  for (const row of rows) {
    try {
      // EXCEL KEYS (MUST MATCH YOUR SHEET HEADER NAMES)
      const studentName   = row["STUDENT NAME"];
      const className     = row["CLASS"];
      const section       = row["SECT"];
      const fathersName   = row["FATHER'S NAME"];
      const fatherPhone   = row["FATHER'S CONTACT NO."];
      const mothersName   = row["MOTHER'S NAME"];
      const motherPhone   = row["CONTACT NUMBER"];
      const email1        = row["EMAIL ID"];
      const email2        = row["EMAIL ID 2"];

      // 1️⃣ Create Student (if not exists)
      let studentDoc = await Student.findOne({
        studentname: studentName,
        studentclass: className,
        studentsection: section,
      });

      if (!studentDoc) {
        studentDoc = await Student.create({
          studentname: studentName,
          studentclass: className,
          studentsection: section,
        });
      }

      // 2️⃣ Insert Father as family member
      if (fathersName) {
        await Family.create({
          student: studentDoc._id,
          membername: fathersName,
          membercontactno: fatherPhone,
          memberemail: email1,
          memberrelation: "Father",
        });
      }

      // 3️⃣ Insert Mother as family member
      if (mothersName) {
        await Family.create({
          student: studentDoc._id,
          membername: mothersName,
          membercontactno: motherPhone,
          memberemail: email2,
          memberrelation: "Mother",
        });
      }

      console.log(`Imported: ${studentName}`);

    } catch (e) {
      console.log("Error while importing row:", e);
    }
  }

  console.log("Import Completed!");
  mongoose.connection.close();
})();
