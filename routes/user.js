const express = require("express");
const passport = require("passport");
const router = express.Router();
const {saveLocal} =require("../middleware.js");
const userController = require("../controller/user.js");

router
    .route("/signup")
    .get(userController.renderSignUp)
    .post(userController.postSignUp);

router 
   .route("/login")
   .get(userController.renderLogIn)
   .post(
           saveLocal,
           passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}),
           userController.postLogin
   );

router.get("/logout",userController.Logout);

module.exports = router;