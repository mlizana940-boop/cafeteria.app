const router   = require('express').Router();
const ctrl     = require('../controllers/productoController');
const auth     = require('../middlewares/authenticate');
const admin    = require('../middlewares/adminAuth');

router.get('/',                 ctrl.getAll);
router.get('/:id',              ctrl.getOne);
router.post('/',      auth, admin, ctrl.create);
router.put('/:id',    auth, admin, ctrl.update);
router.delete('/:id', auth, admin, ctrl.remove);

module.exports = router;