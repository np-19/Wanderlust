const axios = require('axios');
const GeocodeApi = process.env.MAP_GEOCODE_API_KEY;
const ExpressError = require('./ExpressError');



module.exports.fetchCoordinates = async function(location){
try {
    let response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&format=geojson&apiKey=80438136ea5041009c835054d106a388`);
    return   response.data.features[0].geometry;
} catch (error) {
    throw new ExpressError(420,"Location not Found")
}
}