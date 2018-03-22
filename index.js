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

app.get('/:id/edit',(request,response) => {
  jsonfile.readFile(FILE, (err,obj) => {
    const input = request.params.id;
    console.log("inputted:" + input);
    const pokeArray = obj.pokemon;
    for(let i=0; i<pokeArray.length; i++){
      if(pokeArray[i].id == input){
        let context = {
          getPokemon : pokeArray[i]
        }
        console.log(context);
        response.render('edit',context);
      }
    }
  })
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

app.put('/:id', (request,response) =>{
  jsonfile.readFile(FILE, (err,obj) => {
    const pokeArray = obj.pokemon;
    let input = request.params.id;
    let editPokemon = request.body;
    for(let i=0; i<pokeArray.length;i++){
      if(pokeArray[i].id === parseInt(input,10)){
  
        //if values not changed, revert to original
        for(let key in editPokemon){
          if(editPokemon[key] == ''){
            editPokemon[key] = pokeArray[i][key];
          }
          //validation. if it is a number, revert back to original value
          if(key == "name" || key == "img" || key == "candy"){
            if(!isNaN(editPokemon[key])){
              editPokemon[key] = pokeArray[i][key];
              console.log(key + " cannot be a number");
            }
          }
          if(key == "avg_spawns" || key == "num"){
            if(isNaN(editPokemon[key])){
              editPokemon[key] = pokeArray[i][key];
              console.log(key + " cannot contain letters");
            }
          }
          if(key == "spawn_time"){
            let check = checkTime(editPokemon[key]);
            if(check == false){
              editPokemon[key] = pokeArray[i][key];
              console.log("Invalid time format");
            }
          }
        }

        editPokemon.id = pokeArray[i].id;
        //delete the submit key-value pair
        delete editPokemon["submit"];
        //update the current array with the changes
        pokeArray[i] = editPokemon;

        jsonfile.writeFile(FILE,obj,{spaces: 2},(err2) => {
          //redirect to the id page
          response.redirect(input);
        });
      }
    }
  });

});

app.delete('/:id', (request,response) => {
  console.log('test');
  jsonfile.readFile(FILE,(err,obj) => {
    console.log('test');
    const pokeArray = obj.pokemon;
    let input = request.params.id;

    for(let i=0; i<pokeArray.length;i++){
      if(pokeArray[i].id === parseInt(input,10)){
        console.log(pokeArray[i]);
        pokeArray.splice(i,1);
        console.log(pokeArray[i]);
      }
    }

    response.render('home',{ pokemon: obj.pokemon });
  })
});

/**
 * ===================================
 * Helper functions
 * ===================================
 */

function checkTime(time){
  let exp = /^(\d{1,2}):(\d{2})([ap]m)?$/;

  //search a string for match against regular expression
  //if it matches means it is in time format
  if(checkT = time.match(exp)){
    //check if the time format is valid
    //digits before and after the :
    if(checkT[1]<0||checkT[1]>59||checkT[2]<0||checkT[2]>59){
      return false;
    }
    else{
      return true;
    }
  }
  //does not match time format
  else{
    return false;
  }
};

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
