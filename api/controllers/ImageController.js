var SkipperDisk = require('skipper-disk');
var fileAdapter = SkipperDisk({});

module.exports = {



    //
    getSearch: function(req, res){
        var theAllParams = req.allParams();
        console.log("theAllParams : ", theAllParams)
        ImageService.getImageAndCount(theAllParams).then(function(response){
            //console.log("response : ", response)
            return res.ok(app.response.api.success(response.getImage, response.getCount, theAllParams['skip'], theAllParams['limit']));
        }).catch(function(err){
            console.log(err)
            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/ImageTagController.js",
                parameter : {
                    debugParameter : "test debug parameter",
                    errors : err
                }

            }));
        });
    },

    //
    createImageTag: function(req, res){
        var title = ["Beauty/Fashion", "Backgrounds/Textures", "The Arts", "Animals/Wildlife", "Abstract", "TILT SHIFT","Food", "sky", "wood"];
        var enumn = ['Photo', 'Vector', 'Illustration', 'Icon'];
        var enumDes =  ['Vertical', 'Horizontal'];
        var image = [
            "signup1.jpg",
            "signup2.jpg",
            "collectionbox2.jpg",
            "collectionbox1.jpg",
            "collectionbox3.jpg",
            "collectionbox4.jpg",
            "1.jpg",
            "2.jpg",
            "3.jpg",
            "4.jpg",
            "box1.jpg",
            "box2.jpg",
            "box3.jpg",
            "box4.jpg",
            "feature1.jpg",
            "feature2.jpg",
            "feature3.jpg",
            "feature4.jpg",
            "feature5.jpg"
        ];
            var imageId =["583c6503ff2a6d7c16690daf", "583c65348963168a16d940da"];
        var enumSafe =  ['Safe', '+12', '+16', '+18'];

        var catego =[
            "583c17dfe2324c44126f61bd",
            "583c18516e88285d12a891be",
            "583c18e2e0a12b6c12d15de2",
            "583c18fea9d5717a123a09a9",
            "583e9d85e5b5932e2fff6f00",
            "583e9d85e5b5932e2fff6eff",
            "583e9d85e5b5932e2fff6efd",
            "583e9d85e5b5932e2fff6f01",
            "583e9d85e5b5932e2fff6f02",
            "583e9d85e5b5932e2fff6f04",
            "583e9d85e5b5932e2fff6f06",
            "583e9d85e5b5932e2fff6f0e",
            "583e9d85e5b5932e2fff6f2e",
            "583e9de71e4aa8432fb98034",
            "583e9de71e4aa8432fb98035"];

        var colle =[
            "583c4460e189655a14495727",
            "583c4492a90f7769145096f3",
            "583c44b48f16027714202020",
            "583c4bd3b7fb991f679263f7",
            "583f1fb7f2af5d2786f174b4",
            "583f1fb7f2af5d2786f174b5",
            "583f1fb7f2af5d2786f174b6"
        ];


        var imageTag = [
            "583eb9342381ca453160f541",
            "583eb9342381ca453160f542",
            "583eb9342381ca453160f543",
            "583eb9342381ca453160f544",
            "583eb9342381ca453160f545",
            "583eb9342381ca453160f546",
            "583eb9342381ca453160f547",
            "583eb9342381ca453160f548",
            "583eb9342381ca453160f549",
            "583eb9342381ca453160f54a",
            "583eb9342381ca453160f54b"]
        for(var i= 0; i<3 ; i++){
            var titleNe = title[Math.floor(Math.random() * (9-0))]+ " - "+ Math.floor(Math.random() * (1000-0));
            var enumnNe = enumn[Math.floor(Math.random() * (4-0))];
            var enumDesNe = enumDes[Math.floor(Math.random() * (2-0))];
            var safe = enumSafe[Math.floor(Math.random() * (4-0))];
            var imageData = image[Math.floor(Math.random() * (19-0))];
            var categoData = catego[Math.floor(Math.random() * (15-0))];
            var colleData = colle[Math.floor(Math.random() * (7-0))];
            var imageTagData = imageTag[Math.floor(Math.random() * (9-0))];
            var attributes = {
                key : titleNe,
                title : titleNe,
                imageType : enumnNe,
                direction: enumDesNe,
                safeMode: safe,
                description : "",
                isActive : true,
                img :imageData ,
                imgFileDescriptor : "",
                items: [],
                countOfDownloads : Math.floor(Math.random() * (14449-0)),
                countOfClicks : Math.floor(Math.random() * (1323239-0)),
                imageCategoryOwner : categoData,
                publisherOwner : '58432077ba4ab8e31386eed9',



            }
            Image.create(attributes).exec(function(err,resp){
                console.log("Math.floor(Math.random() * (10-0)) : ", Math.floor(Math.random() * (7-1)))
                resp.collections.add(colle[Math.floor(Math.random() * (7-1))]);
                resp.tags.add(imageTag[Math.floor(Math.random() * (11-1))]);
                resp.save(function(err) {
                    console.log("err : ", err)
                });

            })
        }


    },
    
    
    
    
    

    createImage : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams)
        if(!theAllParams.title){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            util.generateUniqueFieldValue("Image", "key", theAllParams.title, 0, theAllParams.title, function whenDone(key) {

                var createObj = {
                    title : theAllParams.title,
                    imageType : theAllParams.imageType,
                    key : key,
                    description : theAllParams.description || "",
                    isActive : theAllParams.isActive == undefined ? true : theAllParams.isActive,
                    direction : theAllParams.direction,
                    safeMode : theAllParams.safeMode,
                    imageCategoryOwner : theAllParams.imageCategoryOwner,
                    publisherOwner : theAllParams.publisherOwner
                };

                sails.log("create image object :: ", createObj);
                Image.create(createObj).exec(function (err, resp) {
                    if(err){
                        return res.ok(app.response.api.error('server_error', {
                            file: "/api/controllers/ImageController.js",
                            parameter : {
                                debugParameter : "test debug parameter",
                                errors : err
                            }

                        }));
                    } else {
                        resp.tags.add(theAllParams.tags);
                        resp.save(function (err) {
                            if(err){
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/ImageController.js",
                                    parameter : {
                                        errors : err
                                    }

                                }));
                            } else {
                                return res.ok(app.response.api.success(resp));
                            }
                        });

                    }
                })
            });
        }
    },

    getOneImage: function(req, res){

        var theAllParams = req.allParams();
        sails.log("theAllParams :: ", theAllParams)
        if(!theAllParams.title && !theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {

            var condition = _.pick(theAllParams, ["title", "id"]);
            sails.log("get one category condition :: ", condition);

            Image.find(condition).populate('publisherOwner').exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageController.js",
                        parameter: {
                            debugParameter: "debug parameter",
                            errors: err
                        }

                    }));
                } else {
                    return res.ok(app.response.api.success(resp[0]));
                }

            })
        }

    },

    getAllImage: function(req, res){

        var theAllParams = req.allParams();

        var condition = _.pick(theAllParams, ["skip", "limit", "title", "direction", "safeMode", "imageType"]);

        if(theAllParams.isActive !== undefined){
            condition.isActive = theAllParams.isActive.toString() == "true";
        }

        if( theAllParams.countOfDownloadsFrom && !theAllParams.countOfDownloadsTo ) {
            condition.countOfDownloads = { '$gte': theAllParams.countOfDownloadsFrom };
        } else if( theAllParams.countOfDownloadsTo && !theAllParams.countOfDownloadsFrom ) {
            condition.countOfDownloads = { '$lte': theAllParams.countOfDownloadsTo };
        } else if( theAllParams.countOfDownloadsTo && theAllParams.countOfDownloadsFrom ) {
            condition.countOfDownloads = {
                '$gte': theAllParams.countOfDownloadsFrom, '$lte': theAllParams.countOfDownloadsTo
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
        Image.findAndCount(condition, {}, {imageCategoryOwner : 1, publisherOwner : 1}).then(function (resp) {

            return res.ok(app.response.api.success(resp.list, resp.total, theAllParams.skip, theAllParams.limit));

        }).catch(function (err) {

            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/ImageController.js",
                parameter : {
                    debugParameter : "test debug parameter",
                    errors : err
                }
            }));

        })

    },

    destroyOneImage : function (req, res) {
        var theAllParams = req.allParams();
        sails.log("destroy category theAllParams :: ", theAllParams)
        if(!theAllParams.id){
            return res.ok(app.response.api.error('missing_parameter'));
        } else {
            Image.destroy({id : theAllParams.id}).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageController.js",
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

    editOneImage : function (req, res) {
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
                publisherOwner : theAllParams.image.publisherOwner,
                description : theAllParams.image.description,
                isActive : theAllParams.image.isActive.toString() == "true"
            };

            if (String(theAllParams.removeFile) == "true") {
                sails.log(111,theAllParams.image.imgFileDescriptor)
                util.deleteFile(theAllParams.image.imgFileDescriptor);
                // theAllParams.image.imgFileDescriptor = null;
                // theAllParams.image.img = null;
                updateObj.img = null;
                updateObj.imgFileDescriptor = null;
            }

            Image.update({id : theAllParams.id}, updateObj).exec(function (err, resp) {
                if (err) {
                    return res.ok(app.response.api.error('server_error', {
                        file: "/api/controllers/ImageController.js",
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

    uploadImage : function (req, res) {
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
        Image.findOne({
            id : theAllParams.id
        }).exec(function(err, collectionItem) {
            if (err || !collectionItem) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }
                }));
            } else {
                var dirname = "../../uploads/image/" + collectionItem.title;
                // var thumbPath = rootPath + "/.tmp/public/uploads/image-category/cover/" + collectionItem.title + "/thumbnails/";
                util.deleteFile(collectionItem.imgFileDescriptor);
                // util.deleteFile(thumbPath + collectionItem.imgCover);
                fileUploader.uploadFile(req.file('image'), 5000000, dirname, ['jpg', 'png', 'gif'], function (err, uploadedFile, imageName) {
                    if (err) {
                        return res.ok(app.response.error(err));
                    } else {
                        // fileUploader.createThumbnail(uploadedFile.fd, thumbPath, imageName, 256);
                        collectionItem.img = imageName;
                        collectionItem.imgFileDescriptor = uploadedFile.fd;
                        Image.update(collectionItem.id, {img : collectionItem.img, imgFileDescriptor : collectionItem.imgFileDescriptor}).exec(function (err) {
                            if (err) {
                                return res.ok(app.response.api.error('server_error', {
                                    file: "/api/controllers/ImageController.js",
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

    getImageFile : function (req, res) {

        var theAllParams = req.allParams();

        if(!theAllParams.id){
            theResponse = app.response.api.error('missing_parameter',
                {
                    file: "/api/controllers/UserController.js"
                });
            return res.ok(theResponse);
        } else {
            Image.findOne({id : theAllParams.id})
                         .exec(function (err, record) {
                             if (err) {
                                 return res.ok(app.response.api.error('server_error', {
                                     file: "/api/controllers/ImageController.js",
                                     parameter: {
                                         debugParameter: "debug parameter",
                                         errors: err
                                     }

                                 }));
                             }

                             var coverFd = record && record.imgFileDescriptor;

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

    imageSearch: function(req, res) {
        var theAllParams = req.allParams();
        sails.log("theAllParams", theAllParams);
        ImageService.findAndCount(theAllParams).then(function(resp) {
            res.ok(app.response.api.success(resp));
        }).catch(function(err) {
            res.ok(app.response.api.error('server_error', {
                parameter: {
                    error: err
                }
            }));
        });
    }
    
};