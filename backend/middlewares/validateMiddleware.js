const validateBody = (fields) => {
  return (req, res, next) => {
    const camposFaltantes = [];
    fields.forEach(field => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        camposFaltantes.push(field);
      }
    });
    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios en la petición.',
        campos_faltantes: camposFaltantes
      });
    }
    next();
  };
};
module.exports = {
  validateBody
};
