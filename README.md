# Pokedex Express App (with PUT and DELETE requests)

We will build our first web app using Node.js and Express - a Pokedex app.

For this exercise, we will continue building our Pokedex web app. This time, we will set up our server to also accept PUT requests to update existing data, and we will do so using a pre-populated form that the user can submit to update data. We will also be adding a DELETE endpoint to delete any existing data.

The starter code in this repository builds upon the basics of the previous exercise's code ([pokedex-express-post](https://github.com/wdi-sg/pokedex-express-post)).

## Getting Started

1.  Fork and clone this repository to your computer
2.  Run `yarn install` to install dependencies
3.  Look in the starter file called `index.js`, run `nodemon` to start local server on port 3000
4.  Open `localhost:3000` on your browser and see the home page

## Deliverables

* Expose a new GET `/:id/edit` endpoint that will return a HTML page with a form for the user to edit an existing pokemon's information (Hint: route-matching happens from top to bottom, so choose where to place the code for this endpoint carefully)

* Create a new `edit.handlebars` file that is meant to be returned with GET `/:id/edit`. This form should be pre-populated with information about the pokemon that is being edited (ie. the pokemon whose `id` is specified in the route)

* Expose a new PUT `/:id` endpoint that will receive the form data from the edit form, and save the updated data into `pokedex.json` file

* Expose a new DELETE `/:id` endpoint that will delete the pokemon with specified `id` from the `pokedex.json` file Add a button on the `pokemon.handlebars` page that says “Delete” that when clicked, sends a DELETE request to `/:id` to delete the pokemon. Upon deletion, redirect the user to the `home.handlebars` page

## Further

* Add a link in `pokemon.handlebars` that when clicked, redirects the user to the edit page for that pokemon (eg. on `/2`, a user should be able to click a hyperlink that brings her to `/2/edit`) - this will eliminate the need for the user to type the route on the browser address bar

* Validate each field to ensure only sensible inputs are accepted before saving to pokedex.json (eg. `name` should not have numbers)

## Reference for UPDATE and DELETE

[Here](https://github.com/wdi-sg/express-reference/tree/update) is an example repo with UPDATE and DELETE functionality in the Pokedex app.