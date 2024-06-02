const User = require("../models/user");

module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let nuser = new User({
            email,
            username
        })
        const registedUser = await User.register(nuser,password);
        console.log(registedUser);
        
        req.login(registedUser,(err)=>{
            if(err){
                return next(err);
            }else{
                req.flash("success","Welcome to wonderlust");
                res.redirect("/listings");
            }
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }

}

module.exports.renderLogIn = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.Logout = (req,res)=>{
    req.logout((err)=>{
        if(!err){
            req.flash("success","LoggedOut Success");
            res.redirect("/listings");
        }else{
            next(err);
        }
    })
};