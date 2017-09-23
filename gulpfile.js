// requirements
var del = require("del");
var path = require("path");

var gulp = require("gulp");
var babel = require("gulp-babel");
var pug = require("gulp-pug");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var notify = require("gulp-notify");
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify-es').default;
// var rename = require("gulp-rename");


// config
var paths = {
  src: {
    pug: "src/**/*.pug",
    babel: "src/**/*.js",
    sass: "src/**/*.scss",
    static: "static/**/*",
    browserify: "src/app.js"
  },
  dest: { 
    html: "build",
    js: "build",
    css: "build",
    static: "build",
    browserify: "build"
  }
};
var browsers = "> 1%, last 2 versions, IE >= 9, Firefox ESR"

// tasks

gulp.task("pug", function() {
  return gulp.src(paths.src.pug)
    .pipe(pug({
      pretty: true
    }))
    .on('error', notify.onError({
      message: "Pug error: <%= error.message %>",
      title: "Pug error"
    }))
    .pipe(gulp.dest(paths.dest.html))
    .pipe(notify({
      title: "Success",
      message: "Compiled Pug file to HTML: <%= file.relative %>"
    }));
});

gulp.task("babel", function() {
  return gulp.src([paths.src.babel, "!src/**/popup.js"])
    // .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [
        ["env", {"targets": {"browsers": browsers}}]
      ]
    }))
    .on('error', notify.onError({
      message: "Babel error: <%= error.message %>",
      title: "Babel error"
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.js))
    .pipe(notify({
      title: "Success",
      message: "Compiled Babel file to JS: <%= file.relative %>"
    }));
});

gulp.task("sass", function() {
  return gulp.src(paths.src.sass)
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', notify.onError({
      message: "Sass error: <%= error.message %>",
      title: "Sass error"
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(autoprefixer({
      env: browsers
    }))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(notify({
      title: "Success",
      message: "Compiled Sass file to CSS: <%= file.relative %>"
    }));
});

gulp.task("static", function() {
  return gulp.src(paths.src.static)
    .pipe(gulp.dest(paths.dest.static))
    .pipe(notify({
      title: "Success",
      message: "Copied static file: <%= file.relative %>"
    }));
});

gulp.task("browserify", function() {
  return gulp.src(paths.src.browserify)
    .pipe(browserify({
      insertGlobals: true,
      debug: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.browserify))
    .pipe(notify({
      title: "Success",
      message: "Browserfied: <%= file.relative %>"
    }));
});


gulp.task("clean", function(done) {
  return del("build/**/*", done);
});

gulp.task("watch", function() {  
  gulp.watch(paths.src.pug, gulp.task("pug"));
  gulp.watch(paths.src.babel, gulp.task("babel"));
  gulp.watch(paths.src.sass, gulp.task("sass"));
  gulp.watch(paths.src.static, gulp.task("static"));
  gulp.watch(paths.src.browserify, gulp.task("browserify"));
});

gulp.task("build",
  gulp.series("clean",
    gulp.parallel("pug", "babel", "sass", "static", "browserify")));

gulp.task("default", 
  gulp.series("build", "watch"));