 const StudentFinal= require('../model/student');
const Scanlist= require('../model/scanlistmodel');
const FamilyMember= require('../model/familymember');

 exports.readdata = (req, res, next) => {
    const id=req.body.id;
    const familymemberid=req.body.familymemberid;
    let loadedStudent;
    let familydata;
    let newScanlist;
    loadedStudent=StudentFinal.findOne({_id:id})
    .then(student => {
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      console.log(student)
      loadedStudent=student
      return student.save()
    }).then(familymember=>{
        familydata=FamilyMember.findOne({_id:familymemberid})
       .then(member => {
      if (!member) {
        return res.status(404).json({
          message: "Member not found",
        });
      }
      if(member.qrcoderead==false){
        member.qrcoderead=true;
      member.save();
      console.log(member)
       newScanlist = new Scanlist({
        studentname: loadedStudent.studentname,
        studentid: loadedStudent.studentid,
        studentclass: loadedStudent.studentclass,
        studentrollno: loadedStudent.studentrollno,
        studentsection: loadedStudent.studentsection,
        familymember: member._id,
      });

      newScanlist.save();

      console.log("member");

      console.log(member);
      Scanlist.find({_id:newScanlist._id}).populate('student').populate('familymember').then(result=>{
        return res.status(200).json({
            message: "Student found", familymember:member
          });
     })
    }else{
        return res.status(200).json({
            message: "Already Scanned code",familymember:member
          });
    }
      
    })
   
    })
    .catch(err => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
    });
};
 
exports.readdatafalse = async (req, res) => {
  try {
    const { familymemberid } = req.body;

    if (!familymemberid) {
      return res.status(400).json({ message: "Family Member ID is required" });
    }

    // Find member
    const member = await FamilyMember.findById(familymemberid);

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    // Update only if true
    if (member.qrcoderead === true) {
      member.qrcoderead = false;
      await member.save();

      return res.status(200).json({
        message: "QR Status reset to false successfully",
        member,
      });
    }

    // Already false
    return res.status(200).json({
      message: "QR Status already false",
      member,
    });

  } catch (err) {
    console.error("Error in readdatafalse:", err);
    return res.status(500).json({ error: err.message });
  }
};

//using pagination
exports.getScanFiltteredDataWithPagination = async (req, res, next) => {
  const { studentname, studentsection, studentclass, page } = req.body;
  const currentPage = parseInt(page) || 1; // Default to page 1 if not provided
  const limit = 10; // Number of entries per page
  let totalScans;
  try {
    // Build the filter object
    let filter = {};
    if (studentname) {
      filter.studentname = { $regex: new RegExp(`^${studentname}`, "i") }; // Case-insensitive regex
    }
    if (studentsection) {
      filter.studentsection = studentsection;
    }
    if (studentclass) {
      filter.studentclass = studentclass;
    }

    const count = await Scanlist.countDocuments();
    // Use MongoDB query optimizations
    const skip = (currentPage - 1) * limit;

    // Fetch data with pagination, filtering, and sorting
    const [scannedList, totalCount] = await Promise.all([
      Scanlist.find(filter)
        .populate("familymember", "membername memberrelation") // Only populate membername and relation
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("studentid studentname studentclass studentsection studentrollno"), // Only select the required fields for student
      Scanlist.countDocuments(filter), // Get total count for pagination metadata
    ]);

    // Prepare response
    res.status(200).json({
      message: "Studentlist fetched successfully.",
      totalscans: count,
      scannedlist: scannedList.map(scan => ({
        studentid:scan.studentid,
        studentname: scan.studentname,
        studentclass: scan.studentclass,
        studentsection: scan.studentsection,
        studentrollno: scan.studentrollno,
        familymember: {
          membername: scan.familymember.membername,
          relation: scan.familymember.memberrelation
        }
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
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};