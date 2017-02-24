var mkdirp = require('mkdirp');
module.exports = {
    createReSizeImageProduct: function(filePath, thumbPath, imageName, imageWidth) {
        return new Promise(function(resolve, reject){
            var lwip = require('lwip');

            mkdirp(thumbPath, function (error) {
                // if path was exist return error => don't need to handle
                if(error){
                    reject(error);
                } else {
                    lwip.open(filePath, function (err, image) {
                        if(err){
                            reject(err);
                        } else {
                            if (image.width() < imageWidth) {
                                imageWidth = image.width();
                            }
                            var imageHight = (imageWidth / image.width()) * image.height();
                            image.resize(imageWidth, imageHight, function (err, rzdImg) {
                                if(err){
                                    reject(err);
                                } else {
                                    rzdImg.writeFile(thumbPath + imageName, function (err) {
                                        if(err){
                                            reject(err);
                                        } else {
                                            resolve("reSize was successful");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    
    uploadImageProduct: function(file, maxBytes, dir, allowedFormat){
        return new Promise(function(resolve, reject){
            var fileName;
            file.upload({
                // don't allow the total upload size to exceed max bytes
                maxBytes : maxBytes,
                dirname : dir,
                saveAs : function (__newFileStream, cb) {
                    var reExt = /(?:\.([^.]+))?$/;
                    var theFilename = __newFileStream.filename.substring(0, __newFileStream.filename.lastIndexOf("."));
                    // console.log("33333333333");
                    // console.log(theFilename);
                    // console.log("33333333333");
                    var ext = reExt.exec(__newFileStream.filename)[1];
                    // console.log("4444444444444");
                    // console.log(ext);
                    // console.log("4444444444444");
                    if (ext && ( _.include(allowedFormat, ext) )) {
                        fileName = theFilename + '-' + new Date().getTime() + '.' + ext;
                        // console.log("5555555555555");
                        // console.log(fileName);
                        // console.log("5555555555555");
                        cb(null, fileName);
                    } else {
                        // console.log("11111111111");
                        // console.log(err);
                        // console.log("11111111111");
                        cb("invalid file extension");
                        // reject("invalid file extension");
                    }
                }
            }, function whenDone(err, uploadedFiles) {
                if(err){
                    reject(err);
                } else {
                    resolve({uploadedFiles: uploadedFiles[0], fileName: fileName})
                }
            });
        });
    },

    createThumbnail(filePath, thumbPath, imageName, imageWidth) {
        try {
            mkdirp(thumbPath, function (error) {
                // if path was exist return error => don't need to handle
                lwip.open(filePath, function (err, image) {
                        if (err) throw err;
                        if (image.width() < imageWidth) {
                            imageWidth = image.width();
                        }
                        var imageHight = (imageWidth / image.width()) * image.height();
                        image.resize(imageWidth, imageHight, function (err, rzdImg) {
                            rzdImg.writeFile(thumbPath + imageName, function (err) {
                                if (err) throw err;
                                else console.log("thumbnail created.");
                            });
                        });
                    }
                );
            });
        } catch (err) {
            console.log(err);
        }
    },

    uploadFile(file, maxBytes, dir, allowedFormat, next, fileNewName){
        var fileName;
        file.upload({
            // don't allow the total upload size to exceed max bytes
            maxBytes : maxBytes,
            dirname : dir,
            saveAs : function (__newFileStream, cb) {
                var reExt = /(?:\.([^.]+))?$/;
                var theFilename = fileNewName || __newFileStream.filename.substring(0, __newFileStream.filename.lastIndexOf("."));
                var ext = reExt.exec(__newFileStream.filename)[1];
                if (ext && ( _.include(allowedFormat, ext) )) {
                    fileName = theFilename + '-' + new Date().getTime() + '.' + ext;
                    cb(null, fileName);
                } else {
                    next("invalid file extension");
                }
            }
        }, function whenDone(err, uploadedFiles) {
            next(err, uploadedFiles[0], fileName);
        });
    }
};
