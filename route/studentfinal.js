const express = require("express");
const studentFinalController = require("../controller/studentcontroller");

const router = express.Router();

router.post("/readdata", studentFinalController.readdata);
router.post("/readdatafalse", studentFinalController.readdatafalse);

// ✅ changed GET → POST (because controller reads req.body)
router.post(
  "/getScanFiltteredDataWithPagination",
  studentFinalController.getScanFiltteredDataWithPagination
);

module.exports = router;
