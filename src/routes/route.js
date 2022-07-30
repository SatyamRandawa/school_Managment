const express = require('express')
const router = express.Router();
const userController = require("../controller/userController")
const schoolController = require("../controller/schoolController")
const studentController = require("../controller/studentController")
const roleController = require("../controller/roleController")
const authenticaation = require("../middleware/auth")


//----------------USER---------------------------
router.post("/user/signup", userController.createUser)
router.post("/user/Signin", userController.userLogin)
router.get("/user", authenticaation.auth, userController.getUser)
router.get("/user/:id", authenticaation.auth, userController.getUserById)


//---------------Role----------------------------
router.post("/role", roleController.cerateRole)
router.get("/role", authenticaation.auth, roleController.getrole)


//----------------STUDENT------------------------
router.post("/student", authenticaation.auth, studentController.createStudent)
router.get("/student", authenticaation.auth, studentController.getall)



//----------------SCHOOL---------------------------
router.post("/school", authenticaation.auth, schoolController.schoolCreate)
router.get("/school", authenticaation.auth, schoolController.getschools)
router.get("/school/students", authenticaation.auth, schoolController.getStudents)











module.exports = router