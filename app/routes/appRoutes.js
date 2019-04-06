'use strict';

module.exports = (app) => {
    var verifToken = require('./../middlewares/verifToken');
    var userController = require('./../controllers/userController');
    var eventController = require('./../controllers/eventController');

    app.get('/', (req, res) => res.send('Welcome to Api-JO'));

    app.route('/users')
        .get(userController.getAllUsers)
        .post(userController.register);

    app.route('/users/:id')
        .get(userController.viewUser)
        .post(userController.updateUser)
        .delete(userController.deleteUser);

    app.route('/login')
        .post(userController.login);

    app.route('/events')
        .get(verifToken, eventController.getAllEvents)
        // .get(eventController.getAllEvents)
        .post(eventController.new);

    app.route('/events/:id')
        .get(eventController.viewEvent)
        .post(eventController.updateEvent)
        .delete(eventController.deleteEvent);
}