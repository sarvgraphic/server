var moment = require('moment');

module.exports = {
    getImageOfWeek: function(req, res){
        var theAllParams = req.allParams();
        var condition = {
            skip :theAllParams['skip'] || 0,
            limit : theAllParams['limit'] || Infinity,
            week : moment().week(),
            year : moment().year(),
            contentType: theAllParams['contentType'] ||  ['Photo', 'Vector', 'Illustration', 'Icon']
        };
        console.log(condition)
        ImageOfWeek.find(condition,{select:['image']}).exec(function(err,resp){

            if(err){
                return res.ok(app.response.api.error('server_error', {
                    file: "/api/controllers/ImageOfWeekController.js",
                    parameter : {
                        debugParameter : "test debug parameter",
                        errors : err
                    }

                }));
            }else{
                var imageList = [];
                resp.map(function(item){
                    imageList.push(item.image);
                });
                //return res.ok(app.response.api.success(imageList, 0, 0, 0));
                    Image.find(imageList).populate('publisherOwner').exec(function(err, resp){
                    if(err) {
                        return res.ok(app.response.api.error('server_error', {
                            file: "/api/controllers/ImageOfWeekController.js",
                            parameter: {
                                debugParameter: "test debug parameter",
                                errors: err
                            }

                        }));
                    }else{
                        return res.ok(app.response.api.success(resp, 0, 0, 0));
                    }
                });

            }
        })
    }
};