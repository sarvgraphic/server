var City = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {


        country: {
            type : 'string',
            required : true
        },


        state: {
            type : 'string',
            required : true
        },


        name : {
            type : 'string',
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

module.exports = City;