var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var server = require('http-server');
var reactify = require('reactify');
var fs = require('fs');

var files = {
	js: {
    	src: './public/index.js',
    	dest: './public/_index.js'
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
		.transform(transform)
		.bundle()
		.pipe(fs.createWriteStream(files.js.dest));

});

gulp.task('watch', ['js-watch', 'css-watch'])

gulp.task('css-watch', ['css'], function () {
	gulp.watch(files.css.src, ['css']);
});

function transform(file, opts) {
	opts.es6 = true;
	return reactify(file, opts);
}

gulp.task('js-watch', function () {
    var args = watchify.args;
    args.degub = true;
    var bundler = watchify(browserify(files.js.src, args));

    bundler.transform(transform);
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

gulp.task('dev', ['server', 'watch']);
gulp.task('prod', ['css', 'js'])
