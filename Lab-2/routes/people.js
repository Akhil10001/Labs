const express = require('express');
const router = express.Router();
const data = require('../data/getData');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require("flat");
const unflat = flat.unflatten;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



router.get('/history', async (req, res) => {
  try {

    let  history = await client.lrangeAsync('returnVal', 0, 19);
    
      for (let i = 0; i < history.length; i++) {

        history[i] = JSON.parse(history[i]);

      }

      res.json(history);
  }
  
  catch (e) {

    res.status(404).json({ error: 'Not found' });

  }
});

router.get('/:id', async (req, res) => {
  try {
    
    const exist = await client.existsAsync(req.params.id);

    if (exist==0) {

      const visitorData = await data.getById(req.params.id);

      flattenData= flat(visitorData)

      await client.hmsetAsync(flattenData.id, flattenData);

      await client.lpush('returnVal', JSON.stringify(visitorData));

      res.json(visitorData);

    }
    else {
      let cacheData= await client.hgetallAsync(req.params.id);

      cacheData.id=parseInt(cacheData.id)

      let unflattenData = unflat(cacheData);

      await client.lpush('returnVal', JSON.stringify(unflattenData));

      res.json(unflattenData);
    }
  } 
  
  catch (e) {
    res.status(404).json({ "error":e.message });
  }

  
});

module.exports = router;