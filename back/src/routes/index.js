const express = require('express');
const router = express.Router();
import { getProducts } from './products'
import { getStatements, setStatamentStatus } from './statements'
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// Define the home page route
router.get('/products', function(req, res) {
  return getProducts(req, res)
});

router.get('/statements', function(req, res) {
  return getStatements(req, res)
});

router.put('/set/:id', function(req, res) {
  return setStatamentStatus(req, res)
});



module.exports = router;