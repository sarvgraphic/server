
var mkdirp = require('mkdirp');
module.exports = {
    fileUpload: function(file, maxBytes, dir, allowedFormat, next, fileNewName){
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
