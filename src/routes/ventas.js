const router = require('express').Router();
const ctrl   = require('../controllers/ventaController');
const auth   = require('../middlewares/authenticate');

router.get('/',       auth, ctrl.getAll);
router.get('/:id',    auth, ctrl.getOne);
router.post('/',      auth, ctrl.create);
router.patch('/:id',  auth, ctrl.updateEstado);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;