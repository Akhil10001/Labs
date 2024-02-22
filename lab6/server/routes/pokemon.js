const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const bluebird = require("bluebird");
const { default: axios } = require("axios");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



router.get('/pokemon/page/:pagenum', async (req, res) => {

  try{

     if( isNaN(req.params.pagenum) || parseInt(req.params.pagenum)<0)
    {
      
             throw 'Please enter positive integer in the route'
    }

    let pokemonsData = await client.smembersAsync("pokemonsList");


    const pokemonsList = pokemonsData.map((data) => {
      return JSON.parse(data);
    });


    const pokemons = pokemonsList.find((data) => data.id == req.params.pagenum);


    if(pokemons)
    {

        return res.status(200).json(pokemons)
    }

}

catch(e)
{

    res.status(404).json(e)
    return
}
    
try{

    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=' + (req.params.pagenum*20) + '&limit=20');

    if(data.results.length==0)
    {
        throw 'Not Found'
    }

   let storeData=
   {
       id:req.params.pagenum,
       data:data
   }


   await client.sadd("pokemonsList", JSON.stringify(storeData));


    return res.status(200).json(storeData)

}

catch(e)
{
        res.status(404).json(e)
        return
}
});



router.get('/pokemon/:id',async(req,res)=>{


try{
    if( isNaN(req.params.id) || parseInt(req.params.id)<0)
    {
      
             throw 'Please enter positive integer in the route'
    }

    let pokemonData = await client.smembersAsync("pokemonList");


    const pokemonList = pokemonData.map((data) => {
      return JSON.parse(data);
    });


    const pokemon = pokemonList.find((data) => data.id == req.params.pagenum);


    if(pokemon)
    {

        return res.status(200).json(pokemon)
    }
    
}

catch(e)
{
        res.status(404).json(e)
        return
}


try{
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/' + req.params.id);


    let storeData=
    {
        id:req.params.id,
        data:data
    }
 
 
    await client.sadd("pokemonList", JSON.stringify(storeData));
 
 
     return res.status(200).json(storeData)
}

catch(e)
{
    res.status(404).json("Not Found")
}


})



router.get('/pokemon/search/:name',async(req,res)=>{


    try{

        if(/\d/.test(req.params.name))
        {
            throw 'Enter name without numbers';
        }
    
        let pokemonData = await client.smembersAsync("searchList");
    
    
        const pokemonList = pokemonData.map((data) => {
          return JSON.parse(data);
        });
    
    
        const pokemon = pokemonList.find((data) => data.name == req.params.name);
    
    
        if(pokemon)
        {
    
            return res.status(200).json(pokemon)
        }
        
    }
    
    catch(e)
    {
            res.status(404).json(e)
            return
    }
    
    
    try{
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/' + req.params.name);
    
    
        let storeData=
        {
            name:req.params.name,
            data:data
        }
     
     
        await client.sadd("searchList", JSON.stringify(storeData));
     
     
         return res.status(200).json(storeData)
    }
    
    catch(e)
    {
        res.status(404).json("Not Found")
    }
    
    
    })







module.exports = router;