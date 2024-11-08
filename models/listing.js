const mongoose = require('mongoose');

main().then(()=>{
  console.log('connected to DB')
})
.catch((err)=>{
    console.log(err)
})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
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
    price : Number,
    location : String,
    country : String,
  });

  const Listing = mongoose.model('Listing', listingSchema);

  module.exports = Listing;
