const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const verifyAccountMail = require('../utility/sendMail');
const sendSMS = require('../utility/sendSMS');


const getAllStudent = (req, res) => {
    const getStudent = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const verified = getStudent.filter( data => data.isVerified == true );
    res.render('student/index', {
        getStudent : verified
    });
} 

const unverifiedStudent = (req, res) => {
    const getStudent = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const unverified = getStudent.filter( data => data.isVerified == false );
    res.render('student/unverified', {
        getStudent : unverified
    });
}


const createStudent = (req, res) => {
    res.render('student/create');
}

    const studentDataStore = async (req, res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { name, email, cell, location } = req.body;
    let last_id = 1;
    if(students.length > 0){
        last_id = students[students.length - 1].id + 1 ;
    }
    const token = Date.now() +'_'+ Math.floor(Math.random() * 10000000);
    const smsToken = Math.ceil(Math.random() * 1000);
    await verifyAccountMail(email, 'Account Verify', {
        name, email, cell, token
    });
    students.push({
        id : last_id,
        name : name,
        email : email,
        cell : cell,
        location : location,
        photo : req.file ? req.file.filename : 'avatar.jpg',
        isVerified : false,
        token : token,
        smsToken : smsToken
    });
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));
    res.redirect('/student');
}



const singleStudent = (req, res) => {
    const { id } = req.params;
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const student = students.find( data => data.id == id );
    res.render('student/show', { student });
}


const deleteStudent = (req, res) => {
    const { id } = req.params;
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const newStudents = students.filter( data => data.id != id );
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(newStudents));
    res.redirect('back');
}


const editStudent = (req, res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { id } = req.params;
    const edit_data = students.find( data => data.id == id );
    res.render('student/edit', {
        student : edit_data
    });
}

const updateStudent = (req, res) => {
    const { id } = req.params;
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    students[students.findIndex( data => data.id == id )] = {
        ...students[students.findIndex( data => data.id == id )],
        name : req.body.name,
        email : req.body.email,
        cell : req.body.cell,
        location : req.body.location
    }
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students))
    res.redirect('back');
}

const verifyAccount = (req, res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const token = req.params.token;
    students[students.findIndex( data => data.token == token )] = {
        ...students[students.findIndex( data => data.token == token )],
        isVerified : true,
        token : '' 
    }
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));
    res.redirect('/student/');
}


const getSMS = (req, res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { id } = req.params;
    const student = students.find( data => data.id == id );
    const { cell, smsToken } = student;
    sendSMS(cell, `Verify your account with this code ${ smsToken }`);
    res.render('student/verify', {
        student
    });
}


const verifySMS = (req, res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname, '../db/student.json')));
    const { otp } = req.body;
    students[students.findIndex( data => data.smsToken == otp )] = {
        ...students[students.findIndex( data => data.smsToken == otp )],
        isVerified : true,
        smsToken : ''
    }
    writeFileSync(path.join(__dirname, '../db/student.json'), JSON.stringify(students));
    res.redirect('/student/');
  };


  
module.exports = {
    getAllStudent,
    createStudent, 
    editStudent, 
    singleStudent, 
    studentDataStore, 
    deleteStudent,
    updateStudent,
    unverifiedStudent,
    verifyAccount,
    getSMS,
    verifySMS
}