const schoolModel = require("../models/schoolModel");
const studentModel = require("../models/studentModel");





const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const schoolCreate = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'school-create') {



                const data = req.body
                const { name, city, state, country } = data

                if (!isValidRequestBody(data)) {
                    return res.status(400).send({ status: false, msg: "Please enter data" })
                }

                if (!name) {
                    return res.status(400).send({ status: false, msg: "Please enter name of school" })
                }

                const checkdublicate = await schoolModel.findOne({ name: name })
                if (checkdublicate) {
                    return res.status(400).send({ status: false, msg: "School already register" })
                }

                if (!city) {
                    return res.status(400).send({ status: false, msg: "please enter city name" })
                }
                if ((!isValid(city)) || !(/^[a-zA-Z " "]*$/).test(city)) {
                    return res.status(400).send({ status: false, message: `${city} is not valid city` })

                }

                if (!state) {
                    return res.status(400).send({ status: false, msg: "Please enter state name" })
                }
                if ((!isValid(state)) || !(/^[a-zA-Z " "]*$/).test(state)) {
                    return res.status(400).send({ status: false, message: `${state} is not valid city` })

                }

                if (!country) {
                    return res.status(400).send({ status: false, msg: "Please enter country name" })
                }
                if ((!isValid(country)) || !(/^[a-zA-Z " "]*$/).test(country)) {
                    return res.status(400).send({ status: false, message: `${country} is not valid city` })

                }

                let cerateSchool = await schoolModel.create(data)
                return res.status(201).send({ status: true, msg: "School Register sucessfully", data: cerateSchool })

            }
        }

        return res.status(401).send({ msg: "you are not allowed" })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}


/////////////////////////////////////////////////////// GET ALL SCHOOLS ///////////////////////////////////////////////////////////////////////////

const getschools = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'school-get') {
                //return res.send("you are not allowed")


                const findSchools = await schoolModel.find().sort({ name: 1 });
                if (findSchools.length == 0) {
                    return res.status(404).send({ status: false, msg: "No School found" })
                }
                return res.status(200).send({ status: true, content: { data: findSchools } })
            }
        }
        return res.status(401).send({ msg: "you are not allowed" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}

///////////////////////////////////////////// GET STUDENTS /////////////////////////////////////////////////////////////////////////////////////////


const getStudents = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'school-students') {

                let schools = await schoolModel.find()
                let result = [];
                for (let school of schools) {
                    let students = await studentModel.find({ schoolId: school._id });
                    result.push({ ...school._doc, students: students });
                };

                return res.status(200).send({ data: result })
            }
        }
        return res.status(401).send({ msg: "you are not allowed" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}


module.exports.schoolCreate = schoolCreate
module.exports.getschools = getschools
module.exports.getStudents = getStudents