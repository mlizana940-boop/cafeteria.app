const { Producto, Venta, LineaVenta } = require('../models'); // ← sin User
const { Op } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalProductos   = await Producto.count();
    const stockBajo        = await Producto.count({ where: { stock: { [Op.lt]: 10 } } });
    const totalVentas      = await Venta.count();
    const ventasHoy        = await Venta.count({ where: { createdAt: { [Op.gte]: today } } });

    const ingresosTotales  = await Venta.sum('total') || 0;
    const ingresosHoy      = await Venta.sum('total', { where: { createdAt: { [Op.gte]: today } } }) || 0;

    const ultimasVentas = await Venta.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
      // ← sin include User (no existe esa relación en tu modelo)
    });

    const topProductos = await LineaVenta.findAll({
      attributes: [
        'ProductoId',
        [LineaVenta.sequelize.fn('SUM', LineaVenta.sequelize.col('cantidad')), 'totalVendido']
      ],
      group: ['ProductoId', 'Producto.id', 'Producto.nombre'],
      order: [[LineaVenta.sequelize.literal('totalVendido'), 'DESC']],
      limit: 3,
      include: [{ model: Producto, attributes: ['nombre'] }]
    });

    res.json({
      totalProductos,
      stockBajo,
      totalVentas,
      ventasHoy,
      ingresosTotales,
      ingresosHoy,
      ultimasVentas,
      topProductos
    });
  } catch (error) {
    console.error('Dashboard error:', error); // ← más detalle en consola
    res.status(500).json({ error: 'Error al obtener datos del dashboard', detalle: error.message });
  }
};

module.exports = { getDashboard };