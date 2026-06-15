const service = require('../services/ventaService');

exports.getAll = async (req, res) => {
  try {
    res.json(await service.listar(req.query));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.msg || e.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json(await service.obtener(req.params.id));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.msg || e.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await service.crear(req.body));
  } catch (e) {
    res.status(e.status || 400).json({ error: e.msg || e.message });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    res.json(await service.actualizarEstado(req.params.id, req.body.estado));
  } catch (e) {
    res.status(e.status || 400).json({ error: e.msg || e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await service.eliminar(req.params.id));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.msg || e.message });
  }
};