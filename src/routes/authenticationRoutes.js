const express = require('express');
const aRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const teacherModel = require('../models/teacherModel');
const studentModel = require('../models/studentModel');


aRouter.post('',(req,res)=>{
    res.send('OK');
})


//**********Teacher**********
//Teacher signUp
aRouter.post('/TsignUp',async(req,res)=>{
    var email = req.body.teacher.email;
    var data = await teacherModel.countDocuments({email:email});
    if(!data){
        var teacher = new teacherModel;
        teacher.username = req.body.teacher.username;
        teacher.email = req.body.teacher.email;
        teacher.pwd = await bcrypt.hash(req.body.teacher.pwd,12);
        teacher.save((err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log(err);            }
        })
    }
    else{
        res.status(406).send('Email already Exists');
    }
});

//Teacher Login
aRouter.post('/Tlogin',async(req,res)=>{
    const email = req.body.teacher.email;
    const pwd = req.body.teacher.pwd;

    const data = await teacherModel.findOne({email});
    if(!data){
        res.status(401).send('Email address not found!');
    }
    else{
        const passmatch = await bcrypt.compare(pwd,data.pwd);
        if(!passmatch){
            res.status(401).send('Invalid Credentials');
        }
        else{
            let payload = {subject:email+pwd};
            let token = jwt.sign(payload,'#key');
            const id = data._id;
            const username = data.username;
            res.status(200).send({id,token,username});
        }
    }
});


//**************student**************
//Student signUp
aRouter.post('/SsignUp',async(req,res)=>{
    const email = req.body.student.email;
    const data = await studentModel.countDocuments({email:email});
    if(!data){
        var student = new studentModel;
        student.username = req.body.student.username;
        student.email = req.body.student.email;
        student.pwd = await bcrypt.hash(req.body.student.pwd,12);
        student.save((err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log(err);
            }
        })
    }
    else{
        res.status(406).send('Email already Exists');
    }
});

//Student login
aRouter.post('/Slogin',async(req,res)=>{
    const email = req.body.student.email;
    const pwd = req.body.student.pwd;

    const data = await studentModel.findOne({email});
    if(!data){
        res.status(401).send('Email address not found');
    }
    else{
        const passmatch = await bcrypt.compare(pwd,data.pwd);
        if(!passmatch){
            res.status(401).send('Invalid Credentials');
        }
        else{
            let payload = {subject:email+pwd};
            let token = jwt.sign(payload,'#key');
            const id = data._id;
            const username = data.username
            res.status(200).send({id,token,username});
        }
    }
})


module.exports = aRouter;