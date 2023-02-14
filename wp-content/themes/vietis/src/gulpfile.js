/* global require */
"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cleanCSS = require("gulp-clean-css");
var del = require("del");
var plumber = require("gulp-plumber");
var paths = {
  wedding: {
    styles: {
      src: "sass/**/*.scss",
      dest: "../css",
    },
    scripts: {
      src: "scripts/**/*.js",
      dest: "../js",
    },
  },
};

function clean() {
  // return del(['sass']);
  return false;
}

function styles(path) {
  return (
    gulp
      .src(path.styles.src)
      .pipe(sass())
      .pipe(cleanCSS())
      // .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.styles.dest))
      .pipe(gulp.dest(path.styles.dest, { sourcemaps: true }))
  );
}

function scripts(path) {
  return (
    gulp
      .src(path.scripts.src)
      .pipe(
        babel({
          presets: [
            [
              "@babel/env",
              {
                modules: false,
              },
            ],
          ],
        })
      )
      .pipe(plumber())
      .pipe(uglify())
      // .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.scripts.dest))
      .pipe(gulp.dest(path.scripts.dest, { sourcemaps: true }))
  );
}

function watch() {
  gulp.watch(paths.wedding.scripts.src, function () {
    return scripts(paths.wedding);
  });
  gulp.watch(paths.wedding.styles.src, function () {
    return styles(paths.wedding);
  });
}

exports.clean = clean;
exports.watch = watch;
exports.default = watch;
