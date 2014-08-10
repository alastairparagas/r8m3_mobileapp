var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;


gulp.task('stylesheets', function () {
	
	return gulp.src('www/scss/**/*.scss')
		.pipe( sass(
			{
				outputStyle: 'compressed' 
			}
		) )
		.pipe( gulp.dest('www/css') );
	
});


gulp.task('scripts', function () {

	return gulp.src('www/js/**/*.js')
		.pipe( jsdoc('dev-docs') );
		
});


gulp.task('bower', function () {

	return gulp.src('www/index.html')
		.pipe( wiredep({
			directory: 'www/bower_components/'
		}) )
		.pipe( gulp.dest('www') );

});


gulp.task('watch', function ( ) {

	gulp.watch('www/scss/**/*.scss', ['stylesheets']);
	gulp.watch('www/js/**/*.js', ['scripts']);
	gulp.watch('www/bower_components', ['bower']);

});


gulp.task('default', ['scripts', 'stylesheets']);