var express = require('express');
var router = express.Router();
var CtrlHotels = require("../controllers/hotels.controllers.js");
var CtrlReviews = require("../controllers/reviews.controllers.js");

router
.route('/hotels')
.get(CtrlHotels.hotelsGetAll)
.post(CtrlHotels.hotelsAddOne);

router
.route('/hotels/:hotelId')
.get(CtrlHotels.hotelsGetOne)
.put(CtrlHotels.hotelsUpdateOne)
.delete(CtrlHotels.hotelsDeleteOne);



// review routes

router
.route('/hotels/:hotelId/reviews')
.get(CtrlReviews.reviewsGetAll)
.post(CtrlReviews.reviewsAddOne);
//
router
.route('/hotels/:hotelId/reviews/:reviewId')
.get(CtrlReviews.reviewsGetOne)
.put(CtrlReviews.reviewsUpdateOne)
.delete(CtrlReviews.reviewsDeleteOne);

module.exports = router;