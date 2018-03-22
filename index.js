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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));

/**
 * ===================================
 * Routes
 * ===================================
 */

// the form page for user to edit current pokemon
//===============================================
app.get('/:id/edit', (request, response) => {
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

      response.render('edit', context);
    }
  });
});

// the form page for user to input new pokemon
//=============================================

app.get('/new', (request, response) => {
  // send response with some data (a HTML file)
  response.render('new');
});

// the individual pokemon page
//=============================
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

// home page with welcome title and list of all pokemon
//=====================================================
app.get('/', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // return home HTML page with all pokemon
    response.render('home', {
      pokemon: obj.pokemon
    });
  });
});

// await input from user to add new pokemon to pokedex.json
//==========================================================

// post is meant for adding new information
app.post('/', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // add user-submitted pokemon into pokedex object
    let newPokemon = request.body;
    obj.pokemon.push(newPokemon);

    // save updated pokedex object to pokedex.json file
    jsonfile.writeFile(FILE, obj, { spaces: 2 }, (err2) => {
      if (err2) console.error(err2);

      // return home HTML page with all pokemon (including newly created one)
      response.render('home', {
        pokemon: obj.pokemon
      });
    });
  });
});

// await response from user to update pokedex.json
//================================================

// put is meant for update purpose
app.put('/:id', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // updated pokemon Id
    let inputId = request.params.id;
    // updated details for a pokemon
    let updatedPokemon = request.body;

    for (let i = 0; i < obj.pokemon.length; i++) {
      // the existing pokemon details
      let oldPokemon = obj.pokemon[i];

      // if the input Id matches the existing pokemon Id
      if (oldPokemon.id === parseInt(inputId, 10)) {
        // new Id will be updated as a number
        updatedPokemon.id = parseInt(updatedPokemon.id, 10);

        // updated pokemon details into pokedex.json
        obj.pokemon[i] = updatedPokemon;
      }
    }

    // save updated pokedex object to pokedex.json file
    jsonfile.writeFile(FILE, obj, { spaces: 2 }, (err2) => {
      if (err2) console.error(err2);

      // redirect to GET /:id
      response.redirect(`/${request.params.id}`);
    });
  });
})

// to delete pokemon from pokedex.json
//=====================================

app.delete('/:id', (request, response) => {
  // to read current pokemon file
  jsonfile.readFile(FILE, (err, obj) => {
      
    let oldPokemon = obj.pokemon;
    let inputId = request.params.id;

    for(let i=0; i<oldPokemon.length; i++) {

      // if the pokemon Id matches the individual pokemon page that delete button is clicked
      if(oldPokemon[i].id === parseInt(inputId, 10)) {
        // the pokemon is removed
        oldPokemon.splice(i, 1);
      }
    }
    // rewrite the pokedex with updated info
    jsonfile.writeFile(FILE, obj, { spaces: 2 }, (err2) => {

      if (err2) console.error(err2);
      // direct back to home page
      response.render('home', { pokemon: obj.pokemon });
    });
  });
})

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));