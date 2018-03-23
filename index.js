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
 // Delete the specific pokemon from the pokdedex based on the id in the url
 app.delete('/:id', (request, response) => {
   console.log("Entered the delete function");
   jsonfile.readFile(FILE, (err, obj) => {
     // Retrieve the id of the pokemon to be deleted
     let delete_id = request.params.id;
     console.log("Id of pokemon to be deleted => " + delete_id);

     for (let i = 0; i < obj.pokemon.length; i++){
       // Get the actual id of the current pokemon
       let currentPokemon_id = i + 1;

       // Try to match with the id specified in the url parameters
       if (currentPokemon_id === parseInt(delete_id, 10)){
         // Delete the specified pokemon from the pokedex
         let actual_delete_id = delete_id - 1;
         console.log("Actual array index to delete => " + actual_delete_id);
         obj.pokemon.splice(actual_delete_id, 1);

         console.log("Successfully deleted the pokemon from the pokedex");
       }
     }

     // save pokedex object in pokedex.json file
     jsonfile.writeFile(FILE, obj, {spaces : 2}, (err2) => {
       console.log("Writing to file in progress");
       if (err2) console.error(err2);

       // redirect to homepage to display updated pokemon list
       response.redirect('/');
     });
   });
 });

 // Render form to create new pokemon
app.get('/new', (request, response) => {
  // send response with some data (a HTML file)
  response.render('new');
});

// Update pokemon stats into file and display the updated content
app.put('/:id', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // attempt to retrieve the requested pokemon
    let inputId = request.params.id;
    console.log("id of updated pokemon => " + inputId);
    let updated_Pokemon = request.body;

    for (let i = 0; i < obj.pokemon.length; i++) {
      // Get the actual id of the current pokemon
      let currentPokemon_id = i + 1;

      // Try to match with the id specified in the url parameters
      if (currentPokemon_id === parseInt(inputId, 10)) {
        // convert id of updated_Pokemon from string to number before saving
        updated_Pokemon.id = parseInt(updated_Pokemon.id, 10);

        // update pokedex object if the ids matches
        obj.pokemon[i] = updated_Pokemon;

        console.log("Finished updating the pokedex with the new pokemon stats");
      }
    }

    // save pokedex object in pokedex.json file
    jsonfile.writeFile(FILE, obj, {spaces : 2}, (err2) => {
      console.log("Writing to file in progress");
      if (err2) console.error(err2);

      // redirect to GET /:id
      response.redirect('/' + request.params.id);
    });
  });
});

// Display pre populated form of pokemon stats for user to edit
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

// Display stats of specific pokemon in pokemon.handlebars
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
        pokemon: pokemon,
        currentPokemonId: pokemon.id
      };

      response.render('pokemon', context);
    }
  });
});

// Display the full list of pokemon names
app.get('/', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // return home HTML page with all pokemon
    response.render('home', { pokemon: obj.pokemon });
  });
});

// Display updated full list of pokemon names after writing to the file
app.post('/', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // add user-submitted pokemon into pokedex object
    let newPokemon = request.body;
    console.log(newPokemon);
    newPokemon.id = parseInt(newPokemon.id, 10);
    obj.pokemon.push(newPokemon);

    // save updated pokedex object to pokedex.json file
    jsonfile.writeFile(FILE, obj, {spaces:2}, (err2) => {
      if (err2) console.error(err2);

      // return home HTML page with all pokemon (including newly created one)
      response.render('home', { pokemon: obj.pokemon });
    });
  });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
