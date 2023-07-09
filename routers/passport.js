var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require("passport");

const {userModel} = require("../model/schema");
const secretKey = process.env.KEY;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =secretKey ;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    userModel.findOne({ _id: jwt_payload._id })
      .then((data)=>{
        if (data) {
          return done(null, data);
        }else {
            return done(null, false);
        }
      }).catch((err)=>{
        return done(err, false);
      });
}));
