var gulp = require('gulp')
  , gutil = require('gulp-util')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , jasmine = require('gulp-jasmine')
  , reporters = require('jasmine-reporters')
  , webserver = require('gulp-webserver')
  , Server = require('karma').Server
  , runSequence = require('run-sequence')

var webserverStream;

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules{,/**}']).pipe(jshint()).pipe(jshint.reporter(stylish))
})

gulp.task('webserver-for-dev', function(done) {
  webserverStream = gulp.src('./')
    .pipe(webserver({
      port: 8080,
      directoryListing: true,
      livereload: true,
      open: true
    }));
    done();
});


gulp.task('webserver-for-e2e', function(done) {
  webserverStream = gulp.src('./')
    .pipe(webserver({
      port: 8080
    }));
    done();
});

gulp.task('kill-webserver', function(done) {
	webserverStream.emit("kill");
	done();
})

gulp.task('unit-tests', function() {
	return gulp.src('spec/unit.js')
		.pipe(jasmine({
			reporter: new reporters.JUnitXmlReporter()
		}))
})


gulp.task("test", function() {
	runSequence(['webserver-for-e2e', 'unit-tests'], 'e2e-karma', 'kill-webserver');
});

gulp.task('e2e-karma', function (done) {

	gutil.log(gutil.colors.red('WARNING: you must have `gulp webserver` going before running this task'));

  new Server({
    configFile: __dirname + '/karma.conf.js',
    proxies: {
	  '/demos/img/': 'http://localhost:8080/demos/img/'
	},
    singleRun: true
  }, done).start();
});

gulp.task('default', ['lint'])
