var gulp = require('gulp');
var path = require('path');
var autoprefixer = require('autoprefixer');
var browserSync = require("browser-sync");
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var headerComment = require('gulp-header-comment');
var gulpEjsMonster = require('gulp-ejs-monster');
var beautify = require('gulp-beautify');
var gulpIgnore = require('gulp-ignore');
var del = require("del");

global.project = require('./package.json');
sass.compiler = require('node-sass');

var comment = require('./config/headerComment');
var paths = project.paths;

var files = {
  css: 'css/**/*.scss',
  html: 'views/**/*.ejs'
}

var sync = () => {
  browserSync.init({
    port: project.port,
    server: {
      baseDir: path.resolve(__dirname, paths.dist)
    }
  });
};

var styleSheet = () => {
  var opts = {
    header: comment(project),
    sass: {
      outputStyle: 'expended'
    }
  };
  return gulp
    .src(files.css, {
      cwd: path.resolve(__dirname, paths.src),
      since: gulp.lastRun(styleSheet)
      // sourcemaps: true
    })
    .pipe(sass(opts.sass)).on('error', sass.logError)
    .pipe(postcss([autoprefixer()]))
    .pipe(headerComment(opts.header))
    .pipe(gulp.dest(path.resolve(__dirname, paths.dist, 'css')))
    .pipe(browserSync.stream());
};

// var views = () => {
//   return gulp
//     .src('views/**/[^_]*.ejs', {
//       cwd: path.resolve(__dirname, paths.src),
//       since: gulp.lastRun(views)
//     })
//     .pipe(gulp.dest(path.resolve(__dirname, paths.dist)))
//     .pipe(browserSync.stream());
// };

var ejs = () => {
  return gulp
  .src(files.html, {
    cwd: path.resolve(__dirname, paths.src),
    // since: gulp.lastRun(views)
  })
  .pipe(gulpIgnore.exclude('_*/**.ejs'))
  .pipe(gulpEjsMonster())
  // ! 별도 태스크로 분리
  // .pipe(beautify.html({
  //   indent_size: 2,
  //   preserve_newlines: false
  // }))
  .pipe(gulp.dest(path.resolve(__dirname, paths.dist+'/views')))
  .pipe(browserSync.stream());
}

var views = () => {

}

var watch = () => {
  gulp.watch(path.resolve(__dirname, paths.src, files.css), { interval: 500 }, styleSheet);
  gulp.watch(path.resolve(__dirname, paths.src, files.html), ejs);
}

function clean() {
  var opts = {
    force: true
  };

  return del(paths.dist, opts);
}

var tasks = gulp.series(
  clean,
  gulp.parallel(
    sync,
    ejs,
    styleSheet,
    watch
  )
);


gulp.task('default', tasks, function () {
  console.log(" === 👩‍🔧 걸프가 열심히 일하고 있습니다 👨‍🔧 ===");
});
