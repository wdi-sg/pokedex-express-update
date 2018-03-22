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
		if(pokeToEdit==pokedex.pokemon[i].name){
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
	let deleteName=req.params.id;
	jsonfile.readFile(file,(err,obj)=>{
		let pokemon = obj.pokemon.find((currentPokemon)=>{
			return currentPokemon.name ===deleteName;
		})
		console.log(pokemon);
		resp.render('pokemon',pokemon);
	})
});

app.delete('/:id/delete',(req,resp)=>{
	resp.send("deleted");
})

app.put('/:id',(req,resp)=>{
	let modifiedArrayNo = null;
	console.log("changed");
	for(i=0;i<pokedex.pokemon.length;i++){
		if(req.body.id==pokedex.pokemon[i].id){
			pokedex.pokemon[i].name=req.body.name;
			pokedex.pokemon[i].img=req.body.img;
			pokedex.pokemon[i].height=req.body.height;
			pokedex.pokemon[i].weight=req.body.weight;
			modifiedArrayNo = i;
			console.log("changed");
		}
	}
	jsonfile.writeFile(file,pokedex,{spaces: 4},(err)=>{
	});
	resp.send(pokedex.pokemon[modifiedArrayNo]);
});



app.listen(3000,()=>{
	console.log('server running')
});