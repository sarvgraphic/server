
var _new = require('lodash');
var _async = require('async');
module.exports = {

    getTopTag: function(req, res){
        var condition={
            isActive : true,
            sort : "countOfClicks DESC",
            skip : 0,
            limit : 20
        };
        ImageTag.find(condition).exec(function(err,resp){
            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageTagController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }

                }));
            }else{
                return res.ok(app.response.api.success(resp, 0, condition['skip'], condition['limit']));
            }

        })
    },

    findTags: function(req, res) {
        var theAllParams = req.allParams();
        var condition = {};
        if(_new.hasIn(theAllParams, 'title')) {
            condition.title = theAllParams.title
        }
        if(_new.hasIn(theAllParams, 'countOfClicks')) {
            condition.countOfClicks = theAllParams.countOfClicks;
        }
        if(_new.hasIn(theAllParams, 'isActive')) {
            condition.isActive = theAllParams.isActive.toString() === 'true';
        }
        ImageTagService.findAndCount(condition).then(function(resp) {
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
                ImageTagService.find(condition).then(function(resp) {
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
                    file: "/api/controllers/ImageTagController.js",
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
        if(!theAllParams.title) {
            res.ok(app.response.api.error('missing_parameter'));
        } else {
            var createObject = {
                title: theAllParams.title,
                isActive: theAllParams.isActive.toString() === 'true',
                key : encodeURI(theAllParams.title.replace(/[^a-z0-9_-]/gi, '')) + "-" + new Date().getTime()
            };
            ImageTagService.create(createObject).then(function() {
                res.ok(app.response.api.success());
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageTagController.js",
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    destroy: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id) {
            res.ok(app.response.api.error('missing_parameter'));
        } else {
            var condition = {
                id: theAllParams.id
            };
            ImageTagService.destroy(condition).then(function() {
                res.ok(app.response.api.success());
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    file: '/api/controllers/ImageTagController.js',
                    parameter: {
                        error: err
                    }
                    
                }));
            });
        }
    },

    findImageTag: function(req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id) {
            res.ok(app.response.api.error('missing_parameter'));
        } else {
            var condition = {
                id: theAllParams.id
            };
            ImageTagService.findOne(condition).then(function(resp) {
                res.ok(app.response.api.success(resp));
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    },

    update: function(req, res) {
        var theAllParams = req.allParams();
        sails.log(theAllParams);
        if(!theAllParams.title || !theAllParams.id) {
            res.ok(app.response.api.error('missing_parameter'));
        } else {
            var condition = {
                id: theAllParams.id
            };
            var updateObj = {
                title: theAllParams.title,
                isActive: theAllParams.isActive
            };
            ImageTagService.update(condition, updateObj).then(function () {
                res.ok(app.response.api.success());
            }).catch(function(err) {
                res.ok(app.response.api.error('server_error', {
                    parameter: {
                        error: err
                    }
                }));
            });
        }
    }

    //
    //createImageTag: function(req, res){
    //    var title = ["Beauty/Fashion", "Backgrounds/Textures", "The Arts", "Animals/Wildlife", "Abstract", "TILT SHIFT","Food", "sky", "wood"];
    //    var image = ["signup1.jpg", "signup2.jpg", "collectionbox2.jpg", "collectionbox1.jpg", "collectionbox3.jpg", "collectionbox4.jpg"];
    //        var imageId =["583c6503ff2a6d7c16690daf", "583c65348963168a16d940da"]
    //    for(var i= 0; i<100 ; i++){
    //        var titleNe = title[Math.floor(Math.random() * (9-0))]+ + Math.floor(Math.random() * (1000-0));
    //        var attributes = {
    //
    //            key : titleNe,
    //
    //
    //            title : titleNe,
    //
    //
    //            isActive : true,
    //
    //
    //            countOfClicks : Math.floor(Math.random() * (5000-1)),
    //
    //        }
    //        ImageTag.create(attributes).exec(function(err,resp){
    //            resp.images.add(imageId[Math.floor(Math.random() * (2-0))]);
    //            resp.save(function(err) {
    //                console.log("err : ", err)
    //            });
    //
    //        })
    //    }
    //
    //
    //}


};