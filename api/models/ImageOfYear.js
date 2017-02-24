var ImageOfYear = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        year : {
            type : 'integer',
            required : true,
            defaultsTo : 2016
        },


        contentType: {
            type: 'string',
            enum: ['Photo', 'Vector', 'Illustration', 'Icon'],
            required : true,
            defaultsTo : 'Photo'
        },


        countOfDownload : {
            type : 'integer',
            defaultsTo : 0
        },


        image: {
            model: 'image'
        }

    }
};

module.exports = ImageOfYear;