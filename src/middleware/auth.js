const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {

        //const token = req.header('x-api-key')
        let bearer = req.headers.authorization;

        if (typeof bearer == "undefined") return res.status(400).send({ status: false, message: "Token is missing, please enter a token" });

        let bearerToken = bearer.split(' ');

        let token = bearerToken[1];

        if (!token) {
            return res.status(403).send({ status: false, msg: "Token is required" })
        }

        const decode = jwt.verify(token, 'schoolManagment')

        if (!decode) {
            return res.status(403).send({ status: false, msg: "Invalid Aunthentication" })
        }

        req.userId = decode.userId
        req.authScopes = decode.scopes



        next();
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error })
    }
}


module.exports.auth = auth