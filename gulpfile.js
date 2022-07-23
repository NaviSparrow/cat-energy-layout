import gulp from "gulp";
import browser from "browser-sync";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";

//const
export const sassPath = './source/styles/style.scss';
export const cssPath = './source/css';
export const watchSass = './source/styles/**/*.scss';
export const watchHtml = './source/*.html';

//Tasks
export const styles = () => {
  return gulp.src(sassPath, {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(cssPath, { sourcemaps: '.' }))
    .pipe(browser.stream());
}

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
    port: 3000,
  });
  done();
}

//Watcher
const watcher = () => {
  gulp.watch(watchSass, gulp.series(styles));
  gulp.watch(watchHtml).on('change', browser.reload);
}

//gulp
gulp.task(
  'default',
  gulp.series(styles, server, watcher)
);
