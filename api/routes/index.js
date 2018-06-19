var express = require('express');
var router = express.Router();
var CtrlHotels = require("../controllers/hotels.controllers.js");
var CtrlReviews = require("../controllers/reviews.controllers.js");

router
.route('/hotels')
.get(CtrlHotels.hotelsGetAll);

router
.route('/hotels/:hotelId')
.get(CtrlHotels.hotelsGetOne);

router
.route('/hotels/new')
.post(CtrlHotels.hotelsAddOne);


// review routes

router
.route('/hotels/:hotelId/reviews')
.get(CtrlReviews.reviewsGetAll);
//
router
.route('/hotels/:hotelId/reviews/:reviewId')
.get(CtrlReviews.reviewsGetOne);

module.exports = router;