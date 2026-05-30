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
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'No encontrado' });
  await producto.update(req.body);
  res.json(producto);
};

exports.remove = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'No encontrado' });
  await producto.update({ activo: false });
  res.json({ mensaje: 'Producto desactivado' });
};