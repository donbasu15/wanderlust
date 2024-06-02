const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync=require("../utility/wrapAsync.js");
const {isLoggedIn,validationReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

//POST a review
router.post("/",isLoggedIn,validationReview,wrapAsync(reviewController.newReview))
//Delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;