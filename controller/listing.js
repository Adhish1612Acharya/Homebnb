const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let listings=await Listing.find({});
    res.render("./listings/listings.ejs",{listings});
};

module.exports.createListingForm=(req,res)=>{
   res.render("./listings/new.ejs");
};

module.exports.showIndividualListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate(
        {path:"reviews",
          populate:{path:"author"}
        }).populate("owner");
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,)=>{
    let result= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
       limit:1,
      })
        .send();
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=result.body.features[0].geometry;
    let saveListing=await newListing.save();
    req.flash("success","New listing created successfully");
    res.redirect("/listings");
};

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing your are finding does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_250")
    res.render("./listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.edit=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    let result= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
       limit:1,
      })
        .send();
    listing.geometry=result.body.features[0].geometry;
    if(typeof req.file!== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }
    await listing.save();
    req.flash("success","Listing Edited successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}

module.exports.search=async (req,res)=>{
    let {searchdata}=req.body;
    let listings=await Listing.find({$or:[{location : searchdata.toUpperCase()},
                                     {country : searchdata.toUpperCase()},
                                    {state:searchdata.toUpperCase()}]
                                    });
    if(!listings.length){
        req.flash("error","Sorry, no destinations matched your search.Please try again with a different keyword or location");
        res.redirect("/listings");
    }else{
        res.render("./listings/listings.ejs",{listings});
    }
}

module.exports.filterRoutes=async(req,res)=>{
    let {type}=req.params;
    let listings=await Listing.find({filter:type});
    if(!listings.length){
        req.flash("error","Sorry, no results match your filters");
        res.redirect("/listings");
    }else{
        res.render("./listings/listings.ejs",{listings});
    }
};

