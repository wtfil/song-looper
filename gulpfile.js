var gulp = require('gulp');
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
	}
};

gulp.task('server', function (cb) {
	var port = process.env.NODE_PORT || 3000;
	server.createServer().listen(port, cb);
	gutil.log('Server started at ' + gutil.colors.green('http://127.0.0.1:' + port));
});

function transform(file, opts) {
	opts.es6 = true;
	return reactify(file, opts);
}

gulp.task('watch', function () {
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
