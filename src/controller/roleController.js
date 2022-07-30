const roleModel = require("../models/roleModel")

const cerateRole = async (req, res) => {

    try {

        data = req.body;
        const { name, scopes } = data

        if (!name) {
            return res.status(400).send({ status: false, msg: "please enter name" })
        }

        if (scopes.length == 0) {
            return res.status(400).send({ status: false, msg: "please enter scopes" })
        }

        let createrole = await roleModel.create(data)
        return res.status(201).send({ status: true, msg: "role created sucessfully", data: createrole })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}


//-------------------------------------------------GET ROLE------------------------------------------------------------------------------------------//


const getrole = async (req, res) => {
    try {

        //-----------Authorpzation process--------//
        for (i = 0; i < req.authScopes.length; i++) {
            if (req.authScopes[i] == 'role-get') {

                let findrole = await roleModel.find();
                return res.status(200).send({ status: true, content: { data: findrole } })
            }
        }
        return res.status(401).send({ msg: "you are not allowed" })

    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}

module.exports.cerateRole = cerateRole
module.exports.getrole = getrole