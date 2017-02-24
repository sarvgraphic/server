var ImageTag = {
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


        isActive : {
            type : 'boolean',
            defaultsTo : true
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
            via: 'tags'
        }


    }
};

module.exports = ImageTag;
