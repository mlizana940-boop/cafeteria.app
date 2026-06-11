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
  // POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const user = await User.findOne({ where: { email } });
    // Siempre responder 200 para no revelar si el email existe
    if (!user) return res.status(200).json({ message: 'Si el email existe, recibirás instrucciones' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await PasswordResetToken.destroy({ where: { userId: user.id } });
    await PasswordResetToken.create({ userId: user.id, token, expiresAt });

    // En producción aquí enviarías el email. Por ahora devolvemos el token:
    console.log(`Token de reset para ${email}: ${token}`);
    res.status(200).json({ message: 'Token generado', token }); // quitar token en producción
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });

    const record = await PasswordResetToken.findOne({ where: { token } });
    if (!record) return res.status(400).json({ error: 'Token inválido' });
    if (record.expiresAt < new Date()) {
      await record.destroy();
      return res.status(400).json({ error: 'Token expirado' });
    }

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password_hash: hashed }, { where: { id: record.userId } });
    await record.destroy();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
};