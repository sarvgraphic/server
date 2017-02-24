/**
 * bearerAuth Policy
 *
 * Policy for authorizing API requests. The request is authenticated if the
 * it contains the accessToken in header, body or as a query param.
 * Unlike other strategies bearer doesn't require a session.
 * Add this policy (in config/policies.js) to controller actions which are not
 * accessed through a session. For example: API request from another client
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */

sails.config._time = {
    responseTimeStart : process.hrtime()
};

module.exports = function (req, res, next) {

    var accessToken = req.headers['X-Access-Token'];

    if ( !accessToken ) {
        return res.ok(app.response.api.error('invalid token'));
    } else {

        var entityKey = req.headers.entityKey || 'frontend';

        // @TODO : need to check session

        var condition = {};
        condition.accessToken[entityKey] = accessToken;

        Passport.findOne(condition).exec(function (err, passportObj) {

            if (err || !passportObj) {
                return res.ok(app.response.api.error('invalid token'));
            } else {

                condition = {
                    id: passportObj.user
                };
                User.find(condition).exec(function (err, userObj) {
                    if (err || !userObj) {
                        return res.ok(app.response.api.error('invalid token'));
                    } else {
                        req.user = userObj;
                        var diff = process.hrtime(sails.config._time.responseTimeStart);
                        var policyPassTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
                        sails.config._time.policyTimeMs = {
                            'tokenAuth' : policyPassTimeMs
                        };
                        sails.log.info('time spends:',sails.config._time);
                        return next();
                    }
                });
            }
        });
    }
};
