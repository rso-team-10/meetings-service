import {TextEncoder as Base64} from "node/util";

const {meetingSchema} = require("../models/meeting");
const {db} = require("../db");
let mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const ics = require('ics');

const controllers = {
    getAllMeetings: async function (req, res) {
        let meetingModel = db.model('meeting', meetingSchema);
        meetingModel.find(function (err, meetings) {
            if (err) {
                console.log(err);
                res.status(404).json({error: err})
            } else {
                res.status(200).json(meetings);
            }
        })

    },
    getAllMeetingsByUser: async function (req, res) {
        let meetingModel = db.model('meeting', meetingSchema);
        meetingModel.find({user_id: req.params.id}, function (err, meetings) {
            if (err) {
                console.log(err);
                res.status(404).json({error: err})
            } else {
                res.status(200).json(meetings)
            }
        })
    },
    getMeetingByID: async function (req, res) {
        let meetingModel = db.model('todo', meetingSchema);
        meetingModel.findOne({_id: req.params.id}, function (err, meeting) {
            if (err) {
                console.log(err);
                res.status(404).json({error: err})
            } else {
                res.status(200).json(meeting)
            }
        })
    },
    addMeeting: async function (req, res) {
        console.log(req.body);
        let meeting_date = req.body.meeting_date;
        let meeting_name = req.body.meeting_name;
        let meeting_description = req.body.meeting_description;
        let meetingModel = db.model('todo', meetingSchema);
        let Meeting = new meetingModel({
            user_id: req.body.user_id,
            meeting_date: meeting_date,
            meeting_name: meeting_name,
            meeting_description: meeting_description,
        });
        Meeting.save((err) => {
            if (err) {
                console.log(err);
                res.status(400).json({error: err})
            } else {
                const event = {
                    start: [2018, 5, 30, 6, 30],
                    duration: {},
                    title: meeting_name,
                    description: meeting_description,
                    status: 'CONFIRMED',
                    busyStatus: 'BUSY',
                    organizer: { name: 'Admin', email: 'test@mail.com' },
                };
                ics.createEvent(event, (error, value) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    let encodedEvent = Base64.encode(value);
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                        to: 'vc5725@student.uni-lj.si',
                        from: 'rso-app@rso.com',
                        subject: meeting_date + ' ' + meeting_name,
                        text: 'Nov sestanek '+ meeting_date +'\n\n'+ meeting_name +'\n\n'+ meeting_description,
                        html: '<strong>To sporočilo vam je dostavil Node, Node.js</strong>',
                        attachments: [{
                            content: encodedEvent,
                            filename: 'invite.ics',
                            type: 'text/calendar',
                            disposition: 'attachment',
                            contentId: 'mytext'
                        }],
                        headers: {
                            method: "REQUEST"
                        }
                    };
                    sgMail.send(msg);
                    res.status(200).json({message: "Meeting added"})
                });
            }
        })
    },
    updateMeeting: async function (req, res) {
        let meeting_date = req.body.meeting_date;
        let meeting_name = req.body.meeting_name;
        let meeting_description = req.body.meeting_description;
        let user_id = req.body.user_id;

        let meetingModel = db.model('todo', meetingSchema);
        //TODO
        meetingModel.updateOne(
            {
                _id: mongoose.Types.ObjectId(req.body.id)
            },
            {
                user_id: user_id,
                meeting_date: meeting_date,
                meeting_name: meeting_name,
                meeting_description: meeting_description,
            },
            {omitUndefined: true},
            function (err) {
                if (err) {
                    res.status(400).json({error: err})
                } else {
                    res.status(200).json({message: "Meeting updated"})
                }
            }
        )
    },
    deleteMeeting: async function (req, res) {
        let meetingModel = db.model('report', meetingSchema)
        meetingModel.deleteOne({_id: req.body.id}, function (err, found) {
            if (err) {
                res.json({error: err})
            }
            else {
                res.status(200).json({message: "Meeting deleted"})
            }
        })
    },
};

module.exports = controllers;