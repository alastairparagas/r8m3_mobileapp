var gulp = require('gulp');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;


gulp.task('sass', function () {
	
	return gulp.src('www/scss/**/*.scss')
		.pipe( sass(
			{
				outputStyle: 'compressed'
			}
		))
		.pipe( gulp.dest('www/css') );
	
});

gulp.task('styles', ['sass']);


gulp.task('angular-documentation', shell.task([
    'node node_modules/angular-jsdoc/node_modules/jsdoc/jsdoc.js -p' + 
    ' -c node_modules/angular-jsdoc/conf.json' +
    ' -t node_modules/angular-jsdoc/template' +
    ' -d dev-docs' + 
    ' README.md' +
    ' -r www/js'
]));

gulp.task('scripts', ['angular-documentation']);


gulp.task('bower', function () {

	return gulp.src('www/index.html')
		.pipe( wiredep({
			directory: 'www/bower_components/'
		}) )
		.pipe( gulp.dest('www') );

});


gulp.task('watch', function ( ) {

	gulp.watch('www/scss/**/*.scss', ['styles']);
	gulp.watch('www/js/**/*.js', ['scripts']);
	gulp.watch('www/bower_components', ['bower']);

});


gulp.task('default', ['scripts', 'styles']);