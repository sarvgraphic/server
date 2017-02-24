/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

'use strict';
module.exports.models = {
    /**
     *
     * @param condition
     * @param fieldList
     * @param populteCond Object like {migrateSourceOwner: {adminOwner:1}, flowOwner:1}
     * @returns {Promise}
     */
    findAndCount: function(condition, fieldList, populteCond) {
        return new Promise( (_resolve, _reject) => {
            populteCond = populteCond || {};
        var pagination = {
            skip: parseInt(condition.skip) || 0,
            limit: parseInt(condition.limit) || 9000000000
        };
        var sort = condition.sort || {};
        if (typeof sort == 'string') {
            var _sort = sort.split(' ');
            sort = {};
            if (_sort.length && _sort.length == 2) {
                sort[_sort[0]] = _sort[1].toLowerCase() == 'desc' ? 0 : 1;
            } else {
                sort[_sort[0]] = 1;
            }
        }
        for (var i in sort) {
            if (sort[i] == 0) {
                sort[i] = -1;
            }
        }
        delete condition.sort;
        delete condition.skip;
        delete condition.limit;
        fieldList = fieldList || {};
        condition = condition || {};

        util.convertSailsConditionToMongo(condition)
            .then( mongoCondition => {
            mongoCondition = util.intModel(mongoCondition, this.adapter.identity);
        // sails.log(mongoCondition, 'after convert intModel');
        sails.models[this.adapter.identity]
            .native( (err, collection) => {
            Promise.all([
                       (function find() {
                           return new Promise(function (resolve, reject) {
                               collection.find(mongoCondition, fieldList)
                                         .limit(pagination.limit)
                                         .skip(pagination.skip)
                                         .sort(sort)
                                         .toArray(function (err, list) {
                                             sails.log(err, list.length)
                                             if (err) {
                                                 reject(err);
                                             }
                                             resolve(list);
                                         })
                           })
                       }())
                       ,
                       (function count() {
                           return new Promise(function (resolve, reject) {
                               collection.count(mongoCondition,
                                   function (err, total) {
                                       sails.log(err, total)

                                       if (err) {
                                           reject(err);
                                       }
                                       resolve(total);
                                   })
                           })
                       }())
                   ])
                   .then( listAndCount => {
            if (Object.keys(populteCond).length) {
            var populateCondition = {};
            (function loop(populteCond, level) {
                for (var i in populteCond) {
                    if (typeof populteCond[i] == 'object') {
                        if (level == 1) {
                            populateCondition[i] = listAndCount[0].map(item => item[i]);
                        }
                        loop(populteCond[i], level + 1);
                    } else {
                        if (level == 1) {
                            populateCondition[i] = listAndCount[0].map(item => item[i]);
                        }
                    }
                }
            }(populteCond, 1));

            var queries = {};
            for (let i in populateCondition) {
                queries[Symbol(i)] = (listAndCount) => {
                    return new Promise( presolve => {
                            sails.models[this.adapter.query.definition[i].model]
                            .find({id: populateCondition[i]})
                            .exec( (err, list) => {
                            listAndCount[0] = listAndCount[0].map( item => {
                                    item[i] = list.filter( fitem => fitem.id.toString() == item[i].toString())[0];
                    return item;
                });
                    presolve(list);
                });
                });
                }
            }

            Promise.all(
                Object.getOwnPropertySymbols(queries).map(item => queries[item](listAndCount))
        ).then(populated => {
                _resolve({
                    list: listAndCount[0],
                    total: listAndCount[1]
                })
            });


            // console.log(populateCondition, 'populate list id');


        } else {
            _resolve({
                list: listAndCount[0],
                total: listAndCount[1]
            })
        }
    }, function(err) {
            _reject(err);
        })
    })

    })
    });

    },
    /***************************************************************************
     *                                                                          *
     * Your app's default connection. i.e. the name of one of your app's        *
     * connections (see `config/connections.js`)                                *
     *                                                                          *
     ***************************************************************************/
    //connection: 'devMongodbServer',

    /***************************************************************************
     *                                                                          *
     * How and whether Sails will attempt to automatically rebuild the          *
     * tables/collections/etc. in your schema.                                  *
     *                                                                          *
     * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
     *                                                                          *
     ***************************************************************************/
    migrate : 'alter'

};
