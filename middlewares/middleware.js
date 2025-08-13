const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');




//schema validation middleware
module.exports.validate = (schema) => {
    return (req, res, next) => {
    let result = schema.validate(req.body);  
    let {error} = result;

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
    
}
}

//login check middleware
module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //to redirect to the original url
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login') // return so that code after if is not executed

    }
    next();

}

module.exports.saveRedirectUrl = (req, res, next) => { 
        if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next()
 }

 module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){ //without populate, in owner only id is stored
    // if(!listing.owner._id.equals(res.locals.currentUser._id)){ //with populate
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/listings/${id}`)

    }
    next()

}
 module.exports.isAuthor = async (req, res, next) => {
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)){ //without populate, in owner only id is stored
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/listings/${id}`)

    }
    next()

}