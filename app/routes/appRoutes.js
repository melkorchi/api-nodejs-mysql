'use strict';

module.exports = (app) => {

    var verifToken = require('./../middlewares/verifToken');

    var userController = require('./../controllers/userController');
    app.route('/users')
        .get(userController.getAllUsers)
        .post(userController.register);

    app.route('/users/:id')
        .get(userController.viewUser)
        .post(userController.updateUser)
        .delete(userController.deleteUser);

    app.route('/login')
        .post(userController.login);

    var eventController = require('./../controllers/eventController');
    app.route('/events')
        // .get(verifToken, eventController.index)
        .get(verifToken, eventController.getAllEvents)
        .post(eventController.new);

    app.route('/events/:id')
        .get(eventController.viewEvent)
        .post(eventController.updateEvent)
        .delete(eventController.deleteEvent);

}