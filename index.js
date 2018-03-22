const express = require('express');
const handlebars = require('express-handlebars');
const jsonfile = require('jsonfile');

const FILE = 'testdex.json';

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
//Take note of method override hook
app.use(methodOverride('_method'));

/**
 * ===================================
 * Routes
 * ===================================
 */

//rewrote starter code to fit my format. I find it easier to understand if I separate the route from the actual function
function goToCreationForm(request, response) {
  // send response with some data (a HTML file), i.e, render the new.handlebars
  response.render('new');
};

function showPokemonStats(request, response) {
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
        //need to set this context here to retrieve {{currentId}} for the url /:id
        currentId: pokemon.id
      };

      response.render('pokemon', context);
    }
  });
};

function goToHomePage(request, response) {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // return home HTML page with all pokemon
    response.render('home', {
      pokemon: obj.pokemon
    });
  });
};

function saveNewPokemon(request, response) {
  jsonfile.readFile(FILE, (err, obj) => {
    if (err) console.error(err);

    // add user-submitted pokemon into pokedex object
    let newPokemon = request.body;
    obj.pokemon.push(newPokemon);

    // save updated pokedex object to pokedex.json file
    jsonfile.writeFile(FILE, obj, (err2) => {
      if (err2) console.error(err2);

      // return home HTML page with all pokemon (including newly created one)
      response.render('home', {
        pokemon: obj.pokemon
      });
    });
  });
};

//end revamped starter code

//Qn 1 + 2
function editPokemon(request, response) {
  //read the FILE
  jsonfile.readFile(FILE, (err, obj) => {
    console.log(request.params.id)
    //find the index of the requested id on the obj
    //declare a variable for the indexId
    let indexId;
    //search for the matching id of the pokemon and return the index number to indexId
    for (let i = 0; i < obj.pokemon.length; i++) {
      if (obj.pokemon[i].id == request.params.id) {
        indexId = i;
      }
    }
    //make a context that uses data from the object retrieved
    let context = {
      //request.params.id uses the id put into the url
      currentId: obj.pokemon[indexId].id,
      currentNum: obj.pokemon[indexId].num,
      currentName: obj.pokemon[indexId].name,
      currentImg: obj.pokemon[indexId].img,
      currentHeight: obj.pokemon[indexId].height,
      currentWeight: obj.pokemon[indexId].weight,
    };
    //render the edit.handlebars with the context given
    response.render("edit", context)
  });
};

//Qn 3
//side note: find better way of comparing two objects and updating relevant pairs. Not liking the nested functions.
function savePokemonChanges(request, response) {

  jsonfile.readFile(FILE, (err, obj) => {
    //if error, show error in console log (shameless stolen from starter code)
    if (err) console.error(err);
    //request.body refers to the object sent out from the edit.handlebars (the form)
    //obj refers to the data in the json file that was read.
    //put the data in the json file into a variable
    let changedObject = obj;

    //manipulate the variable accordingly
    //for all pokemon in the changedObject variable
    for (let i = 0; i < changedObject.pokemon.length; i++) {
      //if the id of the pokemon in changed object is == to the id field of the form
      if (changedObject.pokemon[i].id == request.body.id) {
        //for each stat in the form
        for (let stat in request.body) {
          console.log("stat change!" + stat)
          //if field is not empty
          if (changedObject.pokemon[i][stat] != null) {
            //change the relevant value on changedObject with reference to the form
            changedObject.pokemon[i][stat] = request.body[stat];
          };
        };
      };
    };

    //remember, when you write file, you are rewriting the ENTIRE json. You need to manipulate the entire json.
    //put the manipulated variable in the obj parameter to write it in.
    jsonfile.writeFile(FILE, changedObject, (err2) => {
      if (err2) console.error(err2);
      response.render("home", changedObject);
    });
  });
};

function deletePokemon(request, response) {
  jsonfile.readFile(FILE, (err, obj) => {
    //if error, show error in console log (shameless stolen from starter code)
    if (err) console.error(err);
    //request.body refers to the object sent out from the edit.handlebars (the form)
    //obj refers to the data in the json file that was read.
    //request.params refers to the parameter in the url
    //put the data in the json file into a variable
    let changedObject = obj;

    //for all pokemon in changedObject
    for (let i = 0; i < changedObject.pokemon.length; i++) {
      //if the id in changedObject matches the id in the url
      if (changedObject.pokemon[i].id == request.params.id) {
        //splice the relevant id
        changedObject.pokemon.splice(i, 1);
      };
    };
    //write the changes to the json file
    jsonfile.writeFile(FILE, changedObject, (err2) => {
      if (err2) console.error (err2);
      //reder the home.handlebars with the context of changedObject (to reflect changes)
      // response.render("home", {pokemon: changedObject.pokemon});
      //DOES NOT WORK WITH NODEMON
      response.redirect("/")
    })

  });
};



//writing routes in this format makes it easier to handle route-matching
app.get("/new", goToCreationForm);
app.get("/:id", showPokemonStats);
app.put("/:id", savePokemonChanges);
app.delete("/:id", deletePokemon);
app.get("/:id/edit", editPokemon);
app.get("/", goToHomePage);
app.post("/", saveNewPokemon);

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));