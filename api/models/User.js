var User = {
    // Enforce model schema in the case of schemaless databases
    schema : true,

    attributes : {

        username : {
            type : 'string',
            required : true,
            unique : true
        },


        email : {
            type : 'email',
            required : true,
            unique : true
        },


        firstname : {
            type : 'string'
        },


        lastname : {
            type : 'string'
        },


        isActive : {
            type : 'boolean',
            defaultsTo : true
        },


        isAdmin : {
            type : 'boolean',
            defaultsTo : false
        },


        isBanned : {
            type : 'boolean',
            defaultsTo : false
        },


        isNewsletterSubscriber : {
            type : 'boolean',
            defaultsTo : true
        },


        phone : {
            type : 'string'
        },


        lastLogin : {
            type : 'datetime'
        },


        // ------------------------------------------------------------------------------------
        // sample structure :
        // ------------------------------------------------------------------------------------
        /*
         billingAddress : {
            'country' " '',
            'state' : '',
            'city' : '',
            'zipcode' : '',
            'addressLine1' : '',
            'addressLine2' : ''
         }
         */
        // ------------------------------------------------------------------------------------
        billingAddress : {
            type : 'json'
        },



        // ------------------------------------------------------------------------------------
        // sample structure :
        // ------------------------------------------------------------------------------------
        /*
         setting : {
             defaults : {
                'language' : 'en'
             }
         }
        */
        // ------------------------------------------------------------------------------------
        setting : {
            type : 'json'
        },


        imgAvatar : {
            type : 'string',
            defaultsTo : 'default.jpg'
        },


        imgAvatarFileDescriptor : {
            type : 'string'
        },


        resetPasswordExpireAt : {
            type : 'datetime'
        },


        resetPasswordToken : {
            type : 'string'
        },



        /*
         // related fields between users and passport library for authentication.
         // password field and social details tokens are in passport model and not need to included here
         */
        passports : {
            collection : 'Passport',
            via : 'user'
        },


        /*
        // Many To Many Relation with "VendorCategory" model
        */
        publishers: {
            collection: 'Publisher',
            via: 'users'
        }

    }
};

module.exports = User;
