const express = require('express');
const handlebars = require('express-handlebars');
const jsonfile = require('jsonfile');

const FILE = 'pokedex.json';

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

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
app.use(bodyParser.json());

/**
 * ===================================
 * Routes
 * ===================================
 */
app.get('/:id/edit', (request, response) => {
  let context = {};

  jsonfile.readFile(FILE, (err, obj) => {

    for (let i = 0; i < obj.pokemon.length; i++) {
      if (request.params.id == obj.pokemon[i].id) {
        context.id = obj.pokemon[i].id;
        context.num = obj.pokemon[i].num;
        context.name = obj.pokemon[i].name;
        context.img = obj.pokemon[i].img;
        context.height = obj.pokemon[i].height;
        context.weight = obj.pokemon[i].weight;
        context.candy = obj.pokemon[i].candy;
        context.candy_count = obj.pokemon[i].candy_count;
        context.egg = obj.pokemon[i].egg;
        context.avg_spawns = obj.pokemon[i].avg_spawns;
        context.spawn_time = obj.pokemon[i].spawn_time;
        // console.log('context');
        // console.log(context);
      }
    }
    // console.log(context);
    response.render('edit', context);
  });
});

app.put('/:id', updatePokemon);

function updatePokemon(request, response) {
  console.log(request.body);
  jsonfile.readFile(FILE, (err, obj) => {
    console.log(request.params.id);
    for (let i = 0; i < obj.pokemon.length; i++) {
      if (request.params.id == obj.pokemon[i].id) {

        jsonfile.writeFile('data.json', request.body, (err) => {
          console.error(err)

          // now look inside your json file
          response.send(request.body);
        });
      }
    }
  });
};

app.get('/new', (request, response) => {
  // send response with some data (a HTML file)
  response.render('new');
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

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
