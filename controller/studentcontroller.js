const StudentFinal = require("../model/student");
const Scanlist = require("../model/scanlistmodel");
const FamilyMember = require("../model/familymember");

// ✅ Scan QR
exports.readdata = async (req, res, next) => {
  try {
    const { id, familymemberid } = req.body;

    if (!id || !familymemberid) {
      return res.status(400).json({
        message: "Student id and familymemberid are required",
      });
    }

    // 1) Find student
    const student = await StudentFinal.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2) Find family member
    const member = await FamilyMember.findById(familymemberid);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 3) Already scanned
    if (member.qrcoderead === true) {
      return res.status(200).json({
        message: "Already Scanned code",
        familymember: member,
      });
    }

    // 4) Update member scan status
    member.qrcoderead = true;
    await member.save();

    // 5) Create scan entry
    const newScanlist = new Scanlist({
      studentname: student.studentname,
      studentid: student.studentid,
      studentclass: student.studentclass,
      studentrollno: student.studentrollno,
      studentsection: student.studentsection,
      familymember: member._id,
    });

    await newScanlist.save();

    // 6) Optional populate familymember
    const scanResult = await Scanlist.findById(newScanlist._id)
      .populate("familymember", "membername memberrelation");

    return res.status(200).json({
      message: "Student found",
      familymember: member,
      scan: scanResult,
    });

  } catch (err) {
    console.error("Error in readdata:", err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


// ✅ Reset QR read status
exports.readdatafalse = async (req, res) => {
  try {
    const { familymemberid } = req.body;

    if (!familymemberid) {
      return res.status(400).json({ message: "Family Member ID is required" });
    }

    const member = await FamilyMember.findById(familymemberid);

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    if (member.qrcoderead === true) {
      member.qrcoderead = false;
      await member.save();

      return res.status(200).json({
        message: "QR Status reset to false successfully",
        member,
      });
    }

    return res.status(200).json({
      message: "QR Status already false",
      member,
    });

  } catch (err) {
    console.error("Error in readdatafalse:", err);
    return res.status(500).json({ error: err.message });
  }
};


// ✅ Pagination + Filter
exports.getScanFiltteredDataWithPagination = async (req, res, next) => {
  try {
    const { studentname, studentsection, studentclass, page } = req.body;

    const currentPage = parseInt(page) || 1;
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    const filter = {};

    if (studentname) {
      filter.studentname = { $regex: new RegExp(`^${studentname}`, "i") };
    }
    if (studentsection) {
      filter.studentsection = studentsection;
    }
    if (studentclass) {
      filter.studentclass = studentclass;
    }

    const [totalscans, scannedList, totalCount] = await Promise.all([
      Scanlist.countDocuments(),
      Scanlist.find(filter)
        .populate("familymember", "membername memberrelation")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("studentid studentname studentclass studentsection studentrollno familymember"),
      Scanlist.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Studentlist fetched successfully.",
      totalscans,
      scannedlist: scannedList.map(scan => ({
        studentid: scan.studentid,
        studentname: scan.studentname,
        studentclass: scan.studentclass,
        studentsection: scan.studentsection,
        studentrollno: scan.studentrollno,
        familymember: scan.familymember
          ? {
              membername: scan.familymember.membername,
              relation: scan.familymember.memberrelation,
            }
          : null,
      })),
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalCount / limit),
        totalEntries: totalCount,
        entriesPerPage: limit,
      },
    });

  } catch (err) {
    console.error(err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
