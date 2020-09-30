const { Router } = require('express');
const checkToken = require('../middleware/auth');
const router = Router();

router.use('/entry', require('./entry'));
router.use('/songs', checkToken, require('./songs'));
router.use('/albums', checkToken, require('./albums'));
router.use('/artists', checkToken, require('./artists'));
router.use('/users', checkToken, require('./users'));
router.use('/playlists', checkToken, require('./playlists'));

module.exports = router;



