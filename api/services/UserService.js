var _new = require('lodash');
var ObjectId = require('mongodb').ObjectID;
var validator = require('validator');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
module.exports = {
    find: function(condition){
        return new Promise(function(resolve, reject){
            User.find(condition).exec(function(err, user){
                console.log(err, user)
                if(err){
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    },
    
    create: function(createObj){
        return new Promise(function(resolve, reject){
            User.create(createObj).exec(function(err, user){
                if(err){
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    },
    
    deleteUser : function (userId) {
        return new Promise(function (resolve, reject) {
            User.destroy({id : userId}).exec(function (err, resp) {
                if(err){
                    reject(err);
                } else {
                    resolve(resp);
                }
            })
        });
    },

    update : function (userId, userObj) {
        return new Promise(function (resolve, reject) {
            User.update({id : userId}, userObj).exec(function (err, resp) {
                if(err){
                    reject(err);
                } else {
                    resolve(resp);
                }
            })
        });
    },

    updatePassword : function (userId, password) {
        return new Promise(function (resolve, reject) {
            Passport.update({user : userId}, {password : password}).exec(function (err, resp) {
                if(err){
                    reject(err);
                } else {
                    resolve(resp);
                }
            })
        });
    },

    login : {
        /**
         * use all login service and after all processes return user object
         * @param scope
         * @param identifier
         * @param password
         * @returns {Promise}
         */
        loginProcess : function (scope, identifier, password) {
            return new Promise(function (resolve, reject) {
                async.auto({
                    // checkEntityStatus : function (callback) {
                    //     UserService.login.checkEntityStatus(scope).then(function (resp) {
                    //         callback(null, resp);
                    //     }).catch(function (err) {
                    //         reject(err);
                    //     })
                    // },
                    findUser : function (cb) {
                        UserService.login.findUser(identifier).then(function (resp) {
                            cb(null, resp);
                        }).catch(function (err) {
                            reject(err);
                        })
                    },
                    checkUserStatus : ['findUser', function (cb, result) {
                        UserService.login.checkUserStatus(result.findUser, scope).then(function (resp) {
                            cb(null, resp);
                        }).catch(function (err) {
                            reject(err);
                        })
                    }],
                    createTokenId : ['checkUserStatus', function (cb) {
                        UserService.login.createTokenId().then(function (resp) {
                            cb(null, resp);
                        })
                    }],
                    updateTokenIdInPassport : ['createTokenId', 'findUser', function (cb, result) {
                        UserService.login.updateTokenIdInPassport(result.findUser.id, password, result.createTokenId, scope).then(function (resp) {
                            cb(null, resp);
                        }).catch(function (err) {
                            reject(err);
                        })
                    }]
                    // checkUserInEntity : ['updateTokenIdInPassport', function (callback, result) {
                    //     UserService.login.checkUserInEntity(theEntity, entityId, result.findUser.id).then(function (checkUserEntityResp) {
                    //         callback(null, checkUserEntityResp);
                    //     }).catch(function (checkUserEntityError) {
                    //         reject(checkUserEntityError);
                    //     })
                    // }],
                    // updateSocketInUser : ['checkUserInEntity', function (callback, result) {
                    //     UserService.login.updateSocketInUser(result.findUser.id, socket).then(function (updateSocketResp) {
                    //         callback(null, updateSocketResp);
                    //     }).catch(function (updateSocketError) {
                    //         reject(updateSocketError);
                    //     })
                    // }],
                    // completeUserObj : ['updateSocketInUser', function (callback, result) {
                    //     UserService.login.completeUserObj(result.findUser.id, result.createTokenId, theEntity, result.updateSocketInUser.userObj, result.checkUserInEntity).then(function (completeUserResp) {
                    //         callback(null, completeUserResp);
                    //     }).catch(function (completeUserError) {
                    //         reject(completeUserError);
                    //     })
                    // }],
                    // setSocketToUserRoom : ['completeUserObj', function (callback, result) {
                    //     UserService.login.setSocketToUserRoom(result.findUser, socket).then(function (setSocketResp) {
                    //         callback(null, setSocketResp);
                    //     }).catch(function (setSocketError) {
                    //         reject(setSocketError);
                    //     })
                    // }]
                },function (error, results) {
                    if(error != null){
                        reject(error);
                    } else {
                        results.findUser.token = results.createTokenId;
                        resolve(results.findUser);
                    }
                    // if(!error && results.setSocketToUserRoom && results.completeUserObj){
                    //     resolve(results.completeUserObj);
                    // }else{
                    // if(error){
                    //     reject(error)
                    // }else{
                    //     reject("something is wrong with login process.");
                    // }
                    // }
                })
            })
        },



        /**
         * check entity status synchronize. first check admin then if login is
         * from vendor admin it checks vendor and if login becomes retailer admin
         * it checks retailer and final checks retailer connection with vendor and
         * if every entity are active it will return true
         * @param theEntity
         * @param theEntityId
         * @param adminId
         * @param vendorId
         * @returns {Promise}
         */
        // checkEntityStatus : function (theEntity, theEntityId, adminId, vendorId) {
        //     return new Promise(function (resolve, reject) {
        //         async.auto({
        //             checkAdmin : function (callback) {
        //                 if(theEntity == "admin"){
        //                     adminId = theEntityId;
        //                 }
        //                 sails.models['admin'].native(function (err, collection) {
        //                     collection.find(
        //                         {
        //                             _id: new require('mongodb').ObjectID(adminId),
        //                             isActive: true
        //                         }
        //                     ).toArray(function(err, collection){
        //                         // console.log(collection)
        //                         if(err){
        //                             reject(err);
        //                         }
        //                         if(collection.length == 0){
        //                             reject("admin is inactive");
        //                         }else{
        //                             if(collection[0].isBanned){
        //                                 reject("admin is banned");
        //                             }else if(collection[0].isExpired){
        //                                 reject("admin is expired");
        //                             }else{
        //                                 if(theEntity == "admin"){
        //                                     resolve(true);
        //                                 }else{
        //                                     callback(null, true);
        //                                 }
        //                             }
        //                         }
        //                     })
        //                 })
        //             },
        //             checkVendor : ['checkAdmin', function (callback, result) {
        //                 if(result.checkAdmin){
        //                     if(theEntity == "vendor"){
        //                         vendorId = theEntityId;
        //                     }
        //                     sails.models['vendor'].native(function (err, collection) {
        //                         collection.find(
        //                             {
        //                                 _id: new require('mongodb').ObjectID(vendorId),
        //                                 isActive: true
        //                             }
        //                         ).toArray(function(err, collection){
        //                             if(err){
        //                                 reject(err);
        //                             }
        //                             if(collection.length == 0){
        //                                 reject("vendor is inactive");
        //                             }else{
        //                                 if(collection[0].isBanned){
        //                                     reject("vendor is banned");
        //                                 }else if(collection[0].isExpired){
        //                                     reject("vendor is expired");
        //                                 }else{
        //                                     if(theEntity == "vendor"){
        //                                         resolve(true);
        //                                     }else{
        //                                         callback(null, true);
        //                                     }
        //                                 }
        //                             }
        //                         })
        //                     })
        //                 }else{
        //                     reject("unknown error");
        //                 }
        //             }],
        //             checkRetailer : ['checkVendor', function (callback, result) {
        //                 if(result.checkVendor){
        //                     sails.models[theEntity].native(function (err, collection) {
        //                         collection.find(
        //                             {
        //                                 _id: new require('mongodb').ObjectID(theEntityId),
        //                                 isActive: true
        //                             }
        //                         ).toArray(function(err, collection){
        //                             if(err){
        //                                 reject(err);
        //                             }
        //                             if(collection.length == 0){
        //                                 reject("retailer is inactive");
        //                             }else{
        //                                 if(collection[0].isBanned){
        //                                     reject("retailer is banned");
        //                                 }else if(collection[0].isExpired){
        //                                     reject("retailer is expired");
        //                                 }else{
        //                                     sails.models['vendor'].native(function (err, collection) {
        //                                         collection.find(
        //                                             {
        //                                                 _id : new require('mongodb').ObjectID(vendorId)
        //                                             },
        //                                             {
        //                                                 retailers : {
        //                                                     $elemMatch : {
        //                                                         id : new require('mongodb').ObjectID(theEntityId)
        //                                                     }
        //                                                 }
        //                                             }
        //                                         ).toArray(function (err, entityRetailer) {
        //                                             if (err) {
        //                                                 reject(err);
        //                                             }
        //                                             if (entityRetailer[0] && _.size(entityRetailer[0].retailers)) {
        //                                                 if (entityRetailer[0].retailers[0].isActive) {
        //                                                     if (entityRetailer[0].retailers[0].isBanned) {
        //                                                         reject(theEntity + " is banned in this vendor");
        //                                                     }else if(entityRetailer[0].retailers[0].isExpired) {
        //                                                         reject(theEntity + " is expired in this vendor");
        //                                                     } else {
        //                                                         resolve(true);
        //                                                     }
        //                                                 } else {
        //                                                     reject(theEntity + " is inactive in this vendor");
        //                                                 }
        //                                             } else {
        //                                                 reject("this " + theEntity + "is not member of this vendor. please register first.");
        //                                             }
        //                                         });
        //                                     });
        //                                 }
        //                             }
        //                         })
        //                     })
        //                 }else{
        //                     reject("unknown error");
        //                 }
        //             }]
        //         },function (err, results) {})
        //     })
        // },

        /**
         * get the identifier (email or username) and return user object
         * @param theIdentifier
         * @returns user object
         */
        findUser : function (theIdentifier) {

            return new Promise(function (resolve, reject) {
                var isEmail = validator.isEmail(theIdentifier);
                var query = {};
                if (isEmail) {
                    query.email = theIdentifier;
                } else {
                    query.username = theIdentifier;
                }
                User.findOne(query, function (err, user) {
                    if (err) {
                        reject(err);
                    }
                    if (user) {
                        resolve(user);
                    } else {
                        if (isEmail) {
                            reject("identifier_password_error");
                        } else {
                            reject("identifier_password_error");
                        }

                    }

                });
            })
        },

        /**
         * get user object and check user banned and active status. if user is banned or inactive,
         * it will return a related text, else it will return true
         * if scope is 'backend' function check isAdmin status
         * @param userObj
         * @param scope
         * @returns {Promise}
         */
        checkUserStatus : function (userObj, scope) {
            return new Promise(function (resolve, reject) {
                if(userObj.isActive){
                    if(userObj.isBanned){
                        reject("banned_user_error");
                    }else{
                        if(scope === "backend"){
                            if(userObj.isAdmin){
                                resolve(true);
                            } else {
                                reject("access_panel_error")
                            }
                        } else {
                            resolve(true);
                        }
                    }
                }else{
                    reject("active_user_error");
                }
            })
        },

        /**
         * create token string
         * @returns cretaed token
         */
        createTokenId : function () {
            return new Promise(function (resolve) {
                var token = crypto.randomBytes(48).toString('base64');
                resolve(token);
            })
        },

        /**
         * update token in passport
         * @param userId
         * @param thePassword
         * @param token
         * @returns {Promise}
         */
        updateTokenIdInPassport : function (userId, thePassword, token, scope) {
            return new Promise(function (resolve, reject) {
                var tokenId = token;
                var accessToken = {};
                accessToken[scope] = token;
                
                Passport.update(
                    {protocol : 'local', user : userId},
                    {accessToken : accessToken},
                    function (err, passport) {
                        passport = passport[0];
                        if (passport) {
                            tokenId = passport.accessToken;
                            passport.validatePassword(thePassword, function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                if (!result) {
                                    reject("identifier_password_error");
                                } else {
                                    resolve(true);
                                }
                            });
                        } else {
                            reject("identifier_password_error");
                        }
                    });
            })
        },

        /**
         * check user in entity and if user exists in entity return user connect object in entity
         * @param theEntity type: string
         * @param theEntityId type: string
         * @param userId type: string
         * @returns user connect object
         */
        // checkUserInEntity : function (theEntity, theEntityId, userId) {
        //     return new Promise(function (resolve, reject) {
        //         sails.models[theEntity].native(function (err, collection) {
        //             collection.find(
        //                 {
        //                     _id : new require('mongodb').ObjectID(theEntityId)
        //                 },
        //                 {
        //                     users : {
        //                         $elemMatch : {
        //                             id : new require('mongodb').ObjectID(userId)
        //                         }
        //                     }
        //                 }
        //             ).toArray(function (err, entityUser) {
        //                 if (err) {
        //                     reject(err);
        //                 }
        //                 if (entityUser[0] && _.size(entityUser[0].users)) {
        //                     if (entityUser[0].users[0].isActive) {
        //                         if (entityUser[0].users[0].isBanned) {
        //                             reject("User is banned in this " + theEntity);
        //                         } else {
        //                             resolve(entityUser[0].users[0]);
        //                         }
        //                     } else {
        //                         reject("User is inactive in this " + theEntity);
        //                     }
        //                 } else {
        //                     reject("you are not member of this " + theEntity + ". please register first.");
        //                 }
        //             });
        //         });
        //     })
        // },

        /**
         * update socketId field in user model and return user updated object
         * @param userId
         * @param socket
         * @returns {Promise}
         */
        // updateSocketInUser : function (userId, socket) {
        //     return new Promise(function (resolve, reject) {
        //         var theSocket = socket;
        //         var socketId = sails.sockets.id(theSocket) || null;
        //
        //         User.update({id : userId}, {socketId : socketId}, function (err, userUpdated) {
        //             if (err) {
        //                 reject(err);
        //             }
        //
        //             if (!userUpdated) {
        //                 reject("There is a problem with login process");
        //             } else {
        //                 resolve({userObj : userUpdated[0], socket : theSocket});
        //             }
        //
        //         });
        //     })
        // },

        /**
         * get parameters, get count of message & notification and add them to userObj and returns uupdated user object
         * @param userId
         * @param tokenId
         * @param theEntity
         * @param userObj
         * @param userConnectObj
         * @returns {Promise}
         */
        // completeUserObj : function (userId, tokenId, theEntity, userObj, userConnectObj) {
        //     return new Promise(function (resolve, reject) {
        //         if(userConnectObj){
        //             userObj.entity = {};
        //             userObj.entity[theEntity] = userConnectObj;
        //         }
        //         async.auto({
        //             get_message_count : function (callback) {
        //                 VendorMessage.count({and : [{viewers : {not : userId}}, {receivers : userId}]}).exec(function countCB(error, found) {
        //                     if (error){
        //                         callback(error);
        //                     }
        //                     userObj.unreadMessage = found;
        //                     callback(null);
        //                 });
        //             },
        //             get_notif_count : function (callback) {
        //                 VendorNotification.count({and : [{viewers : {not : userId}}, {receivers : userId}]}).exec(function countCB(error, found) {
        //                     if (error){
        //                         callback(error);
        //                     }
        //                     userObj.unreadNotification = found;
        //                     callback(null);
        //                 });
        //             }
        //         }, function (err, results) {
        //             if (err) {
        //                 reject(err);
        //             }
        //             if (tokenId) {
        //                 userObj.tokenId = tokenId;
        //             }
        //
        //             resolve(userObj);
        //         });
        //     })
        // },

        /**
         * connect user socket and emit count of visitor event
         * @param userObj
         * @param theSocket
         * @returns {Promise}
         */
        // setSocketToUserRoom : function (userObj, theSocket) {
        //     return new Promise(function (resolve, reject) {
        //         roomNameUsers = sails.config.globals.rooms.users;
        //         sails.sockets.join(theSocket, roomNameUsers);
        //         sails.sockets.blast('countOfOnlineMembers', app.response.success(_.size(sails.sockets.subscribers(roomNameUsers))));
        //         roomNameVisitors = sails.config.globals.rooms.visitors;
        //         sails.sockets.leave(theSocket, roomNameVisitors);
        //         sails.sockets.blast('countOfVisitors', app.response.success(_.size(sails.sockets.subscribers(roomNameVisitors))));
        //         sails.sockets.blast('rooms.users.join', app.response.success(userObj));
        //         resolve(true);
        //     })
        // }
    },
};