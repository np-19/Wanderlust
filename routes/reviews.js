const express = require('express');
const router = express.Router({mergeParams: true});
const asyncWrap = require('../utils/asyncWrap.js');
const {reviewSchema} = require('../schema.js');
const {validate,isLoggedIn,isAuthor} = require('../middlewares/middleware.js');  //Validation middleware for listing and review
const reviewController = require('../controllers/reviews.js');


router.post('/',isLoggedIn, validate(reviewSchema), asyncWrap(reviewController.postReview))

router.delete("/:reviewId",isAuthor, asyncWrap(reviewController.deleteReview))



module.exports = router;