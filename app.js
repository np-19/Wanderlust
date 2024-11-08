const express = require('express');
const mongoose = require('mongoose');
const app = express();

const ejs = require('ejs');
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate)

const methodOverride = require('method-override');
const port = 8080;
const path = require('path');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))

const Listing = require('./models/listing.js')


app.listen(port,()=>{
    console.log('listening to port : ', port);
})





app.get('/', (req,res)=>{
    res.send('Go to /listings')
})

app.get('/listings', async(req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', {allListings})
})

app.get('/listings/new', async(req,res)=>{

    res.render('listings/new.ejs')
})

app.post('/listings', async(req,res)=>{
let newListing = new Listing(req.body.Listing);

await newListing.save();
res.redirect('/listings')


})



app.get('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render('listings/show.ejs', {listing})
})
app.get('/listings/:id/edit', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render('listings/edit.ejs', {listing})
})
app.put('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing})
    res.redirect(`/listings/${id}`)
})
app.delete('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect(`/listings`)
})
