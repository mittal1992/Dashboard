const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Listing = require('./models/listings');

const app = express();

mongoose.connect('mongodb://localhost:27017/local')
.then(() => {
  console.log('Connection successful!');
})
.catch(() => {
  console.log('connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Request-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/listings', (req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedListings;
  const listQuery = Listing.find();
  if(pageSize && currentPage){
    listQuery
      .skip(pageSize * (currentPage + 1))
      .limit(pageSize);
  }
  listQuery.then(documents => {
    fetchedListings = documents;
    return Listing.count();
  }).then(count => {
      res.status(200).json({
      message: "listings fetched successfully!",
      listings: fetchedListings,
      maxListings: count
    });
  })
});

module.exports = app;
