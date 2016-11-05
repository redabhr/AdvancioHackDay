var gulp = require("gulp");
var gp_ts = require("gulp-typescript").createProject("tsconfig.json");
var gp_clean = require('gulp-clean');
var gp_concat = require('gulp-concat');
var gp_rename = require('gulp-rename');
var gp_uglify = require('gulp-uglify');
var gp_srcmap = require('gulp-sourcemaps');

//clean
gulp.task("clean-dist", function () {
    return gulp.src('dist/*', { read: false })
        .pipe(gp_clean({ force: true }));
});

//build
gulp.task("build",/*["clean-dist"] ,*/ function () {
    return gp_ts.src("src/**/*")
        .pipe(gp_srcmap.init())
        .pipe(gp_ts())
        .js.pipe(gulp.dest("dist/src"))
        .pipe(gp_concat('AdvancioHackDay.js'))
        .pipe(gp_srcmap.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(gp_rename('AdvancioHackDay.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist/js'));
});
//gulp.task("default",["build"]);