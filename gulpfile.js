const gulp = require('gulp');
const concat = require('gulp-concat')

const sass = require('gulp-sass'),
	  sourcemaps = require('gulp-sourcemaps')
	  postcss      = require('gulp-postcss')

const babel = require('gulp-babel')

const minifyJS = require('gulp-minify')

const uglify = require('gulp-uglify')
const eslint = require('gulp-eslint')

const imagemin = require('gulp-imagemin')
const connect = require('gulp-connect-php')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const browserSync = require('browser-sync').create()

const src  = "./src/"
const dist = "./dist/"

gulp.task('connect', (done) => {
  console.log(`Invoking connect-php on PID: ${process.pid}.`)
  
  connect.server({
    port: 3002,
  }, () =>{
  		browserSync.init({
			proxy: '127.0.0.1:3002',
			open: false,
			ghostMode: false,
			files: [
    			dist + 'css/*.css',
    			dist + 'js/**/*.js',
    			src + '../**/*.html',
    			src + '../**/*.php'
			]
		})
  })
  
  process.once('SIGUSR2', () => {
    console.log("Got SIGUSR2, invoking callback.")
    connect.closeServer()
    done()
  });
  
  done()
});

gulp.task('styles', () => {
    return gulp.src( src + 'sass/**/*.scss')
    	.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
        	autoprefixer({ overrideBrowserslist: ['last 2 versions', 'ie >= 9'] }),
        	cssnano()
        ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( dist + 'css/'))
});

gulp.task('javascript', () => {
  	return gulp.src([ src + 'js/**/*.js'])
  		.pipe(eslint())
  		.pipe(sourcemaps.init())
  		.pipe(eslint.format())
  		.pipe(babel({
	  		presets: ['env']
	  	}))
  		.pipe(concat('main.js'))
  		.pipe(uglify())
  		.pipe(sourcemaps.write('./'))
  		.pipe(gulp.dest( dist + 'js/'))
  		
});

gulp.task('images', () => {
     return gulp.src([
     		src + 'images/**/*',
     		src + 'img/**/*',
     		src + 'imgs/**/*'
     	 ])
         .pipe(imagemin({
             progressive: true,
             svgoPlugins: [{removeViewBox: false}]
         }))
         .pipe(gulp.dest(dist + 'images/'))
});

//Watch task
gulp.task('default', () => {
	
    gulp.watch( src + 'sass/**/*.scss', gulp.series('styles'))
    gulp.watch( src + 'js/**/*.js', gulp.series('javascript'))
	
	gulp.parallel(['styles', 'javascript', 'connect'])()
});

gulp.task('compress', () =>{
	gulp.series(['images'])()
});
