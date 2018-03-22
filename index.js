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
 * Route Handlers
 * ===================================
 */
function editRoute(request, response) {
	let id = request.params.id;
	jsonfile.readFile(FILE, (err, obj) => {
		if (err) {console.error(err)};
		let result = obj.pokemon.find((creature) => {
			return (parseInt(creature.id) === parseInt(id));
		});
		response.render('edit', {pokemon: result});
	});
};

function updatePokemon(request, response) {
	let pokemonToSave = request.body;
	let id = request.params.id;
	jsonfile.readFile(FILE, (err, obj) => {
		let index = obj.pokemon.findIndex((creature) => {
			return parseInt(creature.id) == parseInt(id);
		});
		obj.pokemon[index] = pokemonToSave;
		jsonfile.writeFile(FILE, obj, {spaces: 4}, (err) => {
			if (err) {console.error(error)};
			response.render('home', {pokemon: obj.pokemon});
		});
	});
};

function deletePokemon(request, response) {
	let id = request.params.id;
	jsonfile.readFile(FILE, (err, obj) => {
		let index = obj.pokemon.findIndex((creature) => {
			return parseInt(creature.id) == parseInt(id);
		});
		obj.pokemon.splice(index, 1);
		jsonfile.writeFile(FILE, obj, {spaces: 4}, (err) => {
			if (err) {console.error(err)};
			response.render('home', {pokemon: obj.pokemon});
		});
	});
;};

/**
 * ===================================
 * Routes
 * ===================================
 */
app.get('/new', (request, response) => {
	// send response with some data (a HTML file)
	response.render('new');
});

// Additional routes for the homework
app.get('/:id/edit', editRoute);
app.put('/:id', updatePokemon);
app.delete('/:id', deletePokemon);

app.get('/:id', (request, response) => {
	jsonfile.readFile(FILE, (err, obj) => {
		if (err) console.error(err);

		// attempt to retrieve the requested pokemon
		let inputId = request.params.id;
		let pokemon = obj.pokemon.find((currentPokemon) => {
			return parseInt(currentPokemon.id) === parseInt(inputId, 10);
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
