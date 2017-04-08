//users_controller.js
var User = require("../models/users_model.js")
var Utils = require("../utils/utility.js")

exports.createUser = function(req, res) {

    var EmailV, phoneV, field, value

    var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email:  req.body.email,
    password: req.body.password,
    role: req.body.role,
    });


    user.save(function(err) {

      if (err) {
      var duplicateKey = 11000
      if (err.code == duplicateKey){
        return Utils.send(res, "error", "user already exists")
      }

      return Utils.db_error(res,err)
      } 

      else
      Utils.send(res,"success", "user created successfully")
      });  

}



exports.signupPage = function(req,res) {
  res.render("signup.jade", {layout:false});
}

exports.loginPage = function(req,res)
{
  res.render("login.jade", {layout: false});
}

exports.loginUser = function(req, res) {

  var query

    if(req.body.email)
    query = {'email':req.body.email}
    else if (req.body.phone)
    query = {'phone':req.body.phone}
    else if (req.body.username)
    query = {'username':req.body.username}

    if(!query)
      return Utils.send(res,"error", "required fields are empty")

    User.findOne(query, function(err, user) {
      if(err) return res.send(err);
        if(user == null) {
          Utils.send(res,"error", "invalid username/email/phone")

        } 
        else {
          auth(user)
        }
    });

    function auth( user ) {
      user.verifyPassword(req.body.password,function(err, isMatched) {
        if(err) return res.send(err)
        if (!isMatched) {
        Utils.send(res,"error","invalid password")
        }
        else {
          res.json({"username":user.username, "status":"success"})
        }
      });
    }


}

// Function to get User details when username is passed
exports.getUser = function(req,res) {
  User.findOne({username:req.params.username} , function(err, user) {
    if (err) return dbError(res, err)
    // removing password field from user object 
    user.password=undefined
    res.json(user)
  })
}

//function to update user details when username is passed
exports.updateUser = function(req,res) {
  var query = {username:req.params.username}
  var doc = { 
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    phone:req.body.phone,
      email:req.body.email,
      password:req.body.password,
    birthday:req.body.birthday,
    occupation:req.body.occupation,
    introduction:req.body.introduction,
    country:req.body.country,
    area:req.body.area,
    work:req.body.work,
    email: req.body.email}
  var options = {new:true}

  User.findOneAndUpdate(query, {$set:doc}, options, function(err, user) {

    if(err) return Utils.db_error(res,err)
    user.password=undefined
    res.json(user)

  })

  } 
    
  exports.searchByName = function(req,res) {
    var firstname = req.params.firstname;
    User.find({firstname: new RegExp("^"+firstname, 'i') }, 'firstname lastname username', function(err, result) {
      if (err) return Utils.db_error(res,err)
      return res.json(result)
    })
  }

