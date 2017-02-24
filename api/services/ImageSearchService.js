var _new = require('lodash');
module.exports = {
    getEditoralImage: function( condition ) {
        return new Promise(function( resolve, reject ) {
            async.auto({
                getEditoralImageSearch: function( cb ) {
                    ImageSearch.find(condition, { select: [ 'title' ] }).exec(function( err, resp ) {
                        if( err ) {
                            reject(err);
                        } else {

                            cb(null, resp)
                        }

                    })
                },
                getTopClickImages: [ 'getEditoralImageSearch', function( cb, result ) {

                    var imageData = [];
                    if( result.getEditoralImageSearch && result.getEditoralImageSearch.length ) {
                        var editoralLength = result.getEditoralImageSearch.length;
                        result.getEditoralImageSearch.forEach(function( item, index ) {
                            var imageCondition = {
                                isActive: true,
                                sort: "countOfClicks DESC",
                                skip: 0,
                                limit: 1,
                                $or: [
                                    { title: { contains: item[ 'title' ] } },
                                    { direction: { contains: item[ 'title' ] } }
                                ],
                                imageType: condition[ 'searchArea' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ]
                            };
                            Image.find(imageCondition).exec(function( err, resp ) {
                                if( err ) {
                                    reject(err);
                                } else {
                                    imageData = imageData.concat(resp);
                                    if( editoralLength - 1 == index ) {
                                        cb(null, imageData);
                                    }
                                }
                            })
                        });
                    } else {
                        cb(null, imageData);
                    }

                } ]
            }, function( err, results ) {
                console.log("results : ", results)
                resolve(results.getTopClickImages)
            })

        });
    },

    searchLog: function( data, callback ) {
        var createData = {
            "key": (data[ 'title' ] + "_" + new Date().getTime()).replace(/[\-\s\"\'\/\(\)]*/g, ''),
            "title": data[ 'title' ],
            "searchArea": data[ 'searchArea' ],
            "isActive": true,
            "countOfHits": 1
        };
        ImageSearch.findOne(data).exec(function( err, response ) {
            if(response){
                ImageSearch.update({id : response.id}, { 'countOfHits' : response.countOfHits+1}).exec(function(err, resp){
                    if(err){
                        callback(err);
                    }else{
                        callback('', resp);
                    }
                })
            }else{
                ImageSearch.create(createData).exec(function(err, resp){
                    if(err){
                        callback(err);
                    }else{
                        callback('', resp);
                    }
                })
            }
        });

    }
};