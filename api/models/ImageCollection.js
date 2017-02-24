var ImageCollection = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        key : {
            type : "string",
            unique : true,
            required : true
        },


        contentType: {
            type: 'string',
            enum: ['Photo', 'Vector', 'Illustration', 'Icon'],
            required : true,
            defaultsTo : 'Photo'
        },


        title : {
            type : 'string',
            required : true,
            unique : true
        },


        description : {
            type : 'text'
        },


        isActive : {
            type : 'boolean',
            defaultsTo : true
        },


        // show in collection of landing page
        isTopFeatured : {
            type : 'boolean',
            defaultsTo : false
        },


        // show in collection of that specific content type page
        isFeatured : {
            type : 'boolean',
            defaultsTo : false
        },


        imgCover : {
            type : 'string'
        },


        imgCoverFileDescriptor : {
            type : 'string'
        },


        countOfItems : {
            type : 'integer',
            defaultsTo : 0
        },


        countOfActiveItems : {
            type : 'integer',
            defaultsTo : 0
        },


        countOfClicks : {
            type : 'integer',
            defaultsTo : 0
        },


        /*
         // Many To Many Relation with "Image" model
         */
        images: {
            collection: 'Image',
            via: 'collections',
            dominant: true
        }

    }
};

module.exports = ImageCollection;