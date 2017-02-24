var ImageCategory = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {

        key: {
            type: "string",
            unique: true,
            required: true
        },

        title: {
            type: 'string',
            required: true,
            unique: true
        },

        description: {
            type: 'text'
        },

        isActive: {
            type: 'boolean',
            defaultsTo: true
        },

        imgCover: {
            type: 'string'
        },

        imgCoverFileDescriptor: {
            type: 'string'
        },

        countOfItems: {
            type: 'integer',
            defaultsTo: 0
        },

        countOfActiveItems: {
            type: 'integer',
            defaultsTo: 0
        },

        countOfClicks: {
            type: 'integer',
            defaultsTo: 0
        },

        contentType: {
            type: 'string',
            enum: [ 'Photo', 'Vector', 'Illustration', 'Icon' ],
            required: true,
            defaultsTo: 'Photo'
        },

        /**
         * One to Many relation with "Images" model. an ImageCategory can have many Images
         */
        imageOwners: {
            collection: "Image",
            via: "imageCategoryOwner"
        }

    }
};

module.exports = ImageCategory;


