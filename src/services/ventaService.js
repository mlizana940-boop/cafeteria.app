const { Venta, LineaVenta, Producto, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.listar = async ({ desde, hasta } = {}) => {
  const where = {};
  if (desde || hasta) {
    where.createdAt = {};
    if (desde) where.createdAt[Op.gte] = new Date(desde);
    if (hasta) {
      const fin = new Date(hasta);
      fin.setHours(23, 59, 59, 999);
      where.createdAt[Op.lte] = fin;
    }
  }
  return Venta.findAll({
    where,
    include: [{ model: LineaVenta, include: [Producto] }],
    order: [['createdAt', 'DESC']],
  });
};

exports.obtener = async (id) => {
  const venta = await Venta.findByPk(id, {
    include: [{ model: LineaVenta, include: [Producto] }],
  });
  if (!venta) throw { status: 404, msg: 'No encontrada' };
  return venta;
};

exports.crear = async ({ lineas, metodo_pago = 'efectivo' }) => {
  if (!lineas || !lineas.length)
    throw { status: 400, msg: 'Se requiere al menos una línea' };

  const t = await sequelize.transaction();
  try {
    const venta = await Venta.create({ total: 0, metodo_pago }, { transaction: t });
    let total = 0;

    for (const linea of lineas) {
      const producto = await Producto.findByPk(linea.ProductoId, { transaction: t });

      if (!producto || !producto.activo)
        throw { status: 404, msg: `Producto ${linea.ProductoId} no encontrado` };

      if (producto.stock < linea.cantidad)
        throw { status: 409, msg: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}` };

      const subtotal = producto.precio * linea.cantidad;
      total += subtotal;

      await LineaVenta.create({
        VentaId:         venta.id,
        ProductoId:      linea.ProductoId,
        cantidad:        linea.cantidad,
        precio_unitario: producto.precio,
        subtotal,
      }, { transaction: t });

      await producto.update({ stock: producto.stock - linea.cantidad }, { transaction: t });
    }

    await venta.update({ total }, { transaction: t });
    await t.commit();

    return Venta.findByPk(venta.id, {
      include: [{ model: LineaVenta, include: [Producto] }],
    });
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

exports.actualizarEstado = async (id, estado) => {
  const estadosValidos = ['pendiente', 'completada', 'cancelada'];
  if (!estadosValidos.includes(estado))
    throw { status: 400, msg: 'Estado no válido' };

  const venta = await Venta.findByPk(id);
  if (!venta) throw { status: 404, msg: 'No encontrada' };
  return venta.update({ estado });
};

exports.eliminar = async (id) => {
  const t = await sequelize.transaction();
  try {
    const venta = await Venta.findByPk(id, {
      include: [LineaVenta],
      transaction: t,
    });
    if (!venta) throw { status: 404, msg: 'No encontrada' };

    for (const linea of venta.LineaVenta) {
      const producto = await Producto.findByPk(linea.ProductoId, { transaction: t });
      if (producto) {
        await producto.update({ stock: producto.stock + linea.cantidad }, { transaction: t });
      }
    }

    await LineaVenta.destroy({ where: { VentaId: venta.id }, transaction: t });
    await venta.destroy({ transaction: t });
    await t.commit();
    return { mensaje: 'Venta eliminada y stock restaurado' };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};