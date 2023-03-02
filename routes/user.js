var express = require("express");
const UserModel = require("../schemas/UserSchema");
var router = express.Router();
const logger = require("../logger");
const utils = require("../lib/utils");
const checkTokenExpired = require("../lib/middlewares");

const fs = require("fs");
const path = require("path");
const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

router.post("/register", async (req, res, next) => {
  let error = "";
  let validationCheck =
    req.body?.username &&
    req.body?.email &&
    req.body?.password &&
    req.body?.password.length > 7;
  console.log(validationCheck);
  if (validationCheck) {
    if ((await isUserExists(req.body.username)) === true) {
      error = "User already exists in db";
      genErrorResponse(error, res);
    } else {
      const saltHash = utils.genPassword(req.body.password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newUser = new UserModel({
        username: req.body.username,
        password: req.body.password,
        hash: hash,
        salt: salt,
      });

      try {
        newUser.save().then((user) => {
          res.status(201).json({
            status: "S",
            statusmessage: "Successfully Registered Users",
            user: user,
          });
        });
      } catch (err) {
        res.status(401).json({
          status: "E",
          statusmessage: "Error in the request",
          err: err,
        });
      }
    }
  } else {
    error = errorCheck(req);
    genErrorResponse(error, res);
  }
});

function genErrorResponse(error, res) {
  res.status(500).json({
    status: "E",
    statusmessage: "Error in the request",
    error: error,
  });
}

function errorCheck(req) {
  let error = "";
  if (!req.body?.username || !req.body?.password) {
    error = "Username or Password is empty";
  } else if (req.body?.password.length <= 7) {
    error = "Password length is not sufficient";
  }

  return error;
}

async function isUserExists(username) {
  console.log(username);
  let flag = false;
  try {
    const result = await UserModel.exists({ username: username });
    console.log("users exist or not");
    console.log(result);
    if (result) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  } catch (error) {
    console.log(error);
  }
}

// Validate an existing user and issue a JWT
router.post("/login", function (req, res, next) {
  let error = "";
  let validationCheck =
    req.body?.username && req.body?.password && req.body?.password.length > 7;
  console.log(validationCheck);
  if (validationCheck) {
    UserModel.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            status: "E",
            statusmessage: "Could not find the user",
          });
        }

        // Function defined at bottom of app.js
        const isValid = utils.validPassword(
          req.body.password,
          user.hash,
          user.salt
        );

        if (isValid) {
          const tokenObject = utils.issueJWT(user);

          res.status(200).json({
            status: "S",
            statusmessage: "Successfully Logged the User",
            token: tokenObject.token,
            expiresIn: tokenObject.expires,
          });
        } else {
          res
            .status(401)
            .json({
              status: "E",
              statusmessage: "you entered the wrong password",
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    error = errorCheck(req);
    genErrorResponse(error, res);
  }
});

router.get("/checkExpired", checkTokenExpired, async (req, res, next) => {
  console.log("inside the protected route");
  res.status(200).json({
    status: "S",
    statusmessage: "Successfully validated the token",
    decoded: res.locals.decoded,
  });
});

/* GET users listing. */
router.get("/users", async (req, res, next) => {
  try {
    const result = await UserModel.find({});
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Retrived Users",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const result = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Retrieved User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/user/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const result = await UserModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Deleted User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/user/:id", async (req, res, next) => {
  const newUser = {};
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.message = req.body.message;
  console.log("newuser", newUser);
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      newUser
    );
    res.status(200).json({
      status: "S",
      statusmessage: "Successfully Updated User",
      users: result,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/user", async (req, res, next) => {
  const newUser = new UserModel();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.message = req.body.message;
  // console.log(req.body)
  let condition =
    req.body.name?.trim() !== "" &&
    req.body.name !== null &&
    req.body.email?.trim() !== "" &&
    req.body.email !== null &&
    req.body.message?.trim() !== "" &&
    req.body.message !== null;
  if (condition) {
    try {
      const result = await newUser.save();
      res.status(201).json({
        status: "S",
        statusmessage: "Successfully Created User",
        users: result,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    logger.log("error", "error in the request " + newUser);
    res.status(500).json({
      status: "E",
      statusmessage: "Error Creating User",
      users: req.body,
    });
  }
});

// router.post("/validateToken", async (req, res, next) => {
//     const date = new Date();
//     const token = req.header('Authorization')
//     // Verifying the JWT token
//     console.log("token is printed")
//     console.log(token)
//     if (token) {
//         try {
//             jwt.verify(token, PRIV_KEY, (err, decoded) => {
//                 console.log("err is printed")
//                 // console.log(err)
//                 if (err) {
//                     console.log(`${date.getHours()}:${date.getMinutes()}
//                                            :${date.getSeconds()}`);
//                     console.log(err);
//                     res.status(500).json({
//                         status: "E",
//                         statusmessage: "Token timed out",
//                         error: err
//                     });
//                 }
//                 else {
//                     let expirytime = decoded;
//                     console.log(expirytime);
//                     console.log("Token verifified successfully");
//                     res.status(200).json({
//                         status: "S",
//                         statusmessage: "Successfully validated the token",
//                         decoded: expirytime
//                     });
//                 }
//             });
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     else {
//         res.status(500).json({
//             status: "E",
//             statusmessage: "No token found in the header",
//         });
//     }

// });

module.exports = router;
