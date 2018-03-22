const express = require('express');
const handlebars = require('express-handlebars');
const jsonfile = require('jsonfile');

const FILE = 'pokedex.json';

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

// Set handlebars to be the default view engine
app.engine('handlebars', handlebars.create().engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/**
 * ===================================
 * Routes
 * ===================================
 */
 app.get('/new', (request, response) => {
  // send response with some data (a HTML file)
  response.render('new');
});

app.get('/:id/edit', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    let inputId = request.params.id;
    let pokemon = obj.pokemon.find((currentPokemon) => {
      return currentPokemon.id === parseInt(inputId,10);
    });

    if (pokemon === undefined) {

      response.render('404');
    }
    else {

      let context = {
        pokemon: pokemon
      };
      response.render('edit', context)
    }
  });
  });


  app.get('/:id', (request, response) => {
    jsonfile.readFile(FILE, (err, obj) => {
      if (err) console.error(err);

    // attempt to retrieve the requested pokemon
    let inputId = request.params.id;
    let pokemon = obj.pokemon.find((currentPokemon) => {
      return currentPokemon.id === parseInt(inputId, 10);
    });

    if (pokemon === undefined) {
      // return 404 HTML page if pokemon not found
      response.render('404');
    } else {
      // return pokemon HTML page if found
      let context = {
        pokemon: pokemon
      };

      response.render('pokemon', context);
    }
  });
  });

  app.get('/', (request, response) => {
    jsonfile.readFile(FILE, (err, obj) => {
      if (err) console.error(err);

    // return home HTML page with all pokemon
    response.render('home', { pokemon: obj.pokemon });
  });
});

app.post('/', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // add user-submitted pokemon into pokedex object
    let newPokemon = request.body;
    obj.pokemon.push(newPokemon);

    // save updated pokedex object to pokedex.json file
    jsonfile.writeFile(FILE, obj, (err2) => {
      if (err2) console.error(err2);

      // return home HTML page with all pokemon (including newly created one)
      response.render('home', { pokemon: obj.pokemon });
    });
  });
  });

  app.put('/:id', (request, response) => {
    jsonfile.readFile(FILE, (err, obj) => {
      if (err) console.error(err);

    // attempt to retrieve the requested pokemon
    let inputId = request.params.id;
    let updatedPokemon = request.body;

    for (let i = 0; i < obj.pokemon.length; i++) {
      let currentPokemon = obj.pokemon[i];

      if (currentPokemon.id === parseInt(inputId, 10)) {
        // convert input id from string to number before saving
        updatedPokemon.id = parseInt(updatedPokemon.id, 10);

        // update pokedex object
        obj.pokemon[i] = updatedPokemon;
      }
    }

    // save pokedex object in pokedex.json file
    jsonfile.writeFile(FILE, obj, (err2) => {
      if (err2) console.error(err2);

      // redirect to GET /:id
      response.redirect(`/${request.params.id}`);
    });
  });
  });

  app.delete('/:id', (request, response) => {


    jsonfile.readFile(FILE, (err, obj)=> {
      for(let i=0; i < obj.pokemon.length; i++){

        let currentPokemon = obj.pokemon[i];
        if(currentPokemon.id = request.params.id);

      //this is the thing we wan to delete
      obj.pokemon.splice(i,1);
    }

    jsonfile.writeFile(FILE, obj, (err2) => {
      if (err2) console.error(err2);


      response.redirect('/');
    });

  });

  });



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
 app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
