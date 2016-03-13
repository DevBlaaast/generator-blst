generator-blst
================

Generator for scaffolding :
- static websites
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

[?] Name: HelloWorld
...
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

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
