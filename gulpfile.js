var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var less = require('gulp-less');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var server = require('http-server');
var fs = require('fs');

var files = {
	js: {
    	src: './public/index.js',
    	dest: './public/build.js'
	},
	css: {
		src: './public/index.less',
		dest: './public/'
	}
};

gulp.task('server', function (cb) {
	var port = process.env.NODE_PORT || 3000;
	server.createServer().listen(port, cb);
	gutil.log('Server started at ' + gutil.colors.green('http://127.0.0.1:' + port));
});

gulp.task('css', function () {
	return gulp.src(files.css.src)
		.pipe(less())
		.on('error', function (e) {
			gutil.log(gutil.colors.red(e.message));
			this.emit('end');
		})
		.pipe(gulp.dest(files.css.dest));
});

gulp.task('js', function () {
	return browserify(files.js.src)
		.transform('babelify')
		.transform('reactify')
		.bundle()
		.pipe(fs.createWriteStream(files.js.dest));

});

gulp.task('watch', ['js-watch', 'css-watch'])

gulp.task('css-watch', ['css'], function () {
	gulp.watch(files.css.src, ['css']);
});

gulp.task('js-watch', function () {
    var bundler = watchify(browserify(files.js.src, {debug: true}));

    bundler
    	.transform('babelify')
    	.transform('reactify');
    bundler.on('update', rebundle);

    function onError(e) {
        gutil.log(gutil.colors.red(e.message));
    }

    function rebundle() {
        var start = Date.now();

        return bundler.bundle()
          .on('error', onError)
          .on('end', function () {
              var time = Date.now() - start;
              gutil.log('Building \'' + gutil.colors.green(files.js.src) + '\' in ' + gutil.colors.magenta(time + ' ms'));
          })
          .pipe(fs.createWriteStream(files.js.dest));
    }

    rebundle();

});

gulp.task('deploy', ['css', 'js'], function () {
	return gulp.src('./public/**/*')
		.pipe(ghPages());
});

gulp.task('dev', ['server', 'watch']);
