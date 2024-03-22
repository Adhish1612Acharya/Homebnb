const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        uppercase:true,
        required:true,
    },
    country:{
        type:String,
        uppercase:true,
        required:true,
    },
    state:{
        type:String,
        uppercase:true,
        required:true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      filter:{
        type:String,
        enum:["Trending","Rooms", "Iconic-cities","Mountains",
         "Castle","Amazing-pools","Camping","Farms"],
        required: true  
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
   await Review.deleteMany({_id:{$in:listing.reviews}});
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;