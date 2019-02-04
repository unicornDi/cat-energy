"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");
var csso = require('gulp-csso');
var rename = require("gulp-rename");


gulp.task("css", function () {
      return gulp.src("./source/sass/style.scss") //change adress
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
      autoprefixer()
      ]))
      .pipe(gulp.dest("source/build/css")) //
      .pipe(csso())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest("source/build/css")); //
});

gulp.task("sprite", function () {
  return gulp.src("./source/img/icon-*.svg")
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/build/img")); //
  });

gulp.task("html", function () {
  return gulp.src("./source/*.html") //
  .pipe(posthtml([
  include()
  ]))
  .pipe(gulp.dest("build"));
 });

gulp.task("server", function () {
  server.init({
    server: "source/", //
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("copy", function () {
 return gulp.src([
 "source/fonts/**/*.{woff,woff2}",
  "source/img/**",
  "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
  });

  gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html"
  ));
