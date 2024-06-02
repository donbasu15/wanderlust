const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken}); //make a client which can make all the geocoding

module.exports.index = async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res)=>{  
    res.render("listings/new.ejs");
}; 

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: { path: "author"}}).populate("owner");

    if(!listing){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.postNewListing = async (req,res,next)=>{
    let coordiate = await geocodingClient.forwardGeocode({ //this is process of geocoding
        //limit are the no of coordiates returned
        //geocode are stored in response
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

     

    let url = req.file.path;
    let filename = req.file.filename;
    let listing =new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};

    listing.geometry = coordiate.body.features[0].geometry;
    let savedListing=await listing.save();
    
    req.flash("success","New listing created !!");
    res.redirect("/listings");      
};

module.exports.updateListing = async (req,res,next)=>{  
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated !!");
    res.redirect(`/listings/${id}`);          
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    
    req.flash("success","Listing deleted !!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect("/listings");
    }else{
        let originalImageUrl = listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    }
    
}