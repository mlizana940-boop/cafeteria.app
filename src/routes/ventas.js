const router = require('express').Router();
const ctrl   = require('../controllers/ventaController');
const auth   = require('../middlewares/authenticate');

router.get('/',          ctrl.getAll);
router.get('/:id',       ctrl.getOne);
router.post('/',         ctrl.create);
router.patch('/:id',     auth, ctrl.updateEstado);
router.delete('/:id',    auth, ctrl.remove);

module.exports = router;