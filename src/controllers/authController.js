const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Campos requeridos: nombre, email, password' });

    const existe = await User.findOne({ where: { email } });
    if (existe)
      return res.status(409).json({ error: 'El email ya está registrado' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password_hash });

    res.status(201).json({ id: user.id, nombre: user.nombre, email: user.email });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};