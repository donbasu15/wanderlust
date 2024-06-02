if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app=express();
const mongoose=require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const path=require("path");
const methodOverride = require("method-override");
// ejs mate helps in making template
const ejsMate=require("ejs-mate");
const ExpressError=require("./utility/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//this is for styling the templates
//all the styles or javascripte content are put here in the public folder
//we call them static files
const dbUrl=process.env.ATLAS_DB_URL;

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(session({
    secret:process.env.SECRET_SESSION,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*7*24*60*60,
        maxAge: 1000*7*24*60*60,
        httpOnly: true
    },
}));
app.use(flash());

//this should be done before using passport
app.use(passport.initialize());
app.use(passport.session());//this is used so that in one session user can do multiple req and res
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//user info are kept in session
passport.deserializeUser(User.deserializeUser());//user related info are removed from sesion

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email: "studentcitg@gmail.com",
        username: "abcbabul"
    });
    let registedUser = await User.register(fakeUser,"newBabu");
    res.send(registedUser);
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);


main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
})



async function  main(){
    await mongoose.connect(dbUrl);
}


// app.get("/",(req,res)=>{
//     res.send("you have started");
// });



app.all("*",(err,req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{statusCode,message});
    
});


app.listen(8080,()=>{
    console.log("listenning to port 8080");
});