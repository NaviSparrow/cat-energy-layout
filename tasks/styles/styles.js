import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import {cssPath, sassPath} from "../../gulpfile";

export const styles = () => {
  return gulp.src(sassPath, {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(cssPath, { sourcemaps: '.' }))
    .pipe(browser.stream);
}
