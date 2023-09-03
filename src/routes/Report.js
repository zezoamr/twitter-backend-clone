const express = require('express')
const auth = require("../middleware/auth");
const {
    viewReports,
    viewReport,
    ReportDelete,
    ReportDeleteByReportedId,
    NewReport
} = require('../controllers/Reports')

const router = express.Router()

router.route('/').get(auth, viewReports).post(auth, NewReport)
router.route('/:id').delete(auth, ReportDelete).get(auth, viewReport)
router.route('/ReportedId/:id').delete(auth, ReportDeleteByReportedId)

module.exports = router
