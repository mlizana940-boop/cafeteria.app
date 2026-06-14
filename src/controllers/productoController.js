const service = require('../services/productoService');

exports.getAll = async (req, res) => {
  try {
    res.json(await service.listar());
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

exports.update = async (req, res) => {
  try {
    res.json(await service.actualizar(req.params.id, req.body));
  } catch (e) {
    res.status(e.status || 400).json({ error: e.msg || e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await service.desactivar(req.params.id));
  } catch (e) {
    res.status(e.status || 500).json({ error: e.msg || e.message });
  }
};