const { Producto } = require('../models');

exports.listar = async () => {
  return Producto.findAll({ where: { activo: true } });
};

exports.obtener = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw { status: 404, msg: 'No encontrado' };
  return producto;
};

exports.crear = async (data) => {
  return Producto.create(data);
};

exports.actualizar = async (id, data) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw { status: 404, msg: 'No encontrado' };
  return producto.update(data);
};

// Soft-delete: desactiva el producto en lugar de eliminarlo físicamente
exports.desactivar = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw { status: 404, msg: 'No encontrado' };
  await producto.update({ activo: false });
  return { mensaje: 'Producto desactivado' };
};