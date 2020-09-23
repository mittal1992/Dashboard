const express = require('express');

const router = express.Router();

const ListController = require('../controllers/listings');

router.get('', ListController.getListings);

router.get('/:id', ListController.getListingById);

module.export = router;
