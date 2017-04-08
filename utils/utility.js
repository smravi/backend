var User = require("./../models/users_model.js")

var db_error = function (res, err) {
      return res.json({status:"error", message:"error during database transaction execution", database_err: err})
}

var send = function (res, status, message) {
	return res.json({status:status, message:message})
}

var isUnique = function (type, value, callback) {
  var query;

  if (type == "email") {
    query = {'email':value}
  }
  if (type == "phone") {
    query = {'phone':value}
  }
  User.findOne(query,  function(err, result) {
    if (err) return callback(err);
    else
    {
    return callback(err,result)
    }
  })

}

module.exports.db_error = db_error
module.exports.send = send
module.exports.isUnique = isUnique
