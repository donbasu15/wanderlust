const mongoose=require("mongoose");
const idata=require("./datafilename.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected succesfully");
})
.catch((err)=>{
    console.log(err);
})

async function  main(){
    await mongoose.connect(mongo_url);
};

const intDB = async()=>{
    await Listing.deleteMany({});
    idata.data =  idata.data.map((ob)=>({...ob,owner:'66560b02b588b59085655726' }))
    await Listing.insertMany(idata.data);
    console.log("listing added");
}

intDB();

