//require('newrelic');

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

/*    VendorImageCollection.find({}).exec((err, collectionItems)=> {
        var thumbPath = process.cwd() + "/.tmp/public/uploads/vendors/Adesso/imageCollections/thumbnails/";
        collectionItems.forEach(function(entry) {
            console.log(entry.imgCoverFileDescriptor, entry.imgCover);
            util.createThumbnail(entry.imgCoverFileDescriptor, thumbPath, entry.imgCover, 256);
            if(entry.items) {
                entry.items.forEach(function (item) {
                    console.log(item.imgFileDescriptor, item.img);
                    util.createThumbnail(item.imgFileDescriptor, thumbPath, item.img, 256);
                });
            }
        });
    });*/

    //sails.services.passport.loadStrategies();

    /*
        sails.io.on('connection', function (socket) {


        sails.sockets.join(socket, sails.config.globals.rooms.visitors);
        sails.sockets.blast('countOfClients', app.response.success(sails.io.engine.clientsCount));
        sails.sockets.blast('countOfVisitors', app.response.success(_.size(sails.sockets.subscribers(sails.config.globals.rooms.visitors))));
        console.log('connect a socket',
            'client count : ' + sails.io.engine.clientsCount,
            'online member count : ' + _.size(sails.sockets.subscribers(sails.config.globals.rooms.users)),
            'online visitors : ' + _.size(sails.sockets.subscribers(sails.config.globals.rooms.visitors)));


        // TODO : if there is a token ID, find the USER from that and according
        // to that USER , update the SOCKETID


        socket.on('disconnect', function () {
            sails.sockets.blast('countOfClients', app.response.success(sails.io.engine.clientsCount));

            sails.sockets.leave(socket, sails.config.globals.rooms.visitors);
            sails.sockets.blast('countOfVisitors', app.response.success(_.size(sails.sockets.subscribers(sails.config.globals.rooms.visitors))));

            sails.sockets.leave(socket, sails.config.globals.rooms.users);
            sails.sockets.blast('countOfOnlineMembers', app.response.success(_.size(sails.sockets.subscribers(sails.config.globals.rooms.users))));

            console.log('disconnect a socket',
                'client count : ' + sails.io.engine.clientsCount,
                'online member count : ' + _.size(sails.sockets.subscribers(sails.config.globals.rooms.users)),
                'online visitors : ' + _.size(sails.sockets.subscribers(sails.config.globals.rooms.visitors))
            );


            // TODO : remove SOCKETID from USER model


        });


    });
 */


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
