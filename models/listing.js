const mongoose = require('mongoose');
const Review = require('./review');
 let Schema = mongoose.Schema;
 
 const listingSchema = new Schema({
    title : {
        type:String,
        required: true
    },
    description : String,
    image : {
        filename : String,
       url : {
        type: String,
       default: '',
       set : (v) => v == '' ? 'https://a0.muscache.com/im/pictures/4ac2fa8a-7fe5-47e5-beb3-3df2823f2734.jpg' : v,
       },
    },
    price : {
      type: Number,
      min: 0
    },
    location : String,
    country : String,
    reviews : [{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    geometry: {
      type:{
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    categories: {
      type: [String],
      enum: ['Trending', 'Rooms', 'Iconic Cities', 'Arctic','Mountains','Castles', 'Beaches', 'Farms', 'Countryside'],
    } 
  });




  listingSchema.post('findOneAndDelete', async(listing) => {
    if(!listing) return;
    if(listing.reviews.length){
      await Review.deleteMany({_id : {$in : listing.reviews}});
    }
  })

  const Listing = mongoose.model('Listing', listingSchema);

  module.exports = Listing;
