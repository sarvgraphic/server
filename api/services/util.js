var fs = require('fs');

module.exports = {
    deleteFile : function(filePath) {
        if (filePath && filePath.length > 0) {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                }
            } catch (e) {
            }
        }
    },

    convertSailsConditionToMongo : condition => {
        return new Promise( resolve => {
            if (!condition) resolve(undefined);
            //dont allow remove regex when stringify object
            RegExp.prototype.toJSON = function() { return  {'$regex': this.source}; };
            var t = JSON.stringify(condition).replace(/\\/g,'');
            t = t.replace(/\"temp\":/g,'"\$and"\:').replace(/\"or\":/g,'"\$or":')
                 .replace(/(\{\"contains\"):([\s\w\"-_]*(}))/ig,'SS$2SSS')
                 .replace(/\"}SSS/g,'\/ig\]}').replace(/SS\"/g,'\\{\$in\:[\/')
                 .replace(/\"\<\=\"/g,'\$lte').replace(/\"\>\=\"/g,'\$gte')
                 .replace(/\\"\<\"/g,'\$lt').replace(/\\"\>\"/g,'\$gt')
                 .replace(/\=/g,'\$eq').replace(/\\/g,'')
                 .replace(/\"{/g,'{').replace(/\}\"/g,'}').replace(/\/\/(ig)/ig, '""')
                 .replace(/\//g, '\\/').replace(/\*/g, '\\*').replace(/\./g, '\\.').replace(/\+/g, '\\+')
                 .replace(/\\\/(ig)/g, '\/ig').replace(/\[\\\//ig, '[\/');

            t= eval("(" + t + ")");

            resolve(t);
        })
    },

    /**
     * convert string parameters to integer from model
     * @param query Object a condition for model
     * @param model String model name for convert string fields to integer
     * @description when parameters get from query string some where like datalink apis
     */
    intModel: (query, model) => {
        var modelAttributes = sails.models[model.toLowerCase()] && sails.models[model.toLowerCase()].definition;
        if (!modelAttributes) {
            return query;
        }
        (function loop(query){
            for (var i in query) {
                if (typeof query[i] == 'object') {
                    loop(query[i]);
                } else if (Array.isArray(query[i])) {
                    loop(query[i]);
                } else {
                    // convert api condition to mongo condition fields
                    if (['lte', 'gte', 'lt', 'gt', 'eq', 'in', 'nin', 'ne', 'not'].indexOf(i) > -1) {
                        i = '$'+ i;
                        query[i] = query[i.slice(1)];
                        delete query[i.slice(1)];
                    }

                    if (['like'].indexOf(i) > -1) {
                        i = '$regex';
                        query[i] = query['like'];
                        delete query['like'];
                    }

                    if (isNaN(i) && ['$lte', '$gte', '$lt', '$gt', '$eq'].indexOf(i) > -1 && !isNaN(query[i])) {
                        query[i] = parseFloat(query[i]);
                    } else if (['$lte', '$gte', '$lt', '$gt', '$eq'].indexOf(i) > -1 && new Date(query[i]).toString() != 'Invalid Date') {
                        if (i == '$lte') {
                            // @Todo needs to optimize and get time zone offset from mongo server
                            var date = new Date(query[i]);
                            date.setDate(date.getDate() + 1);
                            query[i] = date;
                        } else {
                            query[i] = new Date(query[i]);
                        }
                    } else {

                        // convert objectid string to ObjectId in mongo
                        if ( query[i] && query[i].match && query[i].match(new RegExp("^[0-9a-fA-F]{24}$", "g"))) {
                            query[i] = new require('mongodb').ObjectID(query[i]);
                        }

                        // check if i is integer
                        if (modelAttributes[i] && ['integer', 'double', 'float'].indexOf(modelAttributes[i].type) > -1) {
                            query[i] = parseFloat(query[i]);
                        }

                        // change id to _id
                        if (i == 'id') {
                            query['_id'] = query[i];
                            delete query.id;
                        }

                    }
                }
            }
        }(query));

        return query;
    },

    generateUniqueFieldValue : (model, field, title, index, oldTitle, callback) => {
        var condition = {};
        var theTitle = title;
        if (index > 0) {
            theTitle = oldTitle.replace(/[^a-z0-9_-]/gi, '-') + ((index == 0) ? "" : "-" + index);
        }
        condition[field] = theTitle;
        sails.models[model.toLowerCase()].find(condition).exec((err, items) => {
            if (items.length == 0) {
                callback(theTitle);
            } else {
                return util.generateUniqueFieldValue(model, field, theTitle, index + 1, oldTitle, callback);
            }
        });
    },
    
};