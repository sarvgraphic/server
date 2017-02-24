
module.exports = {
    findAndCount: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageTag.findAndCount(condition).then(function(resp) {
                resolve(resp);
            }).catch(function(err) {
                reject(err);
            });
        });
    },
    
    find: function(condition) {
        return new Promise(function(resolve, reject) {
            ImageTag.find(condition).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    
    create: function(createObj) {
        return new Promise(function(resolve, reject) {
            ImageTag.create(createObj).exec(function(err, data) {
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
            ImageTag.destroy(condition).exec(function(err, data) {
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
            ImageTag.findOne(condition).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    
    update: function(condition, updateObj) {
        return new Promise(function(resolve, reject) {
            ImageTag.update(condition, updateObj).exec(function(err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};