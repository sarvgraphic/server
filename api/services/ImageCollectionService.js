
module.exports = {
    find: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageCollection.find(condition).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    
    create: function(createObject) {
        return new Promise(function(resolve, reject) {
            ImageCollection.create(createObject).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    
    update: function(condition, updateObject) {
        return new Promise(function(resolve, reject) {
            ImageCollection.update(condition, updateObject).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    
    destroy: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageCollection.destroy(condition).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },

    findOne: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageCollection.findOne(condition).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },

    findAndCount: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageCollection.findAndCount(condition).then(function(resp) {
                resolve(resp);
            }).catch(function(err) {
                reject(err);
            });
        });
    },
    
    findAndPopulate: function(condition, populate) {
        return new Promise(function(resolve, reject) {
            ImageCollection.find(condition).populate(populate).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};