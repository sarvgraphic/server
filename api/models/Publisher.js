var Publisher = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        key : {
            type : "string",
            unique : true,
            required : true
        },


        title : {
            type : 'string',
            required : true,
            unique : true
        },


        // valid values are : 'Image', 'Video', 'Audio'
        typeOfPublication : {
            type : 'array'
        },


        about : {
            type : 'text'
        },


        imgAvatar : {
            type : 'string'
        },


        imgAvatarFileDescriptor : {
            type : 'string'
        },


        imgCover : {
            type : 'string'
        },


        imgCoverFileDescriptor : {
            type : 'string'
        },


        isActive: {
            type: 'boolean',
            defaultsTo: false
        },


        isExpired: {
            type: 'boolean',
            defaultsTo: false
        },


        isPending: {
            type: 'boolean',
            defaultsTo: true
        },


        countOfImageItems : {
            type : 'integer',
            defaultsTo : 0
        },


        countOfImageActiveItems : {
            type : 'integer',
            defaultsTo : 0
        },


        countOfClicks : {
            type : 'integer',
            defaultsTo : 0
        },


        /*
         // Many To Many Relation with "User" model
         */
        users: {
            collection: 'User',
            via: 'publishers',
            dominant: true
        },


        /**
         * One to Many relation with "Images" model. a Publisher can have many Images
         */
        imageOwners: {
            collection : "Image",
            via : "publisherOwner"
        }

    }
};

module.exports = Publisher;
