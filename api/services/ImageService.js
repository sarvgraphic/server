var _new = require('lodash');
var moment = require('moment');
module.exports = {
    getImageAndCount: function( data ) {
        var logData = data[ 'searchData' ];
        return new Promise(function( resolve, reject ) {
            async.auto({
                createCondition: function( cb ) {
                    var searchQuery = [];
                    var newData, excludeKeywords;
                    if( data[ 'searchData' ] && Array.isArray(data[ 'searchData' ]) ) {
                        data[ 'searchData' ].map(function( item ) {
                            newData = new RegExp(item, 'ig');
                            searchQuery.push(newData);
                        });
                    } else {
                        newData = new RegExp(data[ 'searchData' ], 'ig');
                        searchQuery.push(newData);
                    }


                    var getData = [
                        { title: { $in: searchQuery } },
                        { direction: { $in: searchQuery } }
                    ];
                    if(data['excludeKeywords']){
                        excludeKeywords = new RegExp(data['excludeKeywords'], 'ig');
                        var excludeKeywordsData =[
                            { title: { $nin: [excludeKeywords] } },
                            { direction: { $nin:[ excludeKeywords] } }
                        ];

                        getData = getData.concat(excludeKeywordsData)
                    }

                    var finalData = [{$or : getData}]
                    var condition = {
                        isActive: true,
                        sort: "countOfClicks DESC",
                        skip: data[ 'skip' ] || 0,
                        limit: data[ 'limit' ] || 4,
                        safeMode: data[ 'safeMode' ] || ['Safe', '+12', '+16', '+18'],
                        $and: finalData,
                        imageType: data[ 'imageType' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ]
                    };


                    if(data['direction']){
                       condition.direction = data['direction'];
                    }
                    if(data['imageCategoryOwner']){
                       condition.imageCategoryOwner = data['imageCategoryOwner'];
                    }

                    if(data['newArrival']){
                        var dateFrom = moment().subtract(7,'d').format('YYYY-MM-DD');
                        var dateTo = moment().format('YYYY-MM-DD');
                        condition.createdAt = {$gte  :dateFrom, $lte : dateTo}
                    }

                    cb(null, condition);
                },
                getImage: [ "createCondition", function( cb, result ) {
                    Image.find(result.createCondition).exec(function( err, resp ) {
                        if( err ) {
                            reject(err);
                        } else {

                            cb(null, resp)
                        }

                    })
                } ],
                getCount: [ "createCondition", function( cb, result ) {
                    var countCondition = _new.clone(result.createCondition);
                    delete countCondition[ 'skip' ];
                    delete countCondition[ 'limit' ];
                    Image.count(countCondition).exec(function( err, resp ) {
                        if( err ) {
                            reject(err);
                        } else {

                            cb(null, resp)
                        }

                    })

                } ]
            }, function( err, results ) {
                var searchLog;
                if( logData && Array.isArray(logData) ) {
                    searchLog = logData[ 0 ];
                } else {
                    searchLog = logData;
                }

                var searchLogObject = {
                    searchArea: data[ 'imageType' ] || [ 'Image', 'Photo', 'Vector', 'Illustration', 'Icon' ],
                    title: searchLog
                };

                /**
                 * set log of search in imageSearch
                 * if exist , update hints
                 * else create it
                 */
                ImageSearchService.searchLog(searchLogObject, function( err, response ) {
                    if(err){
                        sails.log('searchLog Error : ', searchLog);
                    }else{
                        if(Array.isArray(response)){
                            sails.log('searchLog update Success : ', response[0]);
                        }else{
                            sails.log('searchLog create Success : ', response);
                        }
                    }
                });

                /**
                 * result of search
                 */
                resolve(results)
            })

        });
    },

    findAndCount: function(condition) {
        return new Promise(function(resolve, reject) {
            Image.findAndCount(condition).then(function(resp) {
                resolve(resp);
            }).catch(function(err) {
                reject(err);
            });
        });
    }
};