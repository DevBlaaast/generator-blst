Blaaast apps generator
======================

Generator for scaffolding :
- Static websites
- Koa APIs

## Getting Started

### Installation

```shell
$ [sudo] npm install -g yo generator-blst bower
```

### Usage

```shell
$ yo blst
```

### Generators

`$ yo blst [myApp]`
Creates a new blst application (static website or Koa API).

TODO


## Learning Your Way Around

Once installed, you can create a basic application by following the prompts.

```shell
$ yo blst

      /\   /\   /\
     /  \ /  \ /  \
    /    \    \    \
   /  /\  \/\  \/\  \   Let's hack!
  /  /  \  \ \  \ \  \
 /  /____\  \_\  \_\  \
/____________\____\____\

Tell me a bit about your application:

? What is your application name ? HelloWorld
? Add a description for your app : The website for HelloWorld
? Who is the author of this app ? John DOe
? Is it a static website or a Koa API ? A static website
```

To run your application, just go into the newly created directory and type `npm start`.

```shell
$ cd HelloWorld
$ npm start
```


## Projects Structure

### Koa API

- **/api/** - All your API's resources (web controllers)
- **/bin/** - Binary that start your API
- **/config/** - All your configuration
- **/db/** - Db management folder
- **/db/seeds** - Db fake data files
- **/db/migrations** - Db versioning files
- **/lib/** - Scripts that init your API
- **/models/** - Your db models
- **/scripts/** - POJO for tasks you might want to use only once.
- **/services/** - POJO for extractable behaviour.
- **/tests/** - Unit test cases (fonctionnal are in api/**/test.js)
- **/knexfile.js** - Your database config file
- **/index.js** - Application entry point

### Static website

- **/fonts/** - Your website's fonts
- **/img/** - The images of your app (compressed at build time)
- **/js/** - The front-end js code
- **/locale/** - The language files (it is not mandatory to use them)
- **/pages/** - All your pages
- **/pages/partials/** - The partials you can use in your templates (head, footer...)
- **/scss/** - Your scss, ready to be transpiled
- **/gulpfile.js - The configuration of your gulpfile (which is then sent to the `blaaast-build-pipeline` npm module)

## License

MIT
