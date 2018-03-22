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
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/**
 * ===================================
 * Routes
 * ===================================
 */
app.get("/new", (req, res) => {
  res.render("new");
});

// responds to edit pokemon details button
app.get('/:id/edit', (req, res) => {
  jsonfile.readFile(FILE, (err, obj) => {
    let pokeId = req.params.id;
    let pokeArr = obj.pokemon;
    let selectedPoke = pokeArr.find(poke => {
      return poke.id === parseInt(pokeId, 10);
    });
    res.render('edit', {pokemon: selectedPoke});
  });
});

// deletes pokemon from database
app.post('/:id/delete', (req, res) => {
  jsonfile.readFile(FILE, (err, obj) => {
    let pokeId = req.params.id;
    let pokeArr = obj.pokemon;
    let index = pokeArr.findIndex(poke => {
      return poke.id === parseInt(pokeId, 10);
    });
    pokeArr.splice(index, 1);
    let pokemon = {
      pokemon: pokeArr
    };
    jsonfile.writeFile(FILE, pokemon, (err) => {
      res.redirect('/');
    });
  });
});

// get pokemon details
app.get("/:id", (req, res) => {
  // get json from specified file
  jsonfile.readFile(FILE, (err, obj) => {
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = req.params.id;

    // find pokemon by id from the pokedex json file
    // (note: find() is a built-in method of JavaScript arrays)
    let pokemon = obj.pokemon.find(currentPokemon => {
      return currentPokemon.id === parseInt(inputId, 10);
    });

    if (pokemon === undefined) {
      // send 404 back
      res.render("404");
    } else {
      let context = {
        pokemon: pokemon
      };

      // send html file back with pokemon's data
      res.render("pokemon", context);
    }
  });
});

// creates new pokemon
app.post("/", (req, res) => {
  jsonfile.readFile(FILE, (err, obj) => {
    let pokeArr = obj.pokemon;
    // gets id of last existing pokemon in current array and increment the value before passing to new pokemon
    let pokeId = pokeArr[obj.pokemon.length - 1].id + 1;
    let pokeNum = pokeArr[obj.pokemon.length - 1].id + 1;
    req.body.id = pokeId;
    req.body.num = pokeNum;
    pokeArr.push(req.body);
    let pokemon = {
      pokemon: pokeArr
    };
    jsonfile.writeFile(FILE, pokemon, err => {
      res.redirect('/');
    });
  });
});

// responds to submission of update detail form
app.post('/:id', (req, res) => {
  jsonfile.readFile(FILE, (err, obj) => {
    let pokeArr = obj.pokemon;
    let pokeId = req.params.id;
    let pokeNum = pokeId;
    console.log(`Pokemon id is ${pokeId}`);
    let index = pokeArr.findIndex(poke => {
      return poke.id === parseInt(pokeId, 10);
    });
    console.log(`Index of pokemon is ${index}`);
    let pokemon = req.body;
    pokemon.id = parseInt(pokeId, 10);
    pokemon.num = pokeNum;
    console.log(pokemon);
    pokeArr.splice(index, 1, pokemon);
    let pokeObject = {
      pokemon: pokeArr
    };
    jsonfile.writeFile(FILE, pokeObject, err => {
      res.render('pokemon', {pokemon: pokemon})
    })
  });
});


app.get("/", (req, res) => {
  // for sorting pokemon list in alphabetical order
  if (req.query.sortby === "name") {
    jsonfile.readFile(FILE, (err, obj) => {
      let pokeNameArr = obj.pokemon.map(poke => {
        return {
          id: poke.id.toString().padStart(3, "0"),
          num: poke.num,
          name: poke.name,
          img: poke.img
        };
      });
      let sortedArr = pokeNameArr.sort((a, b) => {
        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });

      res.render("home", { pokeNameArr: sortedArr });
    });
  }
  // for sorting pokemon list in numerical order based on pokemon id 
  else {
    jsonfile.readFile(FILE, (err, obj) => {
      let pokeNameArr = obj.pokemon.map(poke => {
        return {
          id: poke.id.toString().padStart(3, "0"),
          num: poke.num,
          name: poke.name,
          img: poke.img
        };
      });
      res.render("home", { pokeNameArr: pokeNameArr });
    });
  }
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
