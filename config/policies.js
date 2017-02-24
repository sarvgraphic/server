/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/

    // deny all, access with accessToken

    '*': [ 'tokenAuth' ],

    // access all

    User: {
        'existUserName': true,
        'existEmail': true,
        'signUp': true,
        'login': true,
        'logout' : true,
        
        
        //these functions must remove from policy
        'uploadAvatar' : true,
        'avatar' : true,
        'createUser' : true,
        'findUser' : true,
        'deleteUser' : true,
        'updateOneUser' : true,
        'findOneUser' : true,
        'changePassword' : true
    },

    ImageCategory : {
        'getImageCategory' : true,

        //these functions must remove from policy
        'createImageCategory' : true,
        'getOneImageCategory' : true,
        'uploadCategoryCoverImage' : true,
        'getAllImageCategory' : true,
        'getTopCategory':true,
        'destroyOneImageCategory' : true,
        'editOneImageCategory' : true,
        'getImageCategoryCover' : true
    },
    ImageCollection : {
        'getTopFeatured' : true,
        'findCollections' : true,
        'exist' : true,
        'create' : true,
        'uploadImgCover': true,
        'getFeatured': true,
        'destroy': true,
        'findCollection': true,
        'image': true,
        'update': true,
        'saveImage': true,
        'findImagesCollection': true,
        'deletedImage': true
    },
    ImageOfWeek : {
        'getImageOfWeek' : true
    },
    ImageTag : {
        'getTopTag' : true,
        'findTags': true,
        'exist': true,
        'create': true,
        'destroy': true,
        'findImageTag': true,
        'update': true
    },
    ImageSearch : {
        'createImageSearch' : true,
        'getTopHitsImageSearch' : true,
        'getTopEditorialChooseImage' : true,
        'getTopEditorialChoose' : true
    },

    Image : {
        'createImageTag' : true,
        'getSearch' : true,
        //these functions must remove from policy
        'createImage' : true,
        'getOneImage' : true,
        'uploadImage' : true,
        'getAllImage' : true,
        'destroyOneImage' : true,
        'editOneImage' : true,
        // 'getImageFIle' : true,
        'imageSearch': true,
        'getImageFile' : true
    },
    
    Publisher : {
        //these functions must remove from policy
        'createPublisher' : true,
        'getOnePublisher' : true,
        'uploadPublisherAvatar' : true,
        'uploadPublisherCover' : true,
        'getPublisherAvatar' : true,
        'getPublisherCover' : true,
        'getAllPublisher' : true,
        'destroyOnePublisher' : true,
        'editOnePublisher' : true
    }


};
