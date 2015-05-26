var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

// user schema
var userSchema = new mongoose.Schema({
                  email: {
                    type: String,
                    lowercase: true,
                    required: true,
                    index: {
                      unique: true
                    }
                  },
                  username: {
          					type: String,
          					required: true,
          					index: {
          					  unique: true
          					}		
          				},
                  passwordDigest: {
                    type: String,
                    required: true
                  }, 
                  albums: {
                    type: Array,                     
                  }                                   
				
                });


var confirm = function (pswrd, pswrdCon) {
  return pswrd === pswrdCon;
};

userSchema.statics.createSecure = function (params, cb) {
  var isConfirmed;

  isConfirmed = confirm(params.password, params.password_confirmation);

  if (!isConfirmed) {
    return cb("Passwords Should Match", null);
  }

  var that = this;

  // hashing and salting 
  bcrypt.hash(params.password, 12, function (err, hash) {
    params.passwordDigest = hash;
    that.create(params, cb);
  });

};

userSchema.statics.authenticate = function (params, cb) {
  this.findOne({
      email: params.email
    },
    function (err, user) {
      user.checkPswrd(params.password, cb);
    });
};

userSchema.methods.checkPswrd = function(password, cb) {
  var user = this;
  bcrypt.compare(password, 
  this.passwordDigest, function (err, isMatch) {
    if (isMatch) {
      cb(null, user);
    } else {
      cb("OOPS", null);
    }
  });
};



var User = mongoose.model("User", userSchema);

module.exports = User;



