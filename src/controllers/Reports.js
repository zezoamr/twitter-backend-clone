const Report = require("../models/Report");


const ReportDelete = async (req, res) => { 
    try {
        const _id = req.params.id
        if (!req.user.adminCheck()) {
            res.status(400).send("not an admin")
        }

        await Report.findOneAndDelete({_id})
        res.status(200).send()
    } catch (e) {
        res.status(404).send()
    }
}

const ReportDeleteByReportedId = async (req, res) => { // deletes all related reports to a reported user or a reported tweet
    try {
        const reportedId = req.params.id
        if (!req.user.adminCheck()) {
            res.status(400).send("not an admin")
        }

        await Report.deleteMany({reportedId})
        res.status(200).send()
    } catch (e) {
        res.status(404).send()
    }
}

const NewReport = async (req, res) => {
    try {
        const report = new Report(req.body)
        await report.save()
        res.status(201).send(report)
    } catch (e) {
        res.status(400).send(e)
    }
}

const viewReport = async (req, res) => {
    try {
        if (!req.user.adminCheck()) {
            res.status(400).send("not an admin")
        }

        const _id = req.params.id
        const report = await Report.findOne({_id})
        if (! report) {
            res.status(404).send()
        }

        await report.populate( "owner")

        await report.populate("reportedId")


        res.status(200).send({tweet, currentUserLikesThisTweet, retweetedTweetIsLiked})
    } catch (e) {
        res.status(400).send(e)
    }
}

const viewReports = async (req, res) => { 
    try {
        if (!req.user.adminCheck()) {
            res.status(400).send("not an admin")
        }
        
        const limit = req.query.limit ? parseInt(req.query.limit) : 30;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;

        // match by owner or reportedid or type
        const match = {
            owner: req.query.owner, // match by owner if specified in query
            reportedId: req.query.reportedId, // match by reportedId if specified in query
            type: req.query.type // match by type if specified in query
        }
        
        // remove any undefined properties from the match object
        Object.keys(match).forEach(key => match[key] === undefined && delete match[key])

        let reports = await Report.find(match).sort({createdAt: -1}).limit(limit).skip(skip).populate("owner").populate("reportedId")
        res.send(reports)

    } catch (e) {
        res.status(400).send({error: e.toString()});
    }
}

module.exports = (NewReport, ReportDelete, ReportDeleteByReportedId, viewReport, viewReports)
