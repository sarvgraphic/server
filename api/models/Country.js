var Country = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        name : {
            type : 'string',
            unique : true,
            required : true
        },


        abbreviation: {
            type: 'string'
        },


        geoLocation: {
            type: 'json'
        },


        isActive: {
            type: 'boolean',
            defaultsTo: true
        }

    }
};

module.exports = Country;
