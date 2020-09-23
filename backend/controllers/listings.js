exports.getListings = (req,res,next) => {
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
}

exports.getListingById = (req, res, next) => {
  Post.findById(req.params.id).then(
    listing => {
      if(listing){
        res.status(200).json(listing);
      }
      else{
        res.status(401).json({message: 'Listing not found!'});
      }
    }
  )
  .catch(error => {
    res.status(500).json({
      message: 'Fetching listing failed!'
    });
  });
}
