import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import htmlmin from "gulp-htmlmin";
import csso from  "postcss-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgomg from 'gulp-svgmin';
import svgStore from "gulp-svgstore";
import {deleteSync} from "del";

//const src
export const srcSassPath = './source/styles/style.scss';
export const srcCssPath = './source/css';
export const srcHtmlPath = './source/*.html';
export const srcJsPath = 'source/js/*.js';
export const srcImagesPath = 'source/images/**/*.{jpg,png}';
export const srcSvgPath = 'source/images/**/*.svg';

//const watch
export const watchSass = './source/styles/**/*.scss';
export const watchHtml = './source/*.html';
export const watchJs = './source/js/main.js';

//const build
export const buildPath = 'build';
export const buildCssPath = 'build/css';
export const buildJsPath = 'build/js';
export const buildImagesPath = 'build/images';

//Tasks

//CSS
export const styles = () => {
  return gulp.src(srcSassPath, {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulp.dest(buildCssPath))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(buildCssPath, { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
export const html = () => {
  return gulp.src(srcHtmlPath)
    .pipe(htmlmin( { collapseWhitespace: true}))
    .pipe(gulp.dest(buildPath));
}

//JS
export const scripts = () => {
  return gulp.src(srcJsPath)
    .pipe(terser())
    .pipe(gulp.dest(buildJsPath))
}

//Images
export const optimizeImages = () => {
  return gulp.src(srcImagesPath)
    .pipe(squoosh())
    .pipe(gulp.dest(buildImagesPath));
}

export const copyImages = () => {
  return gulp.src(srcImagesPath)
    .pipe(gulp.dest(buildImagesPath))
}

//WebP
export const createWebp = () => {
  return gulp.src(srcImagesPath)
    .pipe(squoosh( {
      webp: {},
    }))
    .pipe(gulp.dest(buildImagesPath))
}

//SVG
export const svg = () => {
  return gulp.src(srcSvgPath)
    .pipe(svgomg())
    .pipe(gulp.dest(buildImagesPath))
}

export const createSprite = () => {
  return gulp.src(srcSvgPath)
    .pipe(svgomg())
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(buildImagesPath))
}

export const copyFiles = () => {
  return gulp.src(['source/fonts/*.{woff2,woff}'], {base: 'source'})
    .pipe(gulp.dest(buildPath))
}

//clean
export const cleanBuild =  async () => {
  return deleteSync(['build/*/']);
}

//Server
export const server = (done) => {
  browser.init({
    server: {
      baseDir: buildPath
    },
    cors: true,
    notify: false,
    ui: false,
    port: 3000,
  });
  done();
}

const reload = (done) => {
  browser.reload();
  done();
}

//Watcher
const watcher = () => {
  gulp.watch(watchSass, gulp.series(styles, reload));
  gulp.watch(watchHtml, gulp.series(html, reload));
  gulp.watch(watchJs, gulp.series(scripts));
}

const mainTasks = gulp.parallel(styles, html, scripts, svg, createSprite, createWebp);

//BuildTask
const build = gulp.series(cleanBuild, copyFiles, optimizeImages, mainTasks);

//DevTask (default)
const defaultTask = gulp.series(cleanBuild, copyFiles, copyImages, mainTasks, gulp.parallel(server, watcher));
gulp.task('default', defaultTask);
