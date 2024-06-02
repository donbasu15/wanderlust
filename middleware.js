const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utility/ExpressError.js")

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login to Wanderlust");
        return res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveLocal = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    console.log(id);
    let listing = await Listing.findById(id).populate("owner");
    console.log(listing);
    if(!listing.owner._id.equals(res.locals.currUser._id) ){
        req.flash("error","You don't have permisson to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.validationSchema = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body.listing);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validationReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body.listing);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(error);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    console.log(reviewId);
    let review = await Review.findById(reviewId);
    console.log(review);
    if(!review.author._id.equals(res.locals.currUser._id) ){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();

}