const pokemonRoutes = require('./pokemon');
var cors = require('cors');

const constructorMethod = (app) => {

  app.use(cors())
  app.use('/', pokemonRoutes);

  
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;