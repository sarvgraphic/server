/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is trigg/reered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    //  '/foo': [{policy: 'myPolicy'}, {blueprint: 'find', model: 'user'}]






    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/


    /**
     * ****************** start User *****************
     */

    'get /api/v1/users/find' : {
        controller : 'UserController',
        action: 'findUser'
    },
    'delete /api/v1/users/delete' : {
        controller : 'UserController',
        action: 'deleteUser'
    },
    'get /api/v1/users/:userId' : {
        controller : 'UserController',
        action: 'findOneUser'
    },
    'put /api/v1/users/update/:userId' : {
        controller : 'UserController',
        action: 'updateOneUser'
    },
    'get /api/v1/users/action/existUserName' : {
        controller : 'UserController',
        action: 'existUserName'
    },
    'get /api/v1/users/action/existEmail' : {
        controller : 'UserController',
        action: 'existEmail'
    },
    'post /api/v1/users/action/sign-up' : {
        controller : 'UserController',
        action: 'signUp'
    },
    'post /api/v1/users/action/create' : {
        controller: 'UserController',
        action: 'createUser'
    },
    'post /api/v1/users/action/login' : {
        controller : 'UserController',
        action: 'login'
    },
    'post /api/v1/users/action/logout' : {
        controller : 'UserController',
        action: 'logout'
    },
    'post /api/v1/users/action/upload_avatar' : {
        controller : 'UserController',
        action: 'uploadAvatar'
    },
    'get /api/v1/users/action/avatar/:userId' : {
        controller : 'UserController',
        action: 'avatar'
    },

    'post /api/v1/users/change_password' : {
        controller : 'UserController',
        action: 'changePassword'
    },



    'get /api/v1/imageCategory/action/get_image_category' : {
        controller : 'ImageCategoryController',
        action: 'getImageCategory'
    },
    'get /api/v1/imageCategory/action/get_top_image_category' : {
        controller : 'ImageCategoryController',
        action: 'getTopCategory'
    },

    'get /api/v1/imageCollection/action/image/:imgCollectionId' : {
        controller : 'ImageCollectionController',
        action: 'image'
    },

    'get /api/v1/imageCollection/action/get_top_featured' : {
        controller : 'ImageCollectionController',
        action: 'getTopFeatured'
    },

    'get /api/v1/imageCollection/action/findCollections' : {
        controller : 'ImageCollectionController',
        action: 'findCollections'
    },

    'get /api/v1/imageCollection/action/exist' : {
        controller : 'ImageCollectionController',
        action: 'exist'
    },

    'post /api/v1/imageCollection/action/create' : {
        controller : 'ImageCollectionController',
        action: 'create'
    },

    'post /api/v1/imageCollection/action/uploadImgCover' : {
        controller : 'ImageCollectionController',
        action: 'uploadImgCover'
    },
    
    'get /api/v1/imageCollection/action/get_featured' : {
        controller : 'ImageCollectionController',
        action: 'getFeatured'
    },

    'get /api/v1/imageCollection/action/findCollection' : {
        controller : 'ImageCollectionController',
        action: 'findCollection'
    },

    'delete /api/v1/imageCollection/action/destroy' : {
        controller : 'ImageCollectionController',
        action: 'destroy'
    },

    'post /api/v1/imageCollection/action/update' : {
        controller : 'ImageCollectionController',
        action: 'update'
    },

    'post /api/v1/imageCollection/action/saveImage' : {
        controller : 'ImageCollectionController',
        action: 'saveImage'
    },

    'get /api/v1/imageCollection/action/findImagesCollection' : {
        controller : 'ImageCollectionController',
        action: 'findImagesCollection'
    },

    'delete /api/v1/imageCollection/action/deletedImage' : {
        controller : 'ImageCollectionController',
        action: 'deletedImage'
    },

    'get /api/v1/imageOfWeek/action/get_image_of_week' : {
        controller : 'ImageOfWeekController',
        action: 'getImageOfWeek'
    },

    'post /api/v1/imageCategory/action/create' : {
        controller : 'ImageCategoryController',
        action: 'createImageCategory'
    },

    'post /api/v1/imageCategory/action/upload_cover' : {
        controller : 'ImageCategoryController',
        action: 'uploadCategoryCoverImage'
    },

    'get /api/v1/imageCategory/action/find_one' : {
        controller : 'ImageCategoryController',
        action: 'getOneImageCategory'
    },

    'get /api/v1/imageCategory/action/find' : {
        controller : 'ImageCategoryController',
        action: 'getAllImageCategory'
    },
    
    'get /api/v1/imageTag/action/get_top_image_tag' : {
        controller : 'ImageTagController',
        action: 'getTopTag'
    },

    'get /api/v1/imageTag/action/findTags' : {
        controller : 'ImageTagController',
        action: 'findTags'
    },

    'post /api/v1/imageTag/action/exist' : {
        controller : 'ImageTagController',
        action: 'exist'
    },

    'post /api/v1/imageTag/action/create' : {
        controller : 'ImageTagController',
        action: 'create'
    },

    'delete /api/v1/imageTag/action/destroy' : {
        controller : 'ImageTagController',
        action: 'destroy'
    },

    'get /api/v1/imageTag/action/findImageTag' : {
        controller : 'ImageTagController',
        action: 'findImageTag'
    },

    'post /api/v1/imageTag/action/update' : {
        controller : 'ImageTagController',
        action: 'update'
    },

    'get /api/v1/imageSearch/action/get_top_hits_image_search' : {
        controller : 'ImageSearchController',
        action: 'getTopHitsImageSearch'
    },

    'get /api/v1/imageSearch/action/get_top_editorial_choose_image' : {
        controller : 'ImageSearchController',
        action: 'getTopEditorialChooseImage'
    },

    'get /api/v1/imageSearch/action/get_top_editorial_choose' : {
        controller : 'ImageSearchController',
        action: 'getTopEditorialChoose'
    },

    'get /api/v1/image/action/createImageTag' : {
        controller : 'ImageController',
        action: 'createImageTag'
    },
    'get /api/v1/image/action/get_search' : {
        controller : 'ImageController',
        action: 'getSearch'
    },

    'post /api/v1/image/action/imageSearch' : {
        controller : 'ImageController',
        action: 'imageSearch'
    },

    'delete /api/v1/imageCategory/action/destroy/:id' : {
        controller : 'ImageCategoryController',
        action: 'destroyOneImageCategory'
    },

    'put /api/v1/imageCategory/action/update/:id' : {
        controller : 'ImageCategoryController',
        action: 'editOneImageCategory'
    },

    'get /api/v1/imageCategory/action/cover_image/:id' : {
        controller : 'ImageCategoryController',
        action: 'getImageCategoryCover'
    },




    'post /api/v1/image/action/create' : {
        controller : 'ImageController',
        action: 'createImage'
    },

    'post /api/v1/image/action/upload_image_file' : {
        controller : 'ImageController',
        action: 'uploadImage'
    },

    'get /api/v1/image/action/find_one' : {
        controller : 'ImageController',
        action: 'getOneImage'
    },

    'get /api/v1/image/action/find' : {
        controller : 'ImageController',
        action: 'getAllImage'
    },

    'delete /api/v1/image/action/destroy/:id' : {
        controller : 'ImageController',
        action: 'destroyOneImage'
    },

    'put /api/v1/image/action/update/:id' : {
        controller : 'ImageController',
        action: 'editOneImage'
    },

    'get /api/v1/image/action/image_file/:id' : {
        controller : 'ImageController',
        action: 'getImageFile'
    },



    'post /api/v1/publisher/action/create' : {
        controller : 'PublisherController',
        action: 'createPublisher'
    },

    'post /api/v1/publisher/action/upload_image_avatar' : {
        controller : 'PublisherController',
        action: 'uploadPublisherAvatar'
    },

    'post /api/v1/publisher/action/upload_image_cover' : {
        controller : 'PublisherController',
        action: 'uploadPublisherCover'
    },

    'get /api/v1/publisher/action/find_one' : {
        controller : 'PublisherController',
        action: 'getOnePublisher'
    },

    'get /api/v1/publisher/action/find' : {
        controller : 'PublisherController',
        action: 'getAllPublisher'
    },

    'delete /api/v1/publisher/action/destroy/:id' : {
        controller : 'PublisherController',
        action: 'destroyOnePublisher'
    },

    'put /api/v1/publisher/action/update/:id' : {
        controller : 'PublisherController',
        action: 'editOnePublisher'
    },

    'get /api/v1/publisher/action/publisher_avatar/:id' : {
        controller : 'PublisherController',
        action: 'getPublisherAvatar'
    },

    'get /api/v1/publisher/action/publisher_cover/:id' : {
        controller : 'PublisherController',
        action: 'getPublisherCover'
    },
    //'get /api/v1/imageTag/action/createImageTag' : {
    //    controller : 'ImageTagController',
    //    action: 'createImageTag'
    //}
    // 'get /api/v1/imageSearch/action/createImageSearch' : {
    //    controller : 'ImageSearchController',
    //    action: 'createImageSearch'
    //}
    
    /**
     * ****************** end User *****************
     */






};
