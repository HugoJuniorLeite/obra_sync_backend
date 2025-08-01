import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // O token normalmente vem no formato: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato do token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Pode salvar dados do usuário no req para usar nas rotas
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next(); // tudo certo, segue para a próxima função/middleware
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
    } else {
      return res.status(401).json({ error: 'Token inválido.' });
    }
  }
}
