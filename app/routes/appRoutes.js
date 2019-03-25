'use strict';

module.exports = function(app) {
    // var todoList = require('../controllers/appController');

    // todoList Routes
    // app.route('/tasks')
    //     .get(todoList.list)
    //     .post(todoList.new);

    // app.route('/tasks/:taskId')
    //     .get(todoList.read_a_task)
    //     .put(todoList.update_a_task)
    //     .delete(todoList.delete_a_task);

    // app.get('/users', (req, res) => res.send('Welcome to ECS_REST_API with Express'));

    var user = require('./../controllers/userController');
    app.route('/users')
        .get(user.index)
        .post(user.new);
    app.route('/login')
        .post(user.login);

    var event = require('./../controllers/eventController');
    app.route('/events')
        .get(event.index)
        .post(event.new);

    app.get('/toto', (req, res) => res.send('Welcome toto'));




}