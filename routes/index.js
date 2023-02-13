var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("inside the index");
  // res.render("index", { title: "Express" });
  const posts = [
    { id: "dfhfdhfdh", name: "rajesh", age: 35 },
    { id: "dfhfdh", name: "dine", age: 32 },
    { id: "fdhdfdjj", name: "rihaan", age: 1 },
  ];
  res.status(200).json({
    status: 200,
    statusmessage: "Successfully done",
    posts: posts,
  });
});

module.exports = router;
