var Image = {
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


        imageType : {
            type : 'string',
            required : true,
            enum : ['Photo', 'Vector', 'Illustration', 'Icon'],
            defaultsTo : 'Photo'
        },


        direction: {
            type: 'string',
            enum: ['Vertical', 'Horizontal'],
            defaultsTo : 'Horizontal'
        },


        safeMode: {
            type: 'string',
            enum: ['Safe', '+12', '+16', '+18'],
            required : true,
            defaultsTo : 'Safe'
        },


        description : {
            type : 'text'
        },


        isActive : {
            type : 'boolean',
            defaultsTo : true
        },


        img : {
            type : 'string'
        },


        imgFileDescriptor : {
            type : 'string'
        },


        // all available size of this Image will listed here
        // ------------------------------------------------------------------------------------
        // sample structure :
        // ------------------------------------------------------------------------------------
        /*
         items : [
             {
                'title' : 'string',
                'pixelSize' : 'string',
                'inchSize' : 'string',
                'dpi' : integer,
                'fileSize' : integer  // in byte format,
                'imgFile' : 'string',
                'imgFileDescriptor' : 'string'
             }
         ]
         */
        // ------------------------------------------------------------------------------------
        items: {
            type: 'array'
        },


        countOfDownloads : {
            type : 'integer',
            defaultsTo : 0
        },


        countOfClicks : {
            type : 'integer',
            defaultsTo : 0
        },


        /**
         * One to Many relation with "ImageCategory" model. many Images can be defined for an ImageCategory
         */
        imageCategoryOwner : {
            model : "ImageCategory"
        },


        /**
         * One to Many relation with "Publisher" model. many Images can be defined for a Publisher
         */
        publisherOwner : {
            model : "Publisher"
        },


        /*
         // Many To Many Relation with "ImageTag" model
         */
        tags: {
            collection: 'ImageTag',
            via: 'images',
            dominant: true
        },


        /*
         // Many To Many Relation with "ImageCollection" model
         */
        collections: {
            collection: 'ImageCollection',
            via: 'images'
        }


    }
};

module.exports = Image;