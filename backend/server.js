require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/config');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a BD establecida.');
    
    await sequelize.sync({ alter: false });
    
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar:', error);
  }
};

startServer();