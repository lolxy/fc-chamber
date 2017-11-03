# fc-app
> 辅城PC端网站



This boilerplate is based on the Vue webpack template.
Common topics are discussed in the Vuejs [docs](http://vuejs-templates.github.io/webpack). Make sure to read it!

## Usage
To get up and running run:
``` bash
$ npm install
$ npm run dev
```
Yes, that's it. Only two commands!

If you still think that's too much effort, you could also run:
``` bash
$ npm i && npm run dev
```
But yeah, this will basically do the same as `npm install`.
If even this is too much of a deal, try creating an alias and bind `npm install && npm run dev` to `npmid`.

## Configuration ##
> Wait a minute, you just said that I only need to run npm install?
> What's this? I need to do more?

Yeah, to get up and running real quick, `npm install` is enough.
But if you want to, let's say, connect to an external API, there's a little bit more involved.
You need to configure your application a bit more, explained below:

### Config files ###
Inside the `config/*.env.js`-files, you can configure your environment variables.
Out of the box the applications comes bundled with AJAX-support.
The only thing you need to do is change `http://example.*/api/v1` to your endpoint.

For more information, visit the [docs](http://vuejs-templates.github.io/webpack/env.html).

## What's included ##
- `npm run dev`: first-in-class development experience.
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps

- `npm run build`: Production ready build.
  - JavaScript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2).
  - HTML minified with [html-minifier](https://github.com/kangax/html-minifier).
  - CSS across all components extracted into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano).
  - All static assets compiled with version hashes for efficient long-term caching, and a production `index.html` is auto-generated with proper URLs to these generated assets.

## Other tools ##
### Scaffolding ###
For quickly scaffolding components, pages, layouts and more, install the [Vueture CLI tool](https://github.com/vueture/vueture-cli).
``` bash
$ npm install -g vueture-cli
```

## Important Files ##
So there are a couple of important files that needs to be addressed:

### bootstrap.js ###
This file will bootstrap the application.
It will load:
 - vue
 - vue-router
 - vue-i18n
 - vuex
 - axios
 - bootstrap
 - jquery
 - font-awesome

Don't like one of those packages?
Just strip them from the `bootstrap` and the `package.json`-files.

### main.js ###
This file will load your single page application.
It is also the entry point which will be loaded and compiled using webpack.

### app/index.vue ###
The main Vue file.
This file will load the page inside the `router-view`-component.
It will check if the user is authenticated and load the resources accordingly.

## Structure ##
Inside the `src/app`-directory, are a couple directories that needs to be addressed:

### Components ###
Your components will be placed inside this directory.
As you can see, this boilerplate already comes shipped with an pre-made panel component.

### Layouts ###
Your layout files will be placed inside this directory.
When you are building a large single page application, you will be using different layouts.
For instance, your login-page or register-page will have a different layout than your account-page.

The boilerplate comes out of the box with two layouts included.
A minimal layout, used for the login and register page, and a default layout.
Used for the home and account page.

### Mixins ###
The mixins you want to use with Vue will be placed inside this directory.

Inside the mixins directory is a `slot`-mixin.
This mixin will add the `hasSlot()`-method to all the components it is used in.

### Pages ###
The pages/views are placed inside this directory.
By default it comes with an `account/index`, `home/index`, `login/index` and a `register/index` page,
but feel free to add more.

### Services ###
You can compare services with controllers.
They connect with external services, like an API, and call actions on the store.
Normally you would perform AJAX-requests from the services, but to get the example working, the data is hardcoded.

### Store ###
As mentioned before, Vuex is used as a single point of truth.
To learn more about Vuex, visit the [documentation](http://vuex.vuejs.org)

### Utils ###
Last but not least we get an `utils`-directory.
Here you can place handy utils you want to use inside your application.
Out of the box it comes with a `loader`-util which will prevent the relative directory hell.

### API

http://devt.fccn.cc/Api/help

