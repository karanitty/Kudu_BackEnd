const express = require('express');
const app = new express;
const mongoose = require('mongoose');
const cors = require('cors');

// const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://userrenjith:userrenjith@projectfiles.dmtoz.mongodb.net/VirtualClassroom?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
.then((res)=>{
    console.log('MongoDB connected');
})

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const authRouter = require('./src/routes/authenticationRoutes');
const classRouter = require('./src/routes/classRoutes');
const adminRouter = require('./src/routes/adminRoutes');


app.use('/auth',authRouter);
app.use('/class',classRouter);
app.use('/admin',adminRouter);

app.listen(3000,()=>{
    console.log('Server listening on port 3000');
})