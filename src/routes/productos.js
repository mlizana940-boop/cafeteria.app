const router = require('express').Router();
const ctrl   = require('../controllers/productoController');
const auth   = require('../middlewares/authenticate');

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getOne);
router.post('/',      auth, ctrl.create);
router.put('/:id',    auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;