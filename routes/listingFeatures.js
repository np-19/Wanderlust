const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');
const asyncWrap = require('../utils/asyncWrap');





router.get('/filter',async (req, res) => {
  const { categories } = req.query;
  let query = {};
  if (categories) {
    query.categories = categories;
  }
  const allListings = await Listing.find(query);
   res.json(allListings);
  
});


router.get('/', asyncWrap(async (req, res) => {  

  const { search_query } = req.query;    
  if (!search_query || search_query.trim() === '') {
    return res.redirect(req.get('referer') || '/listings');

  }
  const escapedQuery = search_query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, 'i');

    const allListings = await Listing.find({
      $or: [
        { title: { $regex: regex } },
        { location: { $regex: regex } },
        { country: { $regex: regex } }
      ]})   
      if(allListings.length === 0){
        throw new ExpressError(500,"No results found!")
      }
      if(allListings.length === 1){
        allListings[0]._id = allListings[0]._id.toString();
        return res.redirect(`/listings/${allListings[0]._id}`)
      }
   res.render('listings/index.ejs', {allListings});
}))


router.get('/search',async (req, res) => {
 const { search_query } = req.query;

  if (!search_query || search_query.trim() === '') {
    return res.json([]); // empty input, return no results
  }
  
  const escapedQuery = search_query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, 'i');

  try {
    const results = await Listing.find({
      $or: [
        { title: { $regex: regex } },
        { location: { $regex: regex } },
        { country: { $regex: regex } }
      ]
    })
    .limit(5);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;