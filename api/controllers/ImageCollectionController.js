var _new = require('lodash');
var _async = require('async');
var validator = require('validator');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var SkipperDisk = require('skipper-disk');
var fileAdapter = SkipperDisk({});
var moment = require('moment');
module.exports = {

    getTopFeatured: function(req, res){
        var condition = {
            isTopFeatured : true,
            isActive : true
        };
        ImageCollection.find(condition).exec(function(err,resp){
            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCollectionController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }

                }));
            }else{
                return res.ok(app.response.api.success(resp, 0, 0, 0));
            }
        })
    },

    findCollections: function(req, res) {
        var theAllParams = req.allParams();
        if(_new.hasIn(theAllParams, 'isActive')) {
            theAllParams.isActive = theAllParams.isActive.toString() === 'true';
        }
        if(_new.hasIn(theAllParams, 'isTopFeatured')) {
            theAllParams.isTopFeatured = theAllParams.isTopFeatured.toString() === 'true';
        }
        if(_new.hasIn(theAllParams, 'isFeatured')) {
            theAllParams.isFeatured = theAllParams.isFeatured.toString() === 'true';
        }
        ImageCollectionService.findAndCount(theAllParams).then(function(resp) {
            res.ok(app.response.api.success(resp));
        }).catch(function(err) {
            res.ok(app.response.api.error(err));
        });
    },

    exist: function(req, res) {
        var theAllParams = req.allParams();
        var field = ['title', 'key', 'id'];
        _async.auto({
            condition: function(cb) {
                _async.forEachOf(theAllParams, function(value, key, cb1) {
                    var index = _new.findIndex(field, function(o) {
                        return o == key;
                    });
                    if(index == -1) {
                        _new.unset(theAllParams, key);
                    }
                    cb1(null, true);
                }, function() {
                    cb(null, theAllParams);
                });
            },
            find: ['condition', function(cb, result) {
                var condition = result.condition;
                condition.id = {'!': [condition.id]};
                ImageCollectionService.find(condition).then(function(resp) {
                    if(_new.size(resp) > 0) {
                        cb(null, 'exist');
                    } else {
                        cb(null, 'notExist');
                    }
                }).catch(function(err) {
                    cb(err);
                });
            }]
        }, function(errors, results) {
            if(errors != null) {
                res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCollectionController.js",
                    parameter: {
                        error: errors
                    }
                }));
            } else {
                res.ok(app.response.api.success(results.find));
            }
        });
    },
    
    create: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.title || !theAllParams.contentType) {
            res.ok(app.response.api.error('missing_parameter', {
                file: "/api/controllers/ImageCollectionController.js"
            }));
        } else {
            var createObj = {
                title: theAllParams.title,
                contentType: theAllParams.contentType,
                isActive: theAllParams.isActive.toString() === 'true',
                isTopFeatured: theAllParams.isTopFeatured.toString() === 'true',
                isFeatured: theAllParams.isFeatured.toString() === 'true',
                key : encodeURI(theAllParams.title.replace(/[^a-z0-9_-]/gi, '')) + "-" + new Date().getTime()
            };
            if(_new.hasIn(theAllParams, 'description') && _new.isString(theAllParams.description)) {
                createObj.description = theAllParams.description;
            }
            ImageCollectionService.create(createObj).then(function(resp) {
                res.ok(app.response.api.success(resp, 0, 0, 0));
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCollectionController.js",
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    getFeatured: function(req, res){
        var theAllParams = req.allParams();
        var condition = {
            isFeatured : true,
            isActive : true,
            sort : "countOfClicks DESC",
            skip :theAllParams['skip'] || 0,
            limit : theAllParams['limit'] || 20,
            contentType : theAllParams['contentType'] || ['Photo', 'Vector', 'Illustration', 'Icon']
        };
        ImageCollection.find(condition).exec(function(err,resp){
            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCollectionController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }

                }));
            }else{
                return res.ok(app.response.api.success(resp, 0, 0, 0));
            }
        })
    },

    uploadImgCover: function(req, res) {
        var theAllParams = req.allParams();
        if (!theAllParams.id || !req.file('imgCover')) {
            res.ok(app.response.api.error('missing_parameter', {
                file: "/api/controllers/ImageCollectionController.js"
            }));
        } else {
            async.auto({
                upload: function (cb) {
                    var dirName = '../../.tmp/public/imageCollection';
                    var allowedFormat = ['jpg', 'png', 'jpeg', 'gif'];
                    var maxBytes = 5000000;
                    FileUploaderService.fileUpload(req.file('imgCover'), maxBytes, dirName, allowedFormat, function (err, uploadedFile, imageName) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, imageName);
                        }
                    });
                },
                update: ['upload', function (cb, result) {
                    var condition = {
                        id: theAllParams.id
                    };
                    var descriptor = "http://" + sails.config.host + ':' + sails.config.port + "/imageCollection/" + result.upload;
                    var updateObject = {
                        imgCover: result.upload,
                        imgCoverFileDescriptor: descriptor
                    };
                    ImageCollectionService.update(condition, updateObject).then(function () {
                        cb(null, true);
                    }).catch(function (err) {
                        cb(err)
                    });
                }]
            }, function (errors, results) {
                if (errors != null) {
                    res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageCollectionController.js",
                        parameter: {
                            error: errors
                        }
                    }));
                } else {
                    res.ok(app.response.api.success());
                }
            });
        }
    },

    destroy: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }))
        } else {
            async.auto({
                destroy: function(cb) {
                    var condition = {
                        id: theAllParams.id
                    };
                    ImageCollectionService.destroy(condition).then(function(resp) {
                        cb(null, resp[0]);
                    }).catch(function(err) {
                        cb(err);
                    });
                },
                deleteFile: ['destroy', function(cb) {
                    if(theAllParams.imgCover) {
                        util.deleteFile('/Users/ray/projects/SSClone/server-app/.tmp/public/imageCollection/' + theAllParams.imgCover);
                    }
                    cb(null, true);
                }]
            }, function(errors) {
                if(errors != null) {
                    res.ok(app.response.api.error('server_error', {
                        file: '/api/controllers/ImageCollectionController.js',
                        parameter: {
                            error: errors
                        }
                    }));
                } else {
                    res.ok(app.response.api.success());
                }
            });
        }
    },

    findCollection: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }));
        } else {
            var condition = {
                id: theAllParams.id
            };
            ImageCollectionService.findOne(condition).then(function(resp) {
                res.ok(app.response.api.success(resp));
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageCollectionController.js',
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    image: function(req, res) {
        var theAllParams = req.allParams();
        if (req.method != 'GET' || !theAllParams.imgCollectionId) {
            res.ok(app.response.api.error("this method is available only with GET method and valid 'userId' field."));
        } else {

            var condition = {
                id: theAllParams.imgCollectionId
            };
            ImageCollectionService.findOne(condition).then(function(resp) {

                // var cover = resp && resp.imgCoverFileDescriptor;
                var cover = '/Users/ray/projects/SSClone/server-app/.tmp/public/imageCollection/' + resp.imgCover;
                if (cover) {
                    // Stream the file down
                    fileAdapter.read(cover)
                        .on('error', function (err) {
                            res.ok(app.response.api.error(err));
                        })
                        .pipe(res);
                } else {
                    res.ok(app.response.api.error("invalid file descriptor field."));
                }
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageCollectionController.js',
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    update: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id || !theAllParams.title || !theAllParams.contentType) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }));
        } else {
            async.auto({
                deleteFile: function(cb) {
                    if(_new.hasIn(theAllParams, 'removeFile') && theAllParams.removeFile === false) {
                        if(_new.hasIn(theAllParams, 'imgCover') && _new.hasIn(theAllParams, 'imgCoverFileDescriptor')) {
                            util.deleteFile('/Users/ray/projects/SSClone/server-app/.tmp/public/imageCollection/' + theAllParams.imgCover);
                            cb(null, {imgCover: null, imgCoverFileDescriptor: null});
                        } else {
                            cb(null, {});
                        }
                    } else {
                        cb(null, {});
                    }
                },
                update: ['deleteFile', function(cb, result) {
                    var condition = {
                        id: theAllParams.id
                    };
                    var updateObject = _new.assignIn(result.deleteFile, {
                        title: theAllParams.title,
                        contentType: theAllParams.contentType,
                        description: theAllParams.description,
                        isActive: theAllParams.isActive,
                        isTopFeatured: theAllParams.isTopFeatured,
                        isFeatured: theAllParams.isFeatured
                    });
                    ImageCollectionService.update(condition, updateObject).then(function(resp) {
                        cb(null, resp[0]);
                    }).catch(function(err) {
                        cb(err);
                    });
                }]
            }, function(errors, results) {
                if(errors != null) {
                    res.ok(app.response.api.error('server_error', {
                        file: '/api/controllers/ImageCollectionController.js',
                        parameter: {
                            error: errors
                        }
                    }));
                } else {
                    res.ok(app.response.api.success(results.update));
                }
            });
        }
    },

    saveImage: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.imageIds || !theAllParams.id || !_new.isArray(theAllParams.imageIds)) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }));
        } else {
            var condition = {
                id: theAllParams.id
            };
            ImageCollectionService.findOne(condition).then(function(collection) {
                collection.images.add(theAllParams.imageIds);
                collection.save(function(err) {
                    if(err) {
                        res.ok(app.response.api.error('server_error', {
                            file: '/api/controllers/ImageCollectionController.js',
                            parameter: {
                                error: err
                            }
                        }));
                    } else {
                        res.ok(app.response.api.success());
                    }
                });
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageCollectionController.js',
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    findImagesCollection: function(req,res) {
        var thenAllParams = req.allParams();
        if(!thenAllParams.id) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }));
        } else {
            var condition = {
                id: thenAllParams.id
            };
            var populate = 'images';
            ImageCollectionService.findAndPopulate(condition, populate).then(function(resp) {
                res.ok(app.response.api.success(resp));
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageCollectionController.js',
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    deletedImage: function(req, res) {
        var theAllParams = req.allParams();
        sails.log(theAllParams);
        if(!theAllParams.collectionId || !theAllParams.imageId) {
            res.ok(app.response.api.error('missing_parameter', {
                file: '/api/controllers/ImageCollectionController.js'
            }));
        } else {
            var condition = {
                id: theAllParams.collectionId
            };
            ImageCollectionService.findOne(condition).then(function(collection) {
                collection.images.remove(theAllParams.imageId);
                collection.save(function(err) {
                    sails.log(err)
                    if(err) {
                        res.ok(app.response.api.error('server_error', {
                            file: '/api/controllers/ImageCollectionController.js',
                            parameter: {
                                error: err
                            }
                        }));
                    } else {
                        res.ok(app.response.api.success());
                    }
                });
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageCollectionController.js',
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    }
};