const mongoose = require("mongoose");
const Review = require("./review");
const { type } = require("./listingvalidate");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String
    },
    image: {
        url: String,
        filename: String
    },
    price:{
        type:Number
    },
    location: {
        type:String
    },
    country:{
        type:String
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates: {
            type:[Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async (deleted) =>{
    if(deleted){
        await Review.deleteMany({_id:{$in: deleted.reviews}});
    }
    
});
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;