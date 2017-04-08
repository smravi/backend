//user_model.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

const saltRounds = 10;


//USER SCHEMA
var userSchema = new Schema({
    username: {type: String, unique: true, required:true},
	email: {type: String, unique: true,required:true},
    password: {type:String,required:true},
    firstname: String,
    lastname: String,
    phone: String,
    dob: Date,
    occupation: String,
    address : String,
    city: String,
    state: String,
    country: String,
    profile_pic: [],
    role : { type : String, enum : [ 'survivor', 'fighter' ] },
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    scans: [{ type: Schema.Types.ObjectId, ref: 'Scan' }],
    drugs: [{ type: Schema.Types.ObjectId, ref: 'Drug' }],
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
});

// execute before each user save call
userSchema.pre('save', function(next) {
  var user=this;

  //if the password has not changed
  if (!user.isModified("password")) return next();

  // else password has changed, hash it
  bcrypt.hash(user.password, saltRounds, function(err, hash) {

    if (err) return next(err);
    // Store hash in your password DB.
    user.password = hash;
    next();
  });

});

userSchema.methods.verifyPassword = function(password, next) {

bcrypt.compare(password,this.password, function(err,isMatched)
{
  if(err) return next(err);
  next(null, isMatched);
});

}


module.exports = mongoose.model('User', userSchema);