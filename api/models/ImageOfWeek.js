var ImageOfWeek = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        year : {
            type : 'integer',
            required : true,
            defaultsTo : 2016
        },


        // week number that we according to current date determine it should be show or hide
        week : {
            type : 'integer',
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

module.exports = ImageOfWeek;