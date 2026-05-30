const router = require('express').Router();
const ctrl   = require('../controllers/ventaController');

router.get('/',          ctrl.getAll);
router.get('/:id',       ctrl.getOne);
router.post('/',         ctrl.create);
router.patch('/:id',     ctrl.updateEstado);

module.exports = router;