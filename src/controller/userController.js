const roleModel = require("../models/roleModel")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}




const createUser = async (req, res) => {
    try {
        const data = req.body
        const { first_name, last_name, email, mobile, roleId, password } = data
        //=================================================FIRST NAME VALIDATION==========================================================================
        if (!first_name) {
            return res.status(400).send({ status: false, msg: "please enter first name its mendetory" })
        }

        if (!(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/).test(first_name))

            return res.status(400).send({ status: false, msg: "Please use valid type of name" })


        //=================================================LAST NAME VALIDATION==========================================================================


        if (!last_name) {
            return res.status(400).send({ status: false.valueOf, mas: "please enter last name its mendetory" })
        }
        if (!(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/).test(last_name))

            return res.status(400).send({ status: false, msg: "Please use valid type of name" })


        //=================================================EMAIL VALIDATION==========================================================================

        if (!email) {
            return res.status(400).send({ status: false, msg: "please enter email its medatory" })
        }
        if (!(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/).test(email)) {
            return res.status(400).send({ status: false, msg: "Please provide a email in correct format" })
        }

        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({ status: false, mag: "email already exist, try another email" })
        }


        //=================================================MOBILE VALIDATION==========================================================================



        if (!mobile) {
            return res.status(400).send({ status: false, msg: "Please entre mobile number, its mendetory" })
        }

        if (!(/^\d{10}$/).test(mobile)) {
            return res.status(400).send({ status: false, msg: `  is not valid Indian  phone Number` })
        }

        let checkMobile = await userModel.findOne({ mobile: mobile })
        if (checkMobile) {
            return res.status(400).send({ status: false, mag: "mobile number already exist, please try another mobile number" })
        }


        //=================================================PASSWORD VALIDATION============================================================================

        if (!password) {
            return res.status(400).send({ status: false, msg: "please enter password" })
        }

        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/).test(data.password)) {
            return res.status(400).send({ status: false, msg: "Password is not Valid :=> Enter Password in UpperCase ,lowercase with atleast one symbol and number with min. 8 length" })
        }

        //==========================================================Hashing Password==================================================================

        const saltRounds = 10
        const encryptedPassword = await bcrypt.hash(password, saltRounds)



        const userData = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            mobile: mobile,
            roleId: roleId,
            password: encryptedPassword,


        }




        let createuser = await userModel.create(userData)
        return res.status(201).send({ status: true, msg: "User create successfully", data: createuser })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error })
    }


}


//////////////////////////////////////////////// LOGIN //////////////////////////////////////////////////////////////////////////////////////////////


const userLogin = async (req, res) => {

    try {
        data = req.body
        const { email, password } = data

        if (!email) {
            return res.status(400).send({ status: false, mag: "please enter email for login" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "please enter password" })
        }

        let checkemail = await userModel.findOne({ email: email })
        if (!checkemail) {
            return res.status(404).send({ status: false, msg: "Email is not register" })
        }

        let roleId = checkemail.roleId;
        if (roleId == null) {
            return res.status(400).send({ msg: "role id is needed" })
        }


        let rolemodel = await roleModel.findById({ _id: roleId });

        let scopes = rolemodel.scopes;





        const decreyptedpassword = bcrypt.compare(password, checkemail.password)
        if (!decreyptedpassword) {
            return res.status(400).send({ status: false, msg: "password is incorrect" })
        }
        let userId = checkemail._id

        let token = jwt.sign({ userId: userId, roleId: roleId, scopes: scopes }, "schoolManagment",)
        res.header("x-api-key", token)
        return res.status(200).send({ status: true, message: "Login successfully", token })



    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error })
    }

}


//////////////////////////////////////////////////// GET ALL DATA //////////////////////////////////////////////////////////////////////////////////

const getUser = async (req, res) => {
    try {

        //-----------Authorpzation process--------//

        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'user-get') {






                const findUser = await userModel.find().sort({ first_name: 1 });
                if (findUser.length == 0) {
                    return res.status(404).send({ status: false, msg: "No data found" })
                }
                return res.status(200).send({ status: true, data: findUser })
            }
        }
        return res.status(401).send({ msg: "you are not allowed" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}


///////////////////////////////////////////////////GET USER BY DATA////////////////////////////////////////////////////////////////////////////////

const getUserById = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'user-get') {




                userId = req.params.id;
                if (!isValidRequestBody(userId)) {
                    return res.status(400).send({ status: false, msg: "please enter userId" })
                }
                let checkId = await userModel.findById({ _id: userId })
                if (!checkId) {
                    return res.status(404).send({ status: false, msg: "user not found" })
                }

                return res.status(200).send({ status: true, data: checkId })
            }
        }

        return res.status(401).send({ msg: "you are not allowed" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}



module.exports.createUser = createUser
module.exports.userLogin = userLogin
module.exports.getUser = getUser
module.exports.getUserById = getUserById