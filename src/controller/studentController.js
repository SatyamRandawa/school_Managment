const studentModel = require("../models/studentModel")


//------------------------------------------------VALIDATION SECTION------------------------------------------------------------------------------//

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//-------------------------------------------------CREATE STUDENT--------------------------------------------------------------------------------//


const createStudent = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'student-create') {




                const data = req.body;
                const { name, userId, schoolId } = data

                if (!isValidRequestBody(data)) {
                    return res.status(400).send({ status: false, msg: "Please enter data" })
                }

                if (!name) {
                    return res.status(400).send({ status: false, msg: "please enter name" })
                }

                if (!userId) {
                    return res.status(400).send({ status: false, msg: "Please enter userId" })
                }

                if (!schoolId) {
                    return res.status(400).send({ status: false, msg: "Please enter schoolId" })
                }

                let create = await studentModel.create(data)
                return res.status(201).send({ status: true, content: { data: create } })

            }
        }
        return res.status(401).send({ msg: "you are not allowed" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}

//------------------------------------------------------ GET ALL STUDENTS ------------------------------------------------------------------------//


const getall = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'student-get') {



                let findstudents = await studentModel.find().sort({ name: 1 })
                if (findstudents.length == 0) {
                    return res.status(400).send({ status: false, msg: "Not students found" })
                }
                return res.status(200).send({ status: true, content: { data: findstudents } })
            }
        }
        return res.status(401).send({ msg: "you are not allowed" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}

module.exports.createStudent = createStudent
module.exports.getall = getall