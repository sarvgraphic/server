var _new = require('lodash');

module.exports = {

    /**
     * response formats supported
     */
    response : {

        api : {
            success : function (data, totalCount, offset, limit) {
                var successObj = {};
                var diff = process.hrtime(sails.config._time.responseTimeStart);
                var responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
                if ( _new.isArray(data) ) {
                    successObj = {
                        metadata : {
                            count : totalCount || data.length,
                            offset : offset || 0,
                            limit : limit || 30,
                            responseTime : responseTimeMs + ' Milli Seconds'
                        },
                        result : true,
                        data : data || []
                    };
                } else {
                    successObj = {
                        metadata : {
                            responseTime : responseTimeMs + ' Milli Seconds'
                        },
                        result : true,
                        data : data || {}
                    };
                }

                return successObj;
            },

            error : function(errorKey, debug) {
                if ( _new.isObject(sails.config.app.errors[errorKey]) ) {
                    return app.response.api._prepareError(
                        _new.extend(
                            sails.config.app.errors[errorKey],
                            {
                                debug : debug
                            }
                        )
                    );
                } else {

                    return app.response.api._prepareError(errorKey);
                }
            },

            _prepareError : function (error) {
                var errorObj = {};
                var rowErrorParam = _new.clone(error);
                if ( _new.isObject(error) ) {
                    errorObj = {
                        status: error.status || 500,
                        code: error.code || null,
                        message: error.message || null,
                        description: error.description || null,
                        debug: error.debug || {}
                    };

                    if ( error.errors && error.errors.length ) {
                        errorObj.errors = error.errors;
                    }

                } else {
                    errorObj = _new.extend(
                        sails.config.app.errors.invalid_error_object,
                        {
                            debug : {
                                file: "/api/services/app.js",
                                nativeErrorParameter: rowErrorParam
                            }
                        }
                    );
                }


                if ( _new.includes && ! _new.includes(['silly', 'verbose', 'info', 'debug'], sails.config.log.level) ) {
                    delete errorObj.debug;
                }

                errorObj.result = false;
                var diff = process.hrtime(sails.config._time.responseTimeStart);
                var responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
                errorObj.responseTime = responseTimeMs + ' Milli Seconds';
                return errorObj;

            }
        }

    }
    // -----------------------------------------
};