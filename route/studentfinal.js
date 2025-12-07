const express = require('express');
// const { body } = require('express-validator');
// const auth = require('../middleware/is-auth');
// const upload = require("../middleware/upload");
const studentFinalController = require('../controller/studentcontroller');

const router = express.Router();

router.post('/readdata',studentFinalController.readdata);
router.post('/readdatafalse',studentFinalController.readdatafalse);
router.get('/getScanFiltteredDataWithPagination',studentFinalController.getScanFiltteredDataWithPagination);
// router.get('/getPetByCategory/:category',upload.single("file"), petController.getPetByCategory);

module.exports = router;