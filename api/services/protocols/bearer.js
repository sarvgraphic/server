/*
 * Bearer Authentication Protocol
 *
 * Bearer Authentication is for authorizing API requests. Once
 * a user is created, a token is also generated for that user
 * in its passport. This token can be used to authenticate
 * API requests.
 *
 */

exports.authorize = function (token, done) {
    Passport.findOne({accessToken : token}, function (err, passport) {

        if (err) {
            return done({'message' : 'there is a problem with access_token field in find process'});
        }

        if (!passport) {
            return done({'message' : 'access_token field not found'});
        }

        User.findOneById(passport.user, function (err, user) {
            if (err) {
                return done({'message' : 'there is a problem about user catch in find process'});
            }

            if (!user) {
                return done({'message' : 'user not found'});
            }

            user.accessToken = token;
            done(null, user, {scope : 'all'});
        });
    });

};
