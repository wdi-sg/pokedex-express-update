const express = require('express');
const handlebars = require('express-handlebars');
const jsonfile = require('jsonfile');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

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
let pokedex;
jsonfile.readFile(FILE, (err, obj) => {
  pokedex = obj;
});

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

function findPokemon(findBy, equalsTo) {
  return pokedex.pokemon.find((currentPokemon) => {
    return currentPokemon[findBy] === equalsTo;
  });
} 

app.get('/new', (request, response) => {
  // send response with some data (a HTML file)
  response.render('new');
});

app.get('/:id/edit', (request, response) => {
  let inputId = parseInt(request.params.id, 10);
  let pokemon = findPokemon("id", inputId);
  let context = {
    pokemon: pokemon
  };
  response.render('edit', context);
})

app.put('/:id', [
  sanitize('id').toInt(),
  check('id').isNumeric(),
  check('num').isNumeric(),
  check('name').isLength({ min: 1 }).withMessage("name cannot be empty"),
  check('img').isURL(),
  check('height').isLength({ min: 1 }).withMessage("height cannot be empty"),
  check('weight').isLength({ min: 1 }).withMessage("weight cannot be empty"),
  check('egg').isLength({ min: 1 }).withMessage("egg cannot be empty"),
  check('avg_spawns').isLength({ min: 1 }).withMessage("avg_spawns cannot be empty"),
  check('spawn_time').isLength({ min: 1 }).withMessage("spawn_time cannot be empty")
  ], (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.mapped() });
  }

  let userUpdate = request.body;
  let arrayIndex;
  for(let i = 0; i < pokedex.pokemon.length; i++) {
    if (pokedex.pokemon[i].id == userUpdate.id) {
      arrayIndex = i;
    }
  }
  pokedex.pokemon[arrayIndex] = userUpdate;
  jsonfile.writeFile(FILE, pokedex, {spaces: 2}, (err) => {
    if (err) console.error(err);
  })
  response.redirect('/' + userUpdate.id);
})

app.delete('/:id', (request, response) => {
  let deleteId = request.body.id;
  let arrayIndex;
  for(let i = 0; i < pokedex.pokemon.length; i++) {
    if (pokedex.pokemon[i].id == deleteId) {
      arrayIndex = i;
    }
  }
  pokedex.pokemon.splice(arrayIndex, 1);
  jsonfile.writeFile(FILE, pokedex, {spaces: 2}, (err) => {
    if (err) console.error(err);
  })
  response.redirect('/');
})

app.get('/:id', (request, response) => {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // attempt to retrieve the requested pokemon
    let inputId = parseInt(request.params.id, 10);
    let pokemon = findPokemon("id", inputId);

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
