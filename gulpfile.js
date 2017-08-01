const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const iife = require('gulp-iife')

const fileList = [
	'src/libs/*',
	'src/config.js',
	'src/beacon.js'
]

gulp.task('build', function(){
	return gulp.src(fileList)
		.pipe(concat('bc.js'))
		.pipe(iife({useStrict: false}))
		.pipe(uglify({ie8: true}))
		.pipe(gulp.dest('./dist/'))
})

gulp.task('default', ['build'])

gulp.task('watch', function(){
	return gulp.watch('src/**/*.js', ['build'])
})


