const { Venta, LineaVenta, Producto, sequelize } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { desde, hasta } = req.query;
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

    const ventas = await Venta.findAll({
      where,
      include: [{ model: LineaVenta, include: [Producto] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(ventas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getOne = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id, {
    include: [{ model: LineaVenta, include: [Producto] }],
  });
  if (!venta) return res.status(404).json({ error: 'No encontrada' });
  res.json(venta);
};

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { lineas, metodo_pago = 'efectivo' } = req.body;

    if (!lineas || !lineas.length)
      return res.status(400).json({ error: 'Se requiere al menos una línea' });

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

      await producto.update(
        { stock: producto.stock - linea.cantidad },
        { transaction: t }
      );
    }

    await venta.update({ total }, { transaction: t });
    await t.commit();

    res.status(201).json(
      await Venta.findByPk(venta.id, { include: [{ model: LineaVenta, include: [Producto] }] })
    );
  } catch (e) {
    await t.rollback();
    res.status(e.status || 400).json({ error: e.msg || e.message });
  }
};

exports.updateEstado = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  if (!venta) return res.status(404).json({ error: 'No encontrada' });
  const estadosValidos = ['pendiente', 'completada', 'cancelada'];
  if (!estadosValidos.includes(req.body.estado))
    return res.status(400).json({ error: 'Estado no válido' });
  await venta.update({ estado: req.body.estado });
  res.json(venta);
};

exports.remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [LineaVenta],
      transaction: t,
    });
    if (!venta) return res.status(404).json({ error: 'No encontrada' });

    // Restaurar stock de cada producto
    for (const linea of venta.LineaVenta) {
      const producto = await Producto.findByPk(linea.ProductoId, { transaction: t });
      if (producto) {
        await producto.update(
          { stock: producto.stock + linea.cantidad },
          { transaction: t }
        );
      }
    }

    await LineaVenta.destroy({ where: { VentaId: venta.id }, transaction: t });
    await venta.destroy({ transaction: t });
    await t.commit();

    res.json({ mensaje: 'Venta eliminada y stock restaurado' });
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
};