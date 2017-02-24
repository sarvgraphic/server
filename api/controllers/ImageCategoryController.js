var SkipperDisk = require('skipper-disk');
var fileAdapter = SkipperDisk({});

module.exports = {

    getImageCategory: function(req, res){
        var condition={
            isActive : true
        };
        ImageCategory.find(condition).exec(function(err,resp){
            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCategoryController.js",
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

    createImageCategory : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams)
        if(!theAllParams.title){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            util.generateUniqueFieldValue("ImageCategory", "key", theAllParams.title, 0, theAllParams.title, function whenDone(key) {

                var createObj = {
                    title : theAllParams.title,
                    contentType : theAllParams.contentType,
                    key : key,
                    description : theAllParams.description || "",
                    isActive : theAllParams.isActive == undefined ? true : theAllParams.isActive
                };

                sails.log("create image category object :: ", createObj);
                ImageCategory.create(createObj).exec(function (err, resp) {
                    if(err){
                        return res.ok(app.response.api.error('server_error', {
                            file: "/api/controllers/ImageCategoryController.js",
                            parameter : {
                                debugParameter : "test debug parameter",
                                errors : err
                            }

                        }));
                    } else {
                        return res.ok(app.response.api.success(resp));
                    }
                })
            });
        }
    },

    uploadCategoryCoverImage : function (req, res) {
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
        ImageCategory.findOne({
            id : theAllParams.id
        }).exec(function(err, collectionItem) {
            if (err || !collectionItem) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCategoryController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }
                }));
            } else {
                var dirname = "../../uploads/image-category/cover/" + collectionItem.title;
                // var thumbPath = rootPath + "/.tmp/public/uploads/image-category/cover/" + collectionItem.title + "/thumbnails/";
                util.deleteFile(collectionItem.imgCoverFileDescriptor);
                // util.deleteFile(thumbPath + collectionItem.imgCover);
                fileUploader.uploadFile(req.file('image'), 5000000, dirname, ['jpg', 'png', 'gif'], function (err, uploadedFile, imageName) {
                    if (err) {
                        return res.ok(app.response.error(err));
                    } else {
                        // fileUploader.createThumbnail(uploadedFile.fd, thumbPath, imageName, 256);
                        collectionItem.imgCover = imageName;
                        collectionItem.imgCoverFileDescriptor = uploadedFile.fd;
                        ImageCategory.update(collectionItem.id, {imgCover : collectionItem.imgCover, imgCoverFileDescriptor : collectionItem.imgCoverFileDescriptor}).exec(function (err) {
                            if (err) {
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/ImageCategoryController.js",
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

    getTopCategory: function(req, res){
        var theAllParams = req.allParams();
        var condition={
            isActive : true,
            sort : "countOfClicks DESC",
            skip :theAllParams['skip'] || 0,
            limit : theAllParams['limit'] || 20,
            contentType : theAllParams['imageType'] || [ 'Photo', 'Vector', 'Illustration', 'Icon' ]
        };
        ImageCategory.find(condition).exec(function(err,resp){
            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageCategoryController.js",
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

    getOneImageCategory: function(req, res){

        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams)
        if(!theAllParams.title && !theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            
            var condition = _.pick(theAllParams, ["title", "id"]);
            sails.log("get one category condition :: ", condition);
            
            ImageCategory.findOne(condition).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageCategoryController.js",
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

    getAllImageCategory: function(req, res){

        var theAllParams = req.allParams();

        var condition = _.pick(theAllParams, ["skip", "limit", "title"]);

        if(theAllParams.isActive !== undefined){
            condition.isActive = theAllParams.isActive.toString() == "true";
        }

        if( theAllParams.countOfItemFrom && !theAllParams.countOfItemTo ) {
            condition.countOfItems = { '$gte': theAllParams.countOfItemFrom };
        } else if( theAllParams.countOfItemTo && !theAllParams.countOfItemFrom ) {
            condition.countOfItems = { '$lte': theAllParams.countOfItemTo };
        } else if( theAllParams.countOfItemTo && theAllParams.countOfItemFrom ) {
            condition.countOfItems = {
                '$gte': theAllParams.countOfItemFrom, '$lte': theAllParams.countOfItemTo
            };
        }

        if( theAllParams.countOfActiveItemFrom && !theAllParams.countOfActiveItemTo ) {
            condition.countOfActiveItems = { '$gte': theAllParams.countOfActiveItemFrom };
        } else if( theAllParams.countOfActiveItemTo && !theAllParams.countOfActiveItemFrom ) {
            condition.countOfActiveItems = { '$lte': theAllParams.countOfActiveItemTo };
        } else if( theAllParams.countOfActiveItemTo && theAllParams.countOfActiveItemFrom ) {
            condition.countOfActiveItems = {
                '$gte': theAllParams.countOfActiveItemFrom, '$lte': theAllParams.countOfActiveItemTo
            };
        }

        if( theAllParams.countOfClickFrom && !theAllParams.countOfClickTo ) {
            condition.countOfClicks = { '$gte': theAllParams.countOfClickFrom };
        } else if( theAllParams.countOfClickTo && !theAllParams.countOfClickFrom ) {
            condition.countOfClicks = { '$lte': theAllParams.countOfClickTo };
        } else if( theAllParams.countOfClickTo && theAllParams.countOfClickFrom ) {
            condition.countOfClicks = {
                '$gte': theAllParams.countOfClickFrom, '$lte': theAllParams.countOfClickTo
            };
        }

        sails.log("get all category theAllParams :: ", theAllParams);
        sails.log("get all category condition :: ", condition);
        ImageCategory.findAndCount(condition).then(function (resp) {

            return res.ok(app.response.api.success(resp.list, resp.total, theAllParams.skip, theAllParams.limit));

        }).catch(function (err) {

            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/ImageCategoryController.js",
                parameter : {
                    debugParameter : "test debug parameter",
                    errors : err
                }
            }));
            
        })

    },

    destroyOneImageCategory : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("destroy category theAllParams :: ", theAllParams)
        if(!theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            ImageCategory.destroy({id : theAllParams.id}).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageCategoryController.js",
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

    editOneImageCategory : function (req, res) {
        var theAllParams = req.allParams();
        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {

            var updateObj = {
                title : theAllParams.category.title,
                description : theAllParams.category.description,
                isActive : theAllParams.category.isActive.toString() == "true"
            };
            
            if (String(theAllParams.removeFile) == "true") {
                sails.log(111,theAllParams.category.imgCoverFileDescriptor)
                util.deleteFile(theAllParams.category.imgCoverFileDescriptor);
                // theAllParams.category.imgCoverFileDescriptor = null;
                // theAllParams.category.imgCover = null;
                updateObj.imgCover = null;
                updateObj.imgCoverFileDescriptor = null;
            }

            ImageCategory.update({id : theAllParams.id}, updateObj).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageCategoryController.js",
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

    getImageCategoryCover : function (req, res) {

        var theAllParams = req.allParams();

        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {
            ImageCategory.findOne({id : theAllParams.id})
                .exec(function (err, record) {
                    if (err) {
                        return res.ok(app.response.api.error('server_error', {
                            file: "/api/controllers/ImageCategoryController.js",
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

    //
    //createImageCategory: function(req, res){
    //    //var title = ["Beauty/Fashion", "Backgrounds/Textures", "The Arts", "Animals/Wildlife", "Abstract", "TILT SHIFT","Food", "sky", "wood"]
    //    //var image = ["signup1.jpg", "signup2.jpg", "collectionbox2.jpg", "collectionbox1.jpg", "collectionbox3.jpg", "collectionbox4.jpg"]
    //    //for(var i= 0; i<100 ; i++){
    //    //    var titleNe = title[Math.floor(Math.random() * (9-0))]+ + Math.floor(Math.random() * (1000-0));
    //        //var obj = {
    //        //    "key" : titleNe,
    //        //    "title" : titleNe,
    //        //    "description" : "",
    //        //    "isActive" : true,
    //        //    "imgCover" : image[Math.floor(Math.random() * (6-0))],
    //        //    "imgCoverFileDescriptor" : "",
    //        //    "countOfItems" : Math.floor(Math.random() * (500-1)),
    //        //    "countOfActiveItems" : Math.floor(Math.random() * (300-1)),
    //        //    "countOfClicks" : Math.floor(Math.random() * (5000-1))
    //        //}
    //
    //        attributes = {
    //
    //            key : 'majid_azad',
    //
    //
    //            title : 'majid azad',
    //            typeOfPublication : ['Image'],
    //
    //
    //            about :'owner of image',
    //
    //
    //            imgAvatar : 'avatar3.jpg',
    //
    //
    //            imgAvatarFileDescriptor : 'majid',
    //
    //
    //            imgCover : '',
    //
    //
    //            imgCoverFileDescriptor : '',
    //
    //
    //            isActive: true,
    //
    //
    //            isExpired: false,
    //
    //
    //            isPending: false,
    //
    //
    //            countOfImageItems : 200,
    //
    //
    //            countOfImageActiveItems : 10,
    //
    //
    //            countOfClicks :1500,
    //
    //
    //        }
    //
    //        Publisher.create(attributes).exec(function(err,resp){
    //            console.log("obj : ", err,resp)
    //            resp.users.add("583c3cce15dd1b7b3e6c83bb");
    //            resp.save(function( err ) {
    //                console.log("err : ", err)
    //            });
    //
    //        })
    //    //}
    //
    //
    //}


};