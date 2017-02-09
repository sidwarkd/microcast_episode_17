var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/temperature',function(req,res){
  
  res.render('temp');
});

module.exports = router;
