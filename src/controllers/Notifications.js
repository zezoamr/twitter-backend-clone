const Notification = require("../models/Notification");
const User = require("../models/User");
const Tweet = require("../models/Tweet");

const getNotifications = async (req, res) => {

    if(req.user.Notificationssetting === false) res.status(404).send

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    const inital = await Notification.find({notifiedUserId: req.user._id, seen: false})
    res.write(inital);

    const intervalId = setInterval(async () => {
        let temp = await Notification.find({notifiedUserId: req.user._id, seen: false, createdAt: { $gt: new Date (Date.now() - 20000) }})
        temp.forEach(element => {
            element.populate("notifiedUserId").populate("userId").populate("tweetId")
        });
        res.write(temp);
    }, 20000);

    req.on('close', () => {
        console.log('Connection closed');
        clearInterval(intervalId);
        res.end();
    });

    setTimeout(() => {
        console.log('Closing connection automatically');
        clearInterval(intervalId);
        res.end();
    }, 20* 60000); //20 minutes
}

const markAsSeen = async (req, res) => {
    try{
        const temp = await Notification.findOne({_id: req.params.id, seen: false})
        if(! temp) res.status(404).send()
        temp.seen = true
        await temp.save()
        res.status(200).send()
    }
    catch (e){
        res.status(400).send(e)
    }
    
}

const createNotification = async (notifieduser, tweet, user, type) => {
    try{
        const us = await User.findOne({_id: user})
        const tw = await Tweet.findOne({_id: tweet})
        
        
        let t = ''
        if (type === "follow") { // from follow user
            if(! us ){
                throw "missing user from follow user in notification (createNotification)"
            }
            t = `${us.tag} followed you`
        }
        else if (type === "like") { // from like tweet
            if(! us || !tw ){
                throw "missing user and tweet from like tweet in notification (createNotification)"
            }
            t = `${us.tag} liked your tweet`
        }
        else if (type === "newtweet") { //from create tweet
            if(! us || !tw ){
                throw "missing user and tweet from create tweet in notification (createNotification)"
            }
            t = `${us.tag} made a new tweet`
        }
        else {
            throw "wrong notification type (createNotification)"
        }
        const noti = new Notification({seen: false, text: t, tweetId: tweet, notifiedUserId: notifieduser, userId: user})
        await noti.save()
    }
    catch (e){
        console.log(e)
    }
}

module.exports = {getNotifications, markAsSeen, createNotification}


