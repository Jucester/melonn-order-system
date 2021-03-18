const { Router } = require('express');
const router = Router();
const { registerSeller, authSeller } = require('../controllers/users.controller');


router.post('/register', registerSeller);

router.post('/login', authSeller);

module.exports = router;