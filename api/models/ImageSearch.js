var ImageSearch = {
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


        searchArea : {
            type : 'array',
            required : true,
            defaultsTo : 'Photo'
        },


        isActive : {
            type : 'boolean',
            defaultsTo : true
        },


        isEditorialChoose : {
            type : 'boolean',
            defaultsTo : false
        },


        countOfHits : {
            type : 'integer',
            defaultsTo : 0
        }

    }
};

module.exports = ImageSearch;