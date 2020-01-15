const express = require("express");
const router = express.Router();
const meetingsControler = require("../controllers/meetings.controller");


router.get("/", (req,res) => meetingsControler.getAllMeetings(req,res));

router.get("/:id", (req,res) => meetingsControler.getMeetingByID(req, res));


router.get("/user/:id", (req,res) => meetingsControler.getAllMeetingsByUser(req,res));


router.post("/create", (req, res) => meetingsControler.addMeeting(req,res));


router.put("/update", (req, res) => meetingsControler.updateMeeting(req,res));

router.delete("/delete", (req,res) => meetingsControler.deleteMeeting(req,res));

module.exports=router