const express = require('express');
const adminRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const verifytoken = require('./verify');

const teacherModel = require('../models/teacherModel');
const studentModel = require('../models/studentModel');


//admin login
adminRouter.post('/login',async(req,res)=>{
    const email = req.body.admin.email;
    const pwd = req.body.admin.pwd;
    const admin_mail = "admin@virtualclassroom.com";
    const admin_pass = "$2a$12$2ZWjJA2PqDibYNR/1/FB7OCXZws167urjLKm8OyeXXPBzHvZOv6Fm";
    const check = await bcryptjs.compare(pwd,admin_pass);
    if(!check || admin_mail!=email){
        res.status(401).send('Invalid Credentials');
    }
    else{
        let payload = {subject:email+pwd};
        let token = jwt.sign(payload,'#key');
        const username = "Admin Virtual Classroom";
        res.status(200).send({token,username});
    }
})

//list all students
adminRouter.get('/listStudents',verifytoken,async(req,res)=>{
    const studentData = await studentModel.find().populate('classes');
    // console.log(studentData)
    const data = [];
    for(i=0;i<studentData.length;i++)
    {
        var temp = {id:"",name:"",classes:[]};
        if(!studentData[i]){
            continue;
        }
        temp.id = studentData[i]._id;
        temp.name = studentData[i].username;
        // var tempClasses = "";
        var tempClasses = [];
        for(j=0;j<studentData[i].classes.length;j++)
        {
            // tempClasses+=(studentData[i].classes[j].className)+",";
            var temp1 = studentData[i].classes[j].className;
            tempClasses.push(temp1);
        }
        temp.classes = tempClasses;
        data.push(temp);
    }
    // console.log(data);
    res.send(data);
})

//delete a student
adminRouter.delete('/deleteStudent/:id',verifytoken,async(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    await studentModel.findByIdAndDelete({"_id":id})
    .then(()=>{
        res.status(200).send();
    })
    res.send();
})

//list all teachers
adminRouter.get('/listTeachers',verifytoken,async(req,res)=>{
    const teacherData = await teacherModel.find().populate('classes');
    const data = [];
    for(i=0;i<teacherData.length;i++){
        var temp = {id:"",name:"",classes:[]};
        if(!teacherData)
            continue;
        temp.id = teacherData[i]._id;
        temp.name = teacherData[i].username;

        var tempClasses = [];
        for(j=0;j<teacherData[i].classes.length;j++){
            if(!teacherData[i].classes[j])
                continue;
            var temp1 = {classId:"",className:""};
            temp1.className = teacherData[i].classes[j].className;
            temp1.classId = teacherData[i].classes[j]._id;
            tempClasses.push(temp1);
        }
        temp.classes = tempClasses;
        data.push(temp);
    }
    // console.log(data[0].classes);
    res.send(data);
});

//delete a teacher
adminRouter.delete('/deleteTeacher/:id',verifytoken,async(req,res)=>{
    const id = req.params.id;
    // console.log(id);
    await teacherModel.findByIdAndDelete({"_id":id})
    .then(()=>{
        res.status(200).send();
    })
    // res.send();
})

module.exports = adminRouter;