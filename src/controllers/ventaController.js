const { Venta, LineaVenta, Producto } = require('../models');

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
  try {
    const { lineas } = req.body;
    let total = 0;
    const venta = await Venta.create({ total: 0 });

    for (const linea of lineas) {
      const producto = await Producto.findByPk(linea.ProductoId);
      if (!producto) throw new Error(`Producto ${linea.ProductoId} no existe`);
      const subtotal = producto.precio * linea.cantidad;
      total += subtotal;
      await LineaVenta.create({
        VentaId: venta.id,
        ProductoId: linea.ProductoId,
        cantidad: linea.cantidad,
        precio_unitario: producto.precio,
        subtotal,
      });
    }

    await venta.update({ total });
    res.status(201).json(await Venta.findByPk(venta.id, { include: LineaVenta }));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.updateEstado = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  if (!venta) return res.status(404).json({ error: 'No encontrada' });
  await venta.update({ estado: req.body.estado });
  res.json(venta);
};