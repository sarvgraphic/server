var validator = require('validator');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var SkipperDisk = require('skipper-disk');
var fileAdapter = SkipperDisk({});
var moment = require('moment');

var _new = require('lodash');

module.exports = {
    
    existUserName: function(req, res){
        var theAllParams = req.allParams();
        var condition = {username: theAllParams.username};
        UserService.find(condition).then(function(resp){
            if(_new.size(resp) > 0){
                return res.ok(app.response.api.success(resp,0,0,0));
            } else {
                return res.ok(app.response.api.success([],0,0,0));
            }
        }).catch(function(err){
            res.ok(app.response.api.error(err));
        });
    },

    existEmail: function(req, res){
        var theAllParams = req.allParams();
        console.log("test", theAllParams)
        var condition = {email: theAllParams.email};
        UserService.find(condition).then(function(resp){
            if(_new.size(resp) > 0){
                return res.ok(app.response.api.success(resp,0,0,0));
            } else {
                return res.ok(app.response.api.success([],0,0,0));
            }
        }).catch(function(err){
            res.ok(app.response.api.error(err));
        });
    },

    /**
     * user signup
     *
     * @param option = { username, email, password, ... }
     * @returns {*}
     */
    signUp : function (req, res) {
        var theAllParams = req.allParams();
        var theData = {
            email : theAllParams.email,
            password : theAllParams.password,
            isActive : theAllParams.isActive || true,
            isExpired : theAllParams.isExpired || false,
            isBanned : theAllParams.isBanned || false
        };
        
        if(!theAllParams.email || !theAllParams.password){
            return res.ok(
                app.response.api.error(
                    "this method is available only with POST method and valid 'firstname', 'lastname', 'username', 'email', 'password', 'cellphoneList', 'addressList', 'companyName', 'userType', 'entityCollection' and 'entityId' fields."
                )
            );
        } else {
            async.auto({
                createUser: function(cb){
                    UserService.create(theData).then(function(resp){
                        cb(null, resp);
                    }).catch(function(err){
                        cb(err);
                    });
                },
                createPassport: ['createUser', function(cb, result){
                    var token = crypto.randomBytes(48).toString('base64');
                    var passportObj = {
                        protocol : 'local',
                        password : theData.password,
                        user : result.createUser.id,
                        accessToken: {}
                    };
                    passportObj.accessToken[theAllParams.scope] = token;
                    passport.create(passportObj).then(function(){
                        cb(null, token);
                    }).catch(function(err){
                        cb(err);
                    });
                }]
            }, function(errors, results){
                if(errors != null){
                    res.ok(app.response.api.error(errors));
                } else {
                    res.ok(app.response.api.success({
                        user: results.createUser,
                        token: results.createPassport
                    }));
                }
            });
            
        }
    },

    findUser : function (req, res) {
        var theAllParams = req.allParams();

        sails.log("theAllParams 1111:: ", theAllParams);

        var condition = _.pick(theAllParams, ["skip", "limit", "username", "firstname", "lastname", "email"]);

        if(theAllParams.isActive !== undefined){
            condition.isActive = String(theAllParams.isActive) == "true";
        }

        if(theAllParams.isAdmin !== undefined){
            condition.isAdmin = String(theAllParams.isAdmin) == "true";
        }

        sails.log(condition)
        User.findAndCount(condition).then(function (resp) {
            return res.ok(app.response.api.success(resp.list, resp.total, theAllParams.skip, theAllParams.limit));
        }).catch(function (err) {
            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/UserController.js",
                parameter : {
                    debugParameter : "test debug parameter",
                    errors : err
                }

            }));
        })

    },

    findOneUser : function (req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.userId){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {

            var condition = _.pick(theAllParams, ["id", "username", "email"]);
            sails.log("find one condition :: ", condition);
            User.findOne(condition).exec(function (err, resp) {
                theResponse = app.response.api.success(resp);
                res.ok(theResponse);
            })
        }
    },

    updateOneUser : function (req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.userId){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {

            if (String(theAllParams.removeFile) == "true") {
                util.deleteFile(theAllParams.user.imgAvatarFileDescriptor);
                theAllParams.user.imgAvatarFileDescriptor = null;
                theAllParams.user.imgAvatar = null;
            }
            
            
            var userId = theAllParams.userId;
            var userObj = theAllParams.user;
            var password = theAllParams.password;

            async.auto({
                updateUser: function(cb){
                    UserService.update(userId, userObj).then(function(resp){
                        cb(null, resp);
                    }).catch(function(err){
                        cb(err);
                    });
                },
                updatePassport: ['updateUser', function(cb, result){
                    if(password && password != undefined){
                        UserService.updatePassword(userId, password).then(function(){
                            cb(null, true);
                        }).catch(function(err){
                            cb(err);
                        });
                    } else {
                        cb(null, true);
                    }
                }]
            }, function(errors, results){
                if(errors != null){
                    theResponse = app.response.api.error('missing_parameter',
                        {
                            file: "/api/controllers/UserController.js"
                        });
                    return res.ok(theResponse);
                } else {
                    theResponse = app.response.api.success(results.updateUser);
                    res.ok(theResponse);
                }
            });
        }
    },

    createUser : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams);
        var theData = {
            firstname : theAllParams.user.firstname,
            lastname : theAllParams.user.lastname,
            username : theAllParams.user.username,
            email : theAllParams.user.email,
            phone : theAllParams.user.phone,
            billingAddress : theAllParams.user.billingAddress,
            setting : theAllParams.user.setting,
            isActive : theAllParams.user.isActive,
            isBanned : theAllParams.user.isBanned,
            isAdmin : theAllParams.user.isAdmin
        };

        sails.log("theData :: ", theData);

        if(!theAllParams.user.email || !theAllParams.user.username || !theAllParams.user.password){
            return res.ok(app.response.api.error("missing_parameter"));
        } else {
            async.auto({
                createUser: function(cb){
                    UserService.create(theData).then(function(resp){
                        cb(null, resp);
                    }).catch(function(err){
                        cb(err);
                    });
                },
                createPassport: ['createUser', function(cb, result){
                    var passportObj = {
                        protocol : 'local',
                        password : theAllParams.user.password,
                        user : result.createUser.id
                    };
                    passport.create(passportObj).then(function(){
                        cb(null, true);
                    }).catch(function(err){
                        cb(err);
                    });
                }]
            }, function(error, results){
                if(error != null){
                    return res.ok(app.response.api.error(error));
                } else {
                    return res.ok(app.response.api.success(results.createUser));
                }
            });

        }
    },
    
    deleteUser : function (req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {
            UserService.deleteUser(theAllParams.id).then(function (resp) {
                theResponse = app.response.api.success(resp);
                res.ok(theResponse);
            }).catch(function (err) {
                theResponse = app.response.api.error('server_error',
                    {
                        file: "/api/controllers/UserController.js"
                    });
                return res.ok(theResponse);
            })
        }
    },
        
    /**
     * user login
     *
     * @param option = { identifier, password }
     * @returns {*}
     */
    login : function (req, res) {
        sails.log("headers :: ", req.headers.scope)
        var theAllParams = req.allParams();
        var theIdentifier = theAllParams.identifier;
        var thePassword = theAllParams.password;
        var scope = req.headers.scope;
        sails.log("theAllParams :: ", theAllParams);
        if (!theIdentifier && !thePassword && !scope) {
            return res.ok(app.response.api.error("missing_parameter"));
        }
        UserService.login.loginProcess(scope, theIdentifier, thePassword).then(function (loginResp) {
            return res.ok(app.response.api.success(loginResp));
        }).catch(function (loginError) {
            return res.ok(app.response.api.error(loginError));
        })
    },



    logout : function (req, res) {
        var theAllParams = req.allParams();
        console.log("logout theAllParams :: ", theAllParams)
        Passport.update({protocol : 'local', user : theAllParams.userId}, {accessToken : null},
            function (err, passport) {

                console.log("logout err or result :: ", err, passport)

                if (err) {
                    return res.ok(app.response.api.error(err));
                } else {
                    return res.ok(app.response.api.success(passport));
                }
            }
        );
    },


    
    /**
     * upload user avatar
     */
    uploadAvatar : function (req, res) {

        var theAllParams = req.allParams();
        var theUserId = theAllParams.userId;

        // res.setTimeout(0);

        if (req.method == 'POST' && theUserId) {

            var avatarName;
            
            if (req.file('avatar')) {

                req.file('avatar').upload({
                    // don't allow the total upload size to exceed ~5MB
                    maxBytes : 5000000,
                    dirname : "../../uploads/users/avatars",
                    saveAs : function (__newFileStream, cb) {
                        var reExt = /(?:\.([^.]+))?$/;
                        var ext = reExt.exec(__newFileStream.filename)[1];
                        if (ext && ( _.include(['jpg', 'png', 'gif'], ext) )) {
                            avatarName = theUserId + '.' + ext;
                            cb(null, avatarName);
                        } else {
                            return res.ok(
                                app.response.api.error(
                                    "invalid image file extention"
                                )
                            );
                        }
                    }
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        return res.ok(app.response.api.error(err));
                    }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.ok(
                            app.response.api.error(
                                'file was not uploaded'
                            )
                        );
                    }

                    // Save the "fd" and the url where the avatar for a user can be accessed
                    User.update(theUserId,
                        {
                            imgAvatar : avatarName,
                            imgAvatarFileDescriptor : uploadedFiles[0].fd
                        })
                        .exec(function (err) {
                            if (err) {
                                return res.ok(app.response.api.error(err));
                            }
                            return res.ok(app.response.api.success(avatarName));
                        });
                });


            } else {
                return res.ok(
                    app.response.api.error(
                        "field 'avatar' is not a valid file field."
                    )
                );
            }

        } else {
            return res.ok(
                app.response.api.error(
                    "this method is available only with POST method and valid 'userId' and 'avatar'. notice that 'avatar' is a file field."
                )
            );
        }

    },


    avatar : function (req, res) {

        var theAllParams = req.allParams();
        var theUserId = theAllParams.userId;
        // @TODO : cache avatars

        if (req.method == 'GET' && theUserId) {

            User.findOne(theUserId)
                .exec(function (err, userRow) {
                    if (err) {
                        return res.ok(app.response.api.error(err));
                    }

                    var avatarFd = userRow && userRow.imgAvatarFileDescriptor;

                    if (avatarFd) {
                        // Stream the file down
                        fileAdapter.read(avatarFd)
                            .on('error', function (err) {
                                return res.ok(app.response.api.error(err));
                            })
                            .pipe(res);
                    } else {
                        return res.ok(
                            app.response.api.error(
                                "invalid file descriptor field."
                            )
                        );
                    }

                });

        } else {
            return res.ok(
                app.response.api.error(
                    "this method is available only with GET method and valid 'userId' field."
                )
            );
        }

    },

    /**
     * user change password
     *
     * @param option = { password, newPassword }
     * @returns {*}
     */
    changePassword : function (req, res) {
        var theAllParams = req.allParams();
        var theUserId = theAllParams.userId;
        var theNewPassword = theAllParams.newPassword;
        var theOldPassword = theAllParams.oldPassword;

        if (!theNewPassword && !theOldPassword && !theUserId) {
            return res.ok(app.response.api.error("missing_parameter"));
        } else {
            async.auto({
                getRecord : function (callback) {
                    Passport.findOne({
                        user : theUserId
                    }, function (err, passportRecord) {

                        if (err) {
                            callback(err);
                        }

                        if (!passportRecord) {
                            callback("user not found");
                        }

                        callback(null, passportRecord);

                    });
                },
                getHashOfOldPassword : ['getRecord', function (callback, result) {


                    bcrypt.compare(theOldPassword, result.getRecord.password, function (err, res) {

                        if (err) {
                            callback(err);
                        }

                        if (res) {
                            callback(null, result.getRecord.password);
                        } else {
                            callback("password_error");
                        }
                    });
                }]
            }, function (err, results) {

                if (err) {
                    return res.ok(app.response.api.error( err, {
                        file: "/api/controllers/ImageCollectionController.js",
                        parameter : {
                            debugParameter : "",
                            errors : err
                        }
                    }));
                }
                Passport.update(
                    {
                        id : results.getRecord.id
                    },
                    {
                        password : theNewPassword
                    }).exec(
                    function (err, updatedPassport) {

                        if (err) {
                            return res.ok(
                                app.response.error(err)
                            );
                        }

                        if (_.size(updatedPassport)) {
                            return res.ok(app.response.api.success(true));
                        } else {
                            return res.ok(
                                app.response.api.error(
                                    "the criteria not match with user"
                                )
                            );
                        }
                    });

            });
        }
        
    }
};