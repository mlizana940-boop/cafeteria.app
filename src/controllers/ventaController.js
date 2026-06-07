const { Venta, LineaVenta, Producto, sequelize } = require('../models');

exports.getAll = async (req, res) => {
  const ventas = await Venta.findAll({ include: LineaVenta });
  res.json(ventas);
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
    const { lineas } = req.body;

    if (!lineas || !lineas.length)
      return res.status(400).json({ error: 'Se requiere al menos una línea' });

    const venta = await Venta.create({ total: 0 }, { transaction: t });
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
      await Venta.findByPk(venta.id, { include: LineaVenta })
    );
  } catch (e) {
    await t.rollback();
    res.status(e.status || 400).json({ error: e.msg || e.message });
  }
};

exports.updateEstado = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  if (!venta) return res.status(404).json({ error: 'No encontrada' });
  await venta.update({ estado: req.body.estado });
  res.json(venta);
};