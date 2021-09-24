const express = require('express');
const cRouter = express.Router();
const verifyToken = require('./verify');
const mongoose = require('mongoose');

const classModel = require('../models/classModel');
const teacherModel = require('../models/teacherModel');
const studentModel = require('../models/studentModel');
const noteModel = require('../models/notesModel');
const assignmentModel = require('../models/assignmentsModel');
const submissionModel = require('../models/submissionModel');

const toId = mongoose.Types.ObjectId;

//create class: teacher
cRouter.post('/create',verifyToken,async(req,res)=>{
    // console.log(req.body);
    const tId = req.body.class.tId;
    const classCode = req.body.class.classCode;
    const temp = await classModel.countDocuments({classCode:classCode});
    var teachertemp = await teacherModel.findById(tId);
    // console.log(temp);
    if(!temp){
        var classData = new classModel();
        classData.className = req.body.class.className;
        classData.classCode = req.body.class.classCode;
        classData.Teacher = teachertemp.username
        classData.description = req.body.class.description;
        // var teacherData = await teacherModel.updateOne({"_id":tId},
        //                                                     {$push:{classes:classCode}});                                                           
        classData.save(async(err,doc)=>{
         if(!err){
            const id = doc._id;
            var teacherData = await teacherModel.updateOne({"_id":tId},{$push:{classes:id}});
             res.send(doc);
           }
         else{
             console.log(err);
         }
    });
    }
    else{
            res.status(406).send('Class Code already Exists');
    }

    
});

//get classes by a teacher
cRouter.post('/teacherList',verifyToken,async(req,res)=>{
    const id = req.body.id;
    const teacherData = await teacherModel.findById(id).populate('classes');
    // const teacherClasses = teacherData.classes;
    // // console.log(teacherClasses[0]);
    
    // var list = [];
    // for(i=0;i<teacherClasses.length;i++){
    //     var temp = await classModel.findOne({'classCode':teacherClasses[i]});
    //     list.push(temp);
    // }
    // res.status(200).send(list);
    res.status(200).send(teacherData.classes);



});

//list all classes
cRouter.get('/classList',async(req,res)=>{
    classModel.find()
        .then(function(classes){
            res.send(classes);
        })
});

//enroll in a class student
cRouter.post('/enrollClass',verifyToken,async(req,res)=>{
    var id = req.body.id;
    var classid = req.body.classid;
    
    var classData = await classModel.findById(classid);
    var student = await studentModel.findById(id);
    // console.log(student.classes);
    if(student.classes.includes(classid)){
        res.status(401).send("Already Enrolled in Class");
    }
    else{
        var studentData = await studentModel.updateOne({"_id":id},
                                                            {$push:{classes:classid}});
        res.status(200).send();                                                            
    }
});

//list classses enrolled by a student
cRouter.post('/studentlist',verifyToken,async(req,res)=>{
    const id = req.body.id;
    const studentData = await studentModel.findById(id).populate('classes')
    res.status(200).send(studentData.classes);
})

//get single class
cRouter.get('/:id',async(req,res)=>{
    const id = req.params.id;
    await classModel.findOne({"_id":id})
    .then((cls)=>{
        res.send(cls);
    })
});

//update class by teacher
cRouter.put('/update',verifyToken,async(req,res)=>{
    const classid = req.body.classid;
    const classCode = req.body.classCode;
    const className = req.body.className;
    const description = req.body.description;
    await classModel.findByIdAndUpdate({"_id":classid},{$set:{"classCode":classCode,"className":className,"description":description}})
    .then(function(){
        res.status(200).send();
    })
})

//delete class by teacher
cRouter.delete('/delete/:id',verifyToken,async(req,res)=>{
    const id = req.params.id;
    await classModel.findByIdAndDelete({"_id":id})
    .then(()=>{
        // console.log('Class Deleted');
        res.status(200).send();
    })
});



//create note by teacher
cRouter.post('/createNote',verifyToken,async(req,res)=>{
    const classId = req.body.id;
    var noteData = new noteModel();
    noteData.classId = classId;
    noteData.title = req.body.noteData.title;
    noteData.content = req.body.noteData.content;
    noteData.save(async(err,doc)=>{
        if(!err){
            const id = doc._id;
            const d = 'renjith';
            await classModel.updateOne({"_id":classId},{$push:{notes:id,submission:d}});
            res.send(doc);
            
        }
        else{
            console.log(err);
        }
    })
});

