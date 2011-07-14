![escrito logo](http://dmfranc.com/assets/escrito.png)

## Demonstration
[http://escrito.herokuapp.com/](http://escrito.herokuapp.com/)


## Installation

First make sure you have a working copy of [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) (the node package manager).

To install escrito you'll need coffee.

    npm install -g coffee-script

Check if everything went okay.

    coffee -v

Next, run (this may take a while):

    npm install -g escrito

Then start the server.

    escrito

That should be enough!

You can pass custom arguments:

    escrito --port 4567

Documents are not persistent by default but you can set a custom database type.

The available options are 'memory' and 'redis'. Those are the database types supported by the [ShareJS](https://github.com/josephg/ShareJS/) project.

    escrito --database redis

For more detailed help type:

    escrito -h


## Local installation

You can also install escrito locally. This will install it in your current directory.

    npm install escrito

Start the server:

    npm start escrito

To pass custom arguments using npm, you have to use a slightly different syntax.

For example, to set up the server with a custom port you should do the following:

    npm config set escrito:port 5000


## From source

You can clone the github repository.

    git clone git://github.com/dmfrancisco/escrito.git

Install all the dependencies.

    cd escrito
    npm install

Run the server:

    coffee web.coffee

Again, you can pass custom arguments.

    coffee web.coffee --port 4567 --database redis


# Compiling CoffeeScripts

If you want to compile the CoffeeScripts to JavaScript.

    cake build-dependencies
    cake build

Run the server:

    node web.js


# This wouldn't be possible without Open Source projects like

* [NodeJS](http://nodejs.org/) - Evented I/O for V8 JavaScript
* [ShareJS](https://github.com/josephg/ShareJS/) - The collaborative editing engine by Joseph Gentle
* [Ace Editor](https://github.com/ajaxorg/ace/) - Textarea enriched by Mozilla
* [Markdown mode](https://github.com/fivesixty/notepages/) - Support added by Chris Spencer
* [Showdown](https://github.com/fivesixty/mdext/) - Markdown parser made by John Fraser
* [Textile parser](https://github.com/miebach/js-textile/) - Textile parser made by Ben Daglish
* [Google Caja](http://code.google.com/p/google-caja/) - HTML Sanitizer

Check them all in the [humans.txt](http://escrito.herokuapp.com/humans.txt) file.
