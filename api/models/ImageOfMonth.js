var ImageOfMonth = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        year : {
            type : 'integer',
            required : true,
            defaultsTo : 2016
        },


        // month number that we according to current date determine it should be show or hide
        month : {
            type : 'integer',
            enum : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            required : true,
            defaultsTo : 1
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

module.exports = ImageOfMonth;