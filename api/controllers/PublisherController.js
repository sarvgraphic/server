var SkipperDisk = require('skipper-disk');
var fileAdapter = SkipperDisk({});

module.exports = {
    
    
    

    createPublisher : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams);
        if(!theAllParams.title, !theAllParams.users, !theAllParams.typeOfPublication ){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            util.generateUniqueFieldValue("Publisher", "key", theAllParams.title, 0, theAllParams.title, function whenDone(key) {

                var createObj = {
                    title : theAllParams.title,
                    key : key,
                    typeOfPublication : theAllParams.typeOfPublication,
                    about : theAllParams.about || "",
                    isActive : theAllParams.isActive == undefined ? true : theAllParams.isActive,
                    isPending : theAllParams.isPending == undefined ? false : theAllParams.isPending,
                    isExpired : theAllParams.isExpired == undefined ? false : theAllParams.isExpired
                };

                sails.log("create image object :: ", createObj);
                Publisher.create(createObj).exec(function (err, publisher) {
                    if(err){
                        return res.ok(app.response.api.error('server_error', {
                            file: "/api/controllers/PublisherController.js",
                            parameter : {
                                debugParameter : "test debug parameter",
                                errors : err
                            }

                        }));
                    } else {
                        publisher.users.add(theAllParams.users);
                        publisher.save(function (err) {
                            if(err){
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/PublisherController.js",
                                    parameter : {
                                        debugParameter : "test debug parameter",
                                        errors : err
                                    }

                                }));
                            } else {
                                return res.ok(app.response.api.success(publisher));
                            }
                        });
                    }
                })
            });
        }
    },

    getOnePublisher: function(req, res){

        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams)
        if(!theAllParams.title && !theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {

            var condition = _.pick(theAllParams, ["title", "id"]);
            sails.log("get one category condition :: ", condition);

            Publisher.findOne(condition).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/PublisherController.js",
                        parameter: {
                            debugParameter: "debug parameter",
                            errors: err
                        }

                    }));
                } else {
                    return res.ok(app.response.api.success(resp));
                }

            })
        }

    },

    getAllPublisher: function(req, res){

        var theAllParams = req.allParams();

        var condition = _.pick(theAllParams, ["skip", "limit", "title"]);

        if(theAllParams.isActive !== undefined){
            condition.isActive = theAllParams.isActive.toString() == "true";
        }

        if( theAllParams.countOfImageItemsFrom && !theAllParams.countOfImageItemsTo ) {
            condition.countOfImageItems = { '$gte': theAllParams.countOfImageItemsFrom };
        } else if( theAllParams.countOfImageItemsTo && !theAllParams.countOfImageItemsFrom ) {
            condition.countOfImageItems = { '$lte': theAllParams.countOfImageItemsTo };
        } else if( theAllParams.countOfImageItemsTo && theAllParams.countOfImageItemsFrom ) {
            condition.countOfImageItems = {
                '$gte': theAllParams.countOfImageItemsFrom, '$lte': theAllParams.countOfImageItemsTo
            };
        }

        if( theAllParams.countOfImageActiveItemsFrom && !theAllParams.countOfImageActiveItemsTo ) {
            condition.countOfImageActiveItems = { '$gte': theAllParams.countOfImageActiveItemsFrom };
        } else if( theAllParams.countOfImageActiveItemsTo && !theAllParams.countOfImageActiveItemsFrom ) {
            condition.countOfImageActiveItems = { '$lte': theAllParams.countOfImageActiveItemsTo };
        } else if( theAllParams.countOfImageActiveItemsTo && theAllParams.countOfImageActiveItemsFrom ) {
            condition.countOfImageActiveItems = {
                '$gte': theAllParams.countOfImageActiveItemsFrom, '$lte': theAllParams.countOfImageActiveItemsTo
            };
        }

        if( theAllParams.countOfClicksFrom && !theAllParams.countOfClicksTo ) {
            condition.countOfClicks = { '$gte': theAllParams.countOfClicksFrom };
        } else if( theAllParams.countOfClicksTo && !theAllParams.countOfClicksFrom ) {
            condition.countOfClicks = { '$lte': theAllParams.countOfClicksTo };
        } else if( theAllParams.countOfClicksTo && theAllParams.countOfClicksFrom ) {
            condition.countOfClicks = {
                '$gte': theAllParams.countOfClicksFrom, '$lte': theAllParams.countOfClicksTo
            };
        }

        sails.log("get all category theAllParams :: ", theAllParams);
        sails.log("get all category condition :: ", condition);
        Publisher.findAndCount(condition).then(function (resp) {

            return res.ok(app.response.api.success(resp.list, resp.total, theAllParams.skip, theAllParams.limit));

        }).catch(function (err) {

            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/PublisherController.js",
                parameter : {
                    debugParameter : "test debug parameter",
                    errors : err
                }
            }));

        })

    },

    destroyOnePublisher : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("destroy category theAllParams :: ", theAllParams)
        if(!theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            Publisher.destroy({id : theAllParams.id}).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/PublisherController.js",
                        parameter: {
                            debugParameter: "debug parameter",
                            errors: err
                        }

                    }));
                } else {
                    return res.ok(app.response.api.success(resp));
                }
            })
        }
    },

    editOnePublisher : function (req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {

            var updateObj = {
                title : theAllParams.image.title,
                imageType : theAllParams.image.imageType,
                direction : theAllParams.image.direction,
                safeMode : theAllParams.image.safeMode,
                imageCategoryOwner : theAllParams.image.imageCategoryOwner,
                description : theAllParams.image.description,
                isActive : theAllParams.image.isActive.toString() == "true"
            };

            if (String(theAllParams.removeFile) == "true") {
                sails.log(111,theAllParams.image.imgAvatarFileDescriptor)
                util.deleteFile(theAllParams.image.imgAvatarFileDescriptor);
                // theAllParams.image.imgAvatarFileDescriptor = null;
                // theAllParams.image.img = null;
                updateObj.img = null;
                updateObj.imgAvatarFileDescriptor = null;
            }

            Publisher.update({id : theAllParams.id}, updateObj).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/PublisherController.js",
                        parameter: {
                            debugParameter: "debug parameter",
                            errors: err
                        }

                    }));
                } else {
                    return res.ok(app.response.api.success(resp));
                }
            })

        }
    },

    uploadPublisherAvatar : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("in upload file",theAllParams);
        if (!theAllParams.id || !req.file('image')) {
            return res.ok(app.response.api.error('missing_parameter'));
        }
        var rootPath;
        try {
            rootPath = process.cwd();
        } catch (e) {
            return res.ok(app.response.api.error("server_error"));
        }
        Publisher.findOne({
            id : theAllParams.id
        }).exec(function(err, collectionItem) {
            if (err || !collectionItem) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/PublisherController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }
                }));
            } else {
                var dirname = "../../uploads/publisher/avatar/" + collectionItem.title;
                util.deleteFile(collectionItem.imgAvatarFileDescriptor);
                // util.deleteFile(thumbPath + collectionItem.imgCover);
                fileUploader.uploadFile(req.file('image'), 5000000, dirname, ['jpg', 'png', 'gif'], function (err, uploadedFile, imageName) {
                    if (err) {
                        return res.ok(app.response.error(err));
                    } else {
                        // fileUploader.createThumbnail(uploadedFile.fd, thumbPath, imageName, 256);
                        collectionItem.imgAvatar = imageName;
                        collectionItem.imgAvatarFileDescriptor = uploadedFile.fd;
                        Publisher.update(collectionItem.id, {imgAvatar : collectionItem.imgAvatar, imgAvatarFileDescriptor : collectionItem.imgAvatarFileDescriptor}).exec(function (err) {
                            if (err) {
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/PublisherController.js",
                                    parameter : {
                                        debugParameter : "test debug parameter",
                                        errors : err
                                    }
                                }));
                            } else {
                                return res.ok(app.response.api.success(collectionItem));
                            }
                        });
                    }
                });
            }
        });
    },

    uploadPublisherCover : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("in upload file",theAllParams);
        if (!theAllParams.id || !req.file('image')) {
            return res.ok(app.response.api.error('missing_parameter'));
        }
        var rootPath;
        try {
            rootPath = process.cwd();
        } catch (e) {
            return res.ok(app.response.api.error("server_error"));
        }
        Publisher.findOne({
            id : theAllParams.id
        }).exec(function(err, collectionItem) {
            if (err || !collectionItem) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/PublisherController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }
                }));
            } else {
                var dirname = "../../uploads/publisher/cover/" + collectionItem.title;
                util.deleteFile(collectionItem.imgCoverFileDescriptor);
                // util.deleteFile(thumbPath + collectionItem.imgCover);
                fileUploader.uploadFile(req.file('image'), 5000000, dirname, ['jpg', 'png', 'gif'], function (err, uploadedFile, imageName) {
                    if (err) {
                        return res.ok(app.response.error(err));
                    } else {
                        // fileUploader.createThumbnail(uploadedFile.fd, thumbPath, imageName, 256);
                        collectionItem.imgCover = imageName;
                        collectionItem.imgCoverFileDescriptor = uploadedFile.fd;
                        Publisher.update(collectionItem.id, {imgCover : collectionItem.imgCover, imgCoverFileDescriptor : collectionItem.imgCoverFileDescriptor}).exec(function (err) {
                            if (err) {
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/PublisherController.js",
                                    parameter : {
                                        debugParameter : "test debug parameter",
                                        errors : err
                                    }
                                }));
                            } else {
                                return res.ok(app.response.api.success(collectionItem));
                            }
                        });
                    }
                });
            }
        });
    },

    getPublisherAvatar : function (req, res) {

        var theAllParams = req.allParams();

        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {
            Publisher.findOne({id : theAllParams.id})
                         .exec(function (err, record) {
                             if (err) {
                                 return res.ok(app.response.api.error('server_error', {
                                     file: "/api/controllers/PublisherController.js",
                                     parameter: {
                                         debugParameter: "debug parameter",
                                         errors: err
                                     }

                                 }));
                             }

                             var coverFd = record && record.imgAvatarFileDescriptor;

                             if (coverFd) {
                                 fileAdapter.read(coverFd)
                                            .on('error', function (err) {
                                                return res.ok(app.response.api.error(err));
                                            })
                                            .pipe(res);
                             } else {
                                 return res.ok(app.response.api.error('server_error'));
                             }

                         });
        }
    },

    getPublisherCover : function (req, res) {

        var theAllParams = req.allParams();

        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {
            Publisher.findOne({id : theAllParams.id})
                     .exec(function (err, record) {
                         if (err) {
                             return res.ok(app.response.api.error('server_error', {
                                 file: "/api/controllers/PublisherController.js",
                                 parameter: {
                                     debugParameter: "debug parameter",
                                     errors: err
                                 }

                             }));
                         }

                         var coverFd = record && record.imgCoverFileDescriptor;

                         if (coverFd) {
                             fileAdapter.read(coverFd)
                                        .on('error', function (err) {
                                            return res.ok(app.response.api.error(err));
                                        })
                                        .pipe(res);
                         } else {
                             return res.ok(app.response.api.error('server_error'));
                         }

                     });
        }
    }
    
};