const { Producto } = require('../models');

exports.getAll = async (req, res) => {
  const productos = await Producto.findAll({ where: { activo: true } });
  res.json(productos);
};

exports.getOne = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'No encontrado' });
  res.json(producto);
};

exports.create = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: 'Validación fallida',
        message: 'Los campos nombre, precio y stock son requeridos'
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }

    if (Number(precio) < 0) {
      return res.status(400).json({ error: 'El precio no puede ser negativo' });
    }

    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'No encontrado' });

  if (req.body.stock !== undefined && Number(req.body.stock) < 0) {
    return res.status(400).json({ error: 'El stock no puede ser negativo' });
  }

  if (req.body.precio !== undefined && Number(req.body.precio) < 0) {
    return res.status(400).json({ error: 'El precio no puede ser negativo' });
  }

  await producto.update(req.body);
  res.json(producto);
};

exports.remove = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'No encontrado' });
  await producto.destroy();
  res.json({ mensaje: 'Producto eliminado' });
};