const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewares.js");
const listingController=require("../controller/listing.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingController.index))//All listings route
.post(
isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)//Create listing route
);

//Create listing route
router.get("/new",isLoggedIn,listingController.createListingForm);

router
.route("/:id")
.get(wrapAsync(listingController.showIndividualListing))//Show individual listing route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.edit))//Edit  listing route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroy));//delete listing  route

//Edit  listing route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));

//search listing
router.post("/search",wrapAsync(listingController.search));

//listing filters
router.get("/filter/:type",wrapAsync(listingController.filterRoutes));

module.exports=router;