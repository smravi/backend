//index.js
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    router = express.Router(),
    corser = require('corser'),
    userController = require('./controllers/user_controller')


var port = 8086;

mongoose.connect('mongodb://localhost:27017/bestrong');

//configure app
{
  app.set('views', __dirname + '/views')
  app.set('view_options', {layout : false})

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  // parse application/json
  app.use(bodyParser.json())

  // the way to provide static contents
  //app.use("/assets", express.static(__dirname + '/assets'))

  // all the API's would be pre-fixed with /api/0.1 where 0.1 is its version number
  app.use('/api/0.1', router);

}

router.use(corser.create());

//app.<REQUEST_METHOD>(<REQUEST_URI>, <CONTROLLER_METHOD>)
// Signup and login requests
router.get('/users/create', userController.signupPage)
router.post('/users/create', userController.createUser)
router.get('/users/login', userController.loginPage)
router.post('/users/login', userController.loginUser)


app.listen(port);


console.log("Base Server started at "  + port);