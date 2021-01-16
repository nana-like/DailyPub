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
var fileinclude = require("gulp-file-include");
var del = require("del");
var ejs = require('gulp-ejs');
var pug = require('gulp-pug');
var log = require('fancy-log');
const rename = require('gulp-rename');

global.project = require('./package.json');
sass.compiler = require('node-sass');

var comment = require('./config/headerComment');
var paths = project.paths;

var files = {
  css: 'css/**/*.scss',
  ejs: 'views/**/*.ejs',
  pug: 'views/**/*.pug',
  html: 'views/**/*.html',
  js: 'scripts/**/*.js'
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
      // since: gulp.lastRun(styleSheet)
      // sourcemaps: true
    })
    .pipe(sass(opts.sass)).on('error', sass.logError)
    .pipe(postcss([autoprefixer()]))
    .pipe(headerComment(opts.header))
    .pipe(gulp.dest(path.resolve(__dirname, paths.dist, 'css')))
    .pipe(browserSync.stream());
};

var views = () => {
  return gulp
    .src(files.html, {
      cwd: path.resolve(__dirname, paths.dist)
    })
    // .pipe(fileinclude({
    //   prefix: "@@",
    //   basepath: "@file",
    //   context: { "id": "" },
    // }))
    .pipe(beautify.html({
      indent_size: 2,
      preserve_newlines: false
    }))
    .pipe(gulp.dest(path.resolve(__dirname, paths.dist)))
    .pipe(browserSync.stream());
};

var ejs = () => {
  return gulp
  .src(files.ejs, {
    cwd: path.resolve(__dirname, paths.src),
    // since: gulp.lastRun(views)
  })
  .pipe(gulpIgnore.exclude('_*/**.ejs'))
  .pipe(gulpEjsMonster())
  .pipe(rename({ extname: '.html' }))
  .pipe(gulp.dest(path.resolve(__dirname, paths.dist, 'views')))
  .pipe(browserSync.stream());
}

// var pug = () => {
//   return gulp
//     .src(files.pug, {
//       cwd: path.resolve(__dirname, paths.src),
//     })
//     // .pipe(pug({ pretty: true }))
//     .pipe(gulp.dest(path.resolve(__dirname, paths.dist, 'views')))
//     .pipe(browserSync.stream());
// }


var html = () => {
  return gulp
    .src(files.html, {
      cwd: path.resolve(__dirname, paths.src)
    })
    .pipe(fileinclude({
      prefix: "@@",
      basepath: "@file",
      context: { "id": "" },
    }))
    // .pipe(beautify.html({
    //   indent_size: 2,
    //   preserve_newlines: false
    // }))
    .pipe(gulp.dest(path.resolve(__dirname, paths.dist)))
    .pipe(browserSync.stream());
};

var scripts = () => {
  var opts = {
    header: comment(project)
  };
  return gulp
  .src(files.js, {
    cwd: path.resolve(__dirname, paths.src),
    // since: gulp.lastRun(scripts)
  })
  // TODO: 압축 옵션 추가하기
  .pipe(headerComment(opts.header))
  .pipe(gulp.dest(path.resolve(__dirname, paths.dist, 'scripts')))
  .pipe(browserSync.stream());
}

var watch = () => {
  // gulp.watch(path.resolve(__dirname, paths.src, files.ejs), ejs);
  gulp.watch(path.resolve(__dirname, paths.src, files.html), html);
  gulp.watch(path.resolve(__dirname, paths.src, files.css), styleSheet);
  gulp.watch(path.resolve(__dirname, paths.src, files.js), scripts);
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
    // ejs,
    html,
    styleSheet,
    scripts,
    watch
  )
);


gulp.task('default', tasks, function () {
  console.log(" === 👩‍🔧 걸프가 열심히 일하고 있습니다 👨‍🔧 ===");
});
