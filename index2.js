const express = require("express");
const handlebars = require("express-handlebars");
const jsonfile = require("jsonfile");
const bodyparser = require("body-parser");
const methodOverride = require('method-override');


const app=express();
const file = "pokedex.json";

app.engine('handlebars', handlebars.create().engine);
app.set('view engine', 'handlebars');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


let pokedex = null;

jsonfile.readFile(file,(err,obj)=>{
	pokedex=obj;
});

app.get('/:id/edit',(req,resp)=>{
	let pokeToEdit = req.params.id;
	let context={};
	for(i=0;i<pokedex.pokemon.length;i++){
		if(pokeToEdit==pokedex.pokemon[i].id){
			context.id=pokedex.pokemon[i].id,
			context.name=pokedex.pokemon[i].name,
			context.img=pokedex.pokemon[i].img,
			context.height=pokedex.pokemon[i].height,
			context.weight=pokedex.pokemon[i].weight
		};
	};
	resp.render('edit',context);
});

app.get('/:id/',(req,resp)=>{
	let deleteId=req.params.id;
	jsonfile.readFile(file,(err,obj)=>{
		let pokemon = obj.pokemon.find((currentPokemon)=>{
			return currentPokemon.id ==deleteId;
		})
		resp.render('pokemon',pokemon);
	})
});

app.delete('/:id',(req,resp)=>{
	let deleteId = req.body.pokeDelete;
	console.log(deleteId);
	jsonfile.readFile(file,(err,obj)=>{
		for(i=0;i<obj.pokemon.length;i++){
			if(deleteId==obj.pokemon[i].id){
				obj.pokemon.splice(i,1);
				jsonfile.writeFile(file,obj,{spaces: 4},(err)=>{
				});
				resp.render('home');
			}
		};
	});	
});

app.put('/:id',(req,resp)=>{
	let modifiedArrayNo = null;
	for(i=0;i<pokedex.pokemon.length;i++){
		if(req.body.id==pokedex.pokemon[i].id){
			pokedex.pokemon[i].name=req.body.name;
			pokedex.pokemon[i].img=req.body.img;
			pokedex.pokemon[i].height=req.body.height;
			pokedex.pokemon[i].weight=req.body.weight;
			modifiedArrayNo = i;
		}
	}
	jsonfile.writeFile(file,pokedex,{spaces: 4},(err)=>{
	});
	resp.send(pokedex.pokemon[modifiedArrayNo]);
});

app.get('/',(req,resp)=>{
 jsonfile.readFile(file,(err,obj)=>{
 	let context = {
 		pokemon: obj.pokemon
 	}
 	resp.render('home',context);
 });
});


app.listen(3000,()=>{
	console.log('server running')
});