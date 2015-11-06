var gulp            = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var include         = require('gulp-include');
var uglify          = require('gulp-uglify');
var changed         = require('gulp-changed');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var imagemin        = require('gulp-imagemin');
var pngquant        = require('imagemin-pngquant');
var watch           = require('gulp-watch');
var plumber         = require('gulp-plumber');
var swig            = require('gulp-swig');
var data            = require('gulp-data');
var path            = require('path');
var fs              = require('fs');
var prettify        = require('gulp-prettify');
var runSequence     = require('run-sequence');
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;



// SETUP
// ---------------------------------------------------------------------

// Set bower paths
var bower = {
    path: 'html/bower_components/',
    fontAwesome: 'html/bower_components/fontawesome',
    foundation: 'html/bower_components/foundation',
    bourbon: 'html/bower_components/bourbon/app/assets/stylesheets',
    modernizr: 'html/bower_components/modernizr'
}

// Set source paths
var src = {
    path: 'src/',
    bower_components: 'src/bower_components/',
    scripts: 'src/js/**/*.js',
    sass: 'src/scss/**/*.scss',
    scss_partials: 'src/scss/partials',
    scss_modules: 'src/scss/modules',
    scss_vendor: 'src/scss/vendor',
    fonts: '.src/fonts/**/*',
    bower: 'html/bower_components/**/*',
    data: 'src/data/**/*',
    html: 'src/templates/**/*',
    templates: 'src/templates/*.html',
    templatePartials: ['src/templates/partials/*.html'],
    webroot: 'src/*.*'
}

// Set distribution paths
var dist = {
    path: 'html',
    assets: 'html/assets',
    scripts: 'html/assets/js',
    images: 'html/assets/img',
    fonts: 'html/assets/fonts',
    css: 'html/assets/css',
    templates: 'html/templates',
    html: 'html/templates/**/*.html',
    craftTemplates: 'craft/templates'
}








// TASKS
// ---------------------------------------------------------------------



// Optimize Images
// gulp.task('images', function() {
//     return gulp.src(dist.images + '/*.{gif,jpg,png}')
//         .pipe(imagemin({
//             progressive: true,
//             use: [pngquant()],
//             optimizationLevel: 5
//         }))
//         .pipe(gulp.dest(dist.images))
//         .pipe(browserSync.stream());
// });



// Compile JS
gulp.task('scripts', function() {
    return gulp.src([
            src.path + 'js/main.js',
            // src.path + 'js/additional-script.js'  //only add scripts that should be output as separate files
        ])
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest(dist.scripts))
        .pipe(browserSync.stream()); //pipe back to browserSync to trigger a reload
});



// Compile Sass into css and auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass(
        {
            includePaths: [
                bower.path,
                bower.foundation + '/scss',
                src.scss_vendor,
                src.scss_partials,
                src.scss_modules
            ],
            outputStyle: 'expanded'
            // errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist.css))
        .pipe(browserSync.stream()); //pipe back to browserSync to trigger a reload
});

//Function to get JSON data for templates
function getDataForFile(file){
    try {
        // return require('./build/data/' + path.basename(file.path, '.html') + '.json'); //require caches the file so requires gulp stop/start
        return JSON.parse(fs.readFileSync('./src/data/' + path.basename(file.path, '.html') + '.html.json'));
    } catch(err) {
        // Do something with the error here if you want like: console.log('Error: ' + err);
        console.log(err.message);
    }
    return {}; // Just return a blank object as the default data for the requested file.
}

// Compile HTML Templates
gulp.task('templates', function() {
    return gulp.src(src.templates)
        // .pipe(data(getDataForFile))
        .pipe(swig({
            defaults: {
                cache: false
            }
        }))
        .pipe(gulp.dest(dist.templates))
        .pipe(browserSync.stream()); //pipe back to browserSync to trigger a reload
});



// Prettify HTML Templates
gulp.task('prettify-templates', ['templates'], function() {
    gulp.src(dist.templates + '/*.html')
        .pipe(prettify({
            indent_with_tabs: true,
            preserve_newlines: true
        }))
        .pipe(gulp.dest(dist.templates));
});



// BrowserSync Static server + watch scss/js/html/image files
// Pass in array of tasks that must  complete before triggering a reload
gulp.task('serve', ['sass', 'scripts', 'templates'], function() {
    // Static
    browserSync.init({
        server: dist.path,
        open: false,
        reloadOnRestart: true
    });

    // MAMP PHP Server
    // browserSync.init({
    //     proxy: 'somesite.dev',
    //     open: false
    // });

    //once browsersync is serving, set up some watch tasks to trigger on change
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.scripts, ['scripts']);
    // gulp.watch(src.images, ['images']);
    gulp.watch([src.html], ['templates']);
    // gulp.watch([src.data], ['templates']);
    gulp.watch(src.templatePartials).on('change', reload); // manual reload when templatePartials change
    // gulp.watch(dist.craftTemplates + '/**/*').on('change', reload);
});







// TASK RUNNERS
// ---------------------------------------------------------------------

gulp.task('default', ['serve']);

gulp.task('build', function(callback) {
    runSequence(['scripts','sass','templates'], 'prettify-templates', callback);
});
