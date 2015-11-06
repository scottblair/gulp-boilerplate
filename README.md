Boilerplate README
==========

### Staging server
http://someurl.staging.com/

### Dependencies

* Foundation http://foundation.zurb.com/docs/
* NPM https://www.npmjs.com/
* Gulp http://gulpjs.com/
* Bower http://bower.io/
* BEM http://getbem.com/
* Git https://git-scm.com/
* Swig http://paularmstrong.github.io/swig/
* Swig options: https://github.com/beautify-web/js-beautify#options

### Project Setup

**Installing Node.js and npm**
https://docs.npmjs.com/getting-started/installing-node

**Installing Bower**
```
npm install -g bower
```

**If you already have NPM and bower, consider updating them**
```
npm update -g bower
npm install npm -g
```

**Install dependencies into the project**
```
npm install
```

### Frontend development workflow using Gulp

**Using Gulp**

The frontend development assets, such as css, javascript, images and fonts are compiled or built using Gulp. A local development server is provided with BrowserSync. To start frontend development, run the following command in your terminal from the project root directory:

```
gulp
```

To build the frontend assets to the distribution directory (currently the root directory), run the following command

```
gulp build
```


### Frontend Templating using Swig

Frontend templates are built using the Swig template engine. You can view the documentation here: http://paularmstrong.github.io/swig/docs/

Swig templates can process data objects using the gulp-data plugin. Learn more at https://github.com/colynb/gulp-data


### CSS Approach using BEM

This project uses the BEM approach to naming CSS components and classes (not used for Foundation-specific classes). To learn more about BEM, visit the following links:

* https://en.bem.info/method/
* http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
* https://css-tricks.com/bem-101/
* http://getbem.com/introduction/
* http://www.smashingmagazine.com/2012/04/16/a-new-front-end-methodology-bem/


### Git Branching Strategy

Use feature branches for new development and merge them into master. Examples branches:

* chore/cleanup-ui
* bug/fix-nav
* feature/news-module

When done with a task or feature, issue a pull request to merge the feature into master.