//get notes of a class
cRouter.post('/getNotes',verifyToken,async(req,res)=>{
    const classId = req.body.classId;
    // console.log(classId);
    const classData = await classModel.findById(classId).populate('notes');
    res.status(200).send(classData.notes);
});

//delete a note
cRouter.delete('/deleteNote/:id',verifyToken,async(req,res)=>{
    const id = req.params.id;
    await noteModel.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('Class Deleted');
        res.status(200).send();
    })
});

//create assignment
cRouter.post('/createAssignment',verifyToken,async(req,res)=>{
    const classId = req.body.id;
    var assignmentData = new assignmentModel;
    assignmentData.classId = classId;
    assignmentData.title = req.body.assignmentData.title;
    assignmentData.content = req.body.assignmentData.content;
    assignmentData.save(async(err,doc)=>{
        if(!err){
            const id = doc._id;
            await classModel.updateOne({"_id":classId},{$push:{assignments:id}});
            res.send(doc);
            
        }
        else{
            console.log(err);
        }
    })
});

//get Assignments of a class
cRouter.post('/getAssignments',verifyToken,async(req,res)=>{
    const classId = req.body.classId;
    // console.log(classId);
    const classData = await classModel.findById(classId).populate('assignments');
    res.status(200).send(classData.assignments);
});

//delete an assignment
cRouter.delete('/deleteAssignment/:id',verifyToken,async(req,res)=>{
    const id = req.params.id;
    await assignmentModel.findByIdAndDelete({"_id":id})
    .then(()=>{
        res.status(200).send();
    })
});

//submit assignment student
cRouter.post('/submitAssignment',verifyToken,async(req,res)=>{
    const submission = req.body.submission;
    const asid = req.body.asid;
    const sId = req.body.sId;
    // const sub = {
    //     asid : asid,
    //     submission: submission.submission
    // }
    // var check = await studentModel.find({"_id":sId,"submissions.asid":asid});
    // // console.log(check);
    // if(!check.length){
    //     var studentSubmission = await studentModel.updateOne({"_id":sId},{$push:{submissions:sub}});
    //     res.status(200).send();
    // }
    // else{
    //     res.status(401).send('Already Submitted');
    // }
    var check = await submissionModel.find({$and:[{"sid":sId},{"asid":asid}]});
    console.log(sId);
    console.log(asid);
    console.log(check);
    if(!check.length){
        var submissionData = new submissionModel;
        submissionData.sid = sId;
        submissionData.asid = asid;
        submissionData.submission = submission.submission;
        submissionData.save(async(err,doc)=>{
            if(!err){
                const id = doc._id;
                await studentModel.updateOne({"_id":sId},{$push:{submissions:id}});
                res.send(doc);
            }
            else{
                console.log(err);
            }
        })
    }
    else{
        res.status(400).send('Assignment Already submitted');
    }

});


//get submission status
cRouter.post('/submissionStatus',verifyToken,async(req,res)=>{
    const asid = req.body.asid;
    const sid = req.body.sid;
    var check = 0;
    // console.log(asid+' '+sid);
    const data = await submissionModel.find({$and:[{"sid":sid},{"asid":asid}]});
    // console.log(data);
    if(data.length){
        res.send(data);
    }
    else{
        res.status(400).send('No submission Found');
    }
})

//get a single assignment
cRouter.post('/getAssignment',verifyToken,async(req,res)=>{
    const asid = req.body.asid;
    const data = await assignmentModel.findById(asid);
    res.send(data);
})

//get all submissions of an assignment
cRouter.post('/submissions',async(req,res)=>{
    const asid = req.body.asid;
    const subm = await submissionModel.find({"asid":asid}).populate('students');
    // console.log(subm);
    const data = [];
    for(i=0;i<subm.length;i++){
        var temp = {name:"",submission:""};
        temp.submission = subm[i].submission;
        var tempName = await studentModel.findById(subm[i].sid);
        // console.log(tempName.username);
        if(!tempName)
            continue;
        temp.name = tempName.username;
        // console.log(temp);
        data.push(temp);
    }
    // console.log(data);z
    res.send(data);
})

module.exports = cRouter;