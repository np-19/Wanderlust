const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js');
const {listingSchema} = require('../schema.js');
const {validate,isLoggedIn,isOwner} = require('../middlewares/middleware.js'); 
const listingController = require('../controllers/listings.js');
const upload = require('../middlewares/multer.js');






router.route('/')
.get(asyncWrap(listingController.homePage))
.post(isLoggedIn,upload.single('uploaded_image'), validate(listingSchema), asyncWrap(listingController.createNewListing));






router.get('/new',isLoggedIn, listingController.renderNewForm )

router.route('/:id')
.get(asyncWrap(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('Listing[image][url]'), validate(listingSchema), asyncWrap(listingController.updateListing))
.delete(isLoggedIn,isOwner, asyncWrap(listingController.deleteListing))

router.get('/:id/edit',isLoggedIn, asyncWrap(listingController.renderEditForm))


module.exports = router;