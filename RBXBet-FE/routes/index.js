const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const coinflipController = require('../controllers/coinflipController')
const expressQueue = require('express-queue');
const queueMw = expressQueue({ activeLimit: 1, queuedLimit: -1 });

/* GET home page. */
router.post('/signup', accountController.create_account_post)
router.post('/login', accountController.login_account_post)
router.get('/auto-login', accountController.authenticateToken, accountController.auto_login)
router.post('/coinflip/create', queueMw, accountController.authenticateToken, coinflipController.create_coinflip)
router.get('/coinflip/:id', coinflipController.view_coinflip)
router.post('/join/coinflip', queueMw, accountController.authenticateToken, coinflipController.join_coinflip)
module.exports = router;
