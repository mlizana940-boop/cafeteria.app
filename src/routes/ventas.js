const router   = require('express').Router();
const ctrl     = require('../controllers/ventaController');
const auth     = require('../middlewares/authenticate');
const admin    = require('../middlewares/adminAuth');

router.get('/',       auth, admin, ctrl.getAll);
router.get('/:id',    auth, admin, ctrl.getOne);
router.post('/',      auth,           ctrl.create);
router.patch('/:id',  auth, admin, ctrl.updateEstado);
router.delete('/:id', auth, admin, ctrl.remove);

module.exports = router;