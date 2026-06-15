const { Producto, Venta, LineaVenta } = require('../models');
const { Op } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ── Métricas principales ──────────────────────────────────────
    const totalProductos  = await Producto.count();
    const totalVentas     = await Venta.count();
    const ventasHoy       = await Venta.count({ where: { createdAt: { [Op.gte]: today } } });
    const ingresosTotales = await Venta.sum('total') || 0;
    const ingresosHoy     = await Venta.sum('total', { where: { createdAt: { [Op.gte]: today } } }) || 0;

    // ── Productos sin stock ───────────────────────────────────────
    const productosSinStock = await Producto.findAll({
      where: { stock: 0 },
      attributes: ['id', 'nombre', 'stock'],
    });
    const stockBajo = productosSinStock.length;

    // ── Últimas 5 ventas ──────────────────────────────────────────
    const ultimasVentas = await Venta.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // ── Top 3 más vendidos (solo productos existentes y activos) ──
    const topProductos = await LineaVenta.findAll({
      attributes: [
        'ProductoId',
        [LineaVenta.sequelize.fn('SUM', LineaVenta.sequelize.col('cantidad')), 'total']
      ],
      group: ['ProductoId', 'Producto.id', 'Producto.nombre'],
      order: [[LineaVenta.sequelize.literal('total'), 'DESC']],
      limit: 3,
      include: [{
        model: Producto,
        attributes: ['nombre'],
        where: { activo: true },
        required: true,
      }]
    });

    res.json({
      totalProductos,
      stockBajo,
      productosSinStock,
      totalVentas,
      ventasHoy,
      ingresosTotales,
      ingresosHoy,
      ultimasVentas,
      topProductos
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Error al obtener datos del dashboard', detalle: error.message });
  }
};

module.exports = { getDashboard };