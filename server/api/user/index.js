'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/'/*, auth.hasRole('admin')*/, controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/', controller.create);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/:id/categories', /*auth.isAuthenticated(),*/controller.updateCategories);
router.get('/:id/categories', /*auth.isAuthenticated(),*/controller.getCategories);
router.post('/:id/frequencies', /*auth.isAuthenticated(),*/controller.updateFrequencies);
router.get('/:id/frequencies', /*auth.isAuthenticated(),*/controller.getFrequencies);

module.exports = router;