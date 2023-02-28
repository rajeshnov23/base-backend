const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
const jwt = require('jsonwebtoken');

const checkTokenExpired = async (req, res, next) => {
    console.log("inside the checkTokenExpired middleware")
    const date = new Date();
    const token = req.header('Authorization')
    // Verifying the JWT token
    console.log("token is printed")
    console.log(token)
    if (token) {
        try {
            jwt.verify(token, PRIV_KEY, (err, decoded) => {
                console.log("err is printed")
                // console.log(err)
                if (err) {
                    // console.log(`${date.getHours()}:${date.getMinutes()}
                    //                        :${date.getSeconds()}`);
                    // console.log(err);
                    res.status(500).json({
                        status: "E",
                        statusmessage: "Token timed out",
                        error: err
                    });
                }
                else {
                    console.log(decoded);
                    console.log("Token verifified successfully");
                    // res.status(200).json({
                    //     status: "S",
                    //     statusmessage: "Successfully validated the token",
                    //     decoded: decoded
                    // });
                    res.locals.decoded = decoded;
                    next();
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
    else {
        res.status(500).json({
            status: "E",
            statusmessage: "No token found in the header",
        });
    }
}

module.exports = checkTokenExpired;