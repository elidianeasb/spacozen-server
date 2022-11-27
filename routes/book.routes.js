const router = require('express').Router();
const Book = require('../models/Book.model');
const User = require('../models/User.model');
const Service = require('../models/Service.model')
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { Types } = require("mongoose");

router.post('/books', isAuthenticated, (req, res, next) => {
    const { name, local, date, contact, service } = req.body;
    const userId = req.payload._id

    Book.create({ name, local, contact, date, service, user: userId })
        .then(response => res.json(response))
        .catch(err => res.json(err));
})

router.get('/books', isAuthenticated, (req, res, next) => {
    const authenticatedUser = req.payload._id
    User.findById(authenticatedUser)
        .then(user => {
            if (user.accountType === "client") {
                Book.find({ user: Types.ObjectId(authenticatedUser) })
                    .populate('service')
                    .then(allBooks => res.json(allBooks))
                    .catch(err => res.json(err));
            } else if (user.accountType === "admin") {
                Book.find()
                    .populate('service')
                    .then(allBooks => res.json(allBooks))
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
})


module.exports = router;


