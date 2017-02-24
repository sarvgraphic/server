module.exports = {

    //getImageSearch: function(req, res){
    //    var condition={
    //        isActive : true
    //    };
    //    ImageSearch.find(condition).exec(function(err,resp){
    //        if(err){
    //            return res.ok(app.response.api.error('server_error', {
    //                file: "/api/controllers/ImageCategoryController.js",
    //                parameter : {
    //                    debugParameter : "test debug parameter",
    //                    errors : err
    //                }
    //
    //            }));
    //        }else{
    //            return res.ok(app.response.api.success(resp, 0, 0, 0));
    //        }
    //
    //    })
    //
    //
    //},
    //
    //
    getTopHitsImageSearch: function( req, res ) {
        var theAllParams = req.allParams();
        var condition = {
            isActive: true,
            sort: "countOfHits DESC",
            skip: theAllParams[ 'skip' ] || 0,
            limit: theAllParams[ 'limit' ] || 20,
            searchArea: theAllParams[ 'searchArea' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ]
        };
        ImageSearch.find(condition).exec(function( err, resp ) {
            if( err ) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageSearchController.js",
                    parameter: {
                        debugParameter: "test debug parameter",
                        errors: err
                    }

                }));
            } else {
                return res.ok(app.response.api.success(resp, 0, condition[ 'skip' ], condition[ 'limit' ]));
            }

        })
    },

    getTopEditorialChooseImage: function( req, res ) {
        var theAllParams = req.allParams();
        console.log("the", theAllParams)
        var condition = {
            isActive: true,
            sort: "countOfHits DESC",
            skip: theAllParams[ 'skip' ] || 0,
            limit: theAllParams[ 'limit' ] || 4,
            searchArea: theAllParams[ 'imageType' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ],
            isEditorialChoose: true
        };
        console.log(condition,"--s-as-a-sa-s-")
        ImageSearchService.getEditoralImage(condition).then(function( resp ) {
            return res.ok(app.response.api.success(resp, 0, condition[ 'skip' ], condition[ 'limit' ]));
        }).catch(function( err ) {
            return res.ok(app.response.api.error('server_error', {
                file: "/api/controllers/ImageSearchController.js",
                parameter: {
                    debugParameter: "test debug parameter",
                    errors: err
                }

            }));
        });
    },

    getTopEditorialChoose: function( req, res ) {
        var theAllParams = req.allParams();

        var condition = {
            isActive: true,
            sort: "countOfHits DESC",
            skip: theAllParams[ 'skip' ] || 0,
            limit: theAllParams[ 'limit' ] || 16,
            searchArea: theAllParams[ 'imageType' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ],
            isEditorialChoose: true
        };
        ImageSearch.find(condition).exec(function( err, resp ) {
            if( err ) {
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageSearchController.js",
                    parameter: {
                        debugParameter: "test debug parameter",
                        errors: err
                    }

                }));
            } else {
                return res.ok(app.response.api.success(resp, 0, condition[ 'skip' ], condition[ 'limit' ]));
            }

        })
    }

    //
    //createImageSearch: function(req, res){
    //    var title = ["Beauty/Fashion", "Backgrounds/Textures", "The Arts", "Animals/Wildlife", "Abstract", "TILT SHIFT","Food", "sky", "wood"]
    //    var image = ["signup1.jpg", "signup2.jpg", "collectionbox2.jpg", "collectionbox1.jpg", "collectionbox3.jpg", "collectionbox4.jpg"]
    //    var arrr = ['Image', 'Photo', 'Vector', 'Illustration', 'Icon']
    //    for(var i= 0; i<100 ; i++){
    //        var titleNe = title[Math.floor(Math.random() * (9-0))]+ ' _ '+Math.floor(Math.random() * (1000-0));
    //        var obj = {
    //            "key" : titleNe,
    //            "title" : titleNe,
    //            "searchArea" : arrr[Math.floor(Math.random() * (5-0))],
    //            "isActive" : true,
    //            "isEditorialChoose" : false,
    //            "countOfHits" : Math.floor(Math.random() * (5000-1)),
    //        };
    //
    //
    //        ImageSearch.create(obj).exec(function(err,resp){
    //            console.log("obj : ", err,resp)
    //
    //        })
    //    }
    //
    //
    //}

};