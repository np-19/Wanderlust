const mongoose = require('mongoose');
const initData = require('./data.js')
const Listing = require('../models/listing.js')

const dbUrl = `mongodb+srv://np19:np%401902@cluster0.cggtkpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
console.log(dbUrl)



const {fetchCoordinates} = require('../utils/locationFetch.js');


main().then(()=>{
  console.log('connected to DB')
})
.catch((err)=>{
    console.log(err)
})



async function main() {
    await mongoose.connect(`${process.env.ATLASDB_URL}`);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  

  }
   
  async function update(data) {
    for (const listing of data) {
      let address = listing.location + ',' + listing.country;
      console.log(address);
      
      let geometry = await fetchCoordinates(address);    //fetch coordinates
      listing.geometry = geometry;
    }
    
  }
  



  const initDB = async () => {
     await Listing.deleteMany({})
     initData.data = initData.data.map((obj)=>  ({...obj,owner:"688df5cd12a3c94768734495"}))
     await update(initData.data);
     await Listing.insertMany(initData.data)
     console.log('data initialised');
     mongoose.connection.close();
  }

 

  initDB();
  



  