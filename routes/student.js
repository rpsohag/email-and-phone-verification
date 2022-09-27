const express = require('express');
const { getAllStudent, createStudent, editStudent, singleStudent, studentDataStore, deleteStudent, updateStudent, unverifiedStudent, verifyAccount, getSMS, verifySMS } = require('../controllers/studentController');
const multer = require('multer');
const path = require('path');


const router = express.Router();

const storage = multer.diskStorage({
    destination : (req, file, cb ) => {
        cb(null, path.join(__dirname, '../public/images/students'));
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname );
    }
});

const studentPhotoMulter = multer({
    storage : storage
}).single('student-photo');

router.get('/', getAllStudent);
router.get('/unverified', unverifiedStudent);
router.get('/create', createStudent);
router.post('/create', studentPhotoMulter, studentDataStore);
router.get('/verify/:token', verifyAccount);
router.get('/verification/:id', getSMS);
router.post('/verification/:id', verifySMS);
router.get('/edit/:id', editStudent);
router.post('/update/:id', studentPhotoMulter, updateStudent);
router.get('/delete/:id', deleteStudent);
router.get('/:id', singleStudent);


// exports
module.exports = router ;