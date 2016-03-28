var gulp = require('gulp')
  , autoprefixer = require('gulp-autoprefixer')
  , gutil = require('gulp-util')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , jasmine = require('gulp-jasmine')
  , reporters = require('jasmine-reporters')
  , webserver = require('gulp-webserver')
  , Server = require('karma').Server
  , runSequence = require('run-sequence')
  , os = require("os")

var webserverStream
  , forceKill = false

gulp.task("vendor-prefix", function() {

	var autoPrefixerBrowsers = [
	    // Desktop
	      'last 3 Chrome versions'
	    , 'last 2 Firefox versions'
	    , 'last 2 Safari versions'
	    , 'last 2 Edge versions'
	    , 'ie >= 9'
	    // Mobile
	    , 'last 3 ChromeAndroid versions'
	    , 'last 3 Android versions'
	    , 'last 3 FirefoxAndroid versions'
	    , 'last 3 iOS versions'
	    , 'last 2 ExplorerMobile versions'
	    , 'last 2 OperaMobile versions'
	    // Other
	    , '> 2% in AU'
	]

	return gulp.src("./src/nimblepic.css")
		.pipe(autoprefixer({browsers: autoPrefixerBrowsers}))
		.pipe(gulp.dest("./demos/css"));
});

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules{,/**}']).pipe(jshint()).pipe(jshint.reporter(stylish))
})

gulp.task('webserver-for-dev', function() {
  webserverStream = gulp.src('./')
    .pipe(webserver({
      port: 8080,
      directoryListing: true,
      livereload: true,
      open: true
    }));
    return webserverStream;
});


gulp.task('webserver-for-test', function() {
  webserverStream = gulp.src('./')
    .pipe(webserver({
      port: 8081
    }));
    return webserverStream;
});


gulp.task('unit-tests', function() {
	return gulp.src('spec/unit.js')
		.pipe(jasmine({
			reporter: new reporters.JUnitXmlReporter()
		}))
})


gulp.task("test", function(done) {
	runSequence(['webserver-for-test', 'unit-tests', 'lint', 'vendor-prefix'], 'e2e-tests', 'e2e-tests-responsive', done);
});

gulp.task("test-just-e2e", function(done) {
	forceKill = true;
	runSequence(['webserver-for-test', 'lint'], 'e2e-tests', done);
});

gulp.task("test-just-resp", function(done) {
	forceKill = true;
	runSequence(['webserver-for-test', 'lint'], 'e2e-tests-responsive', done);
});




gulp.task('e2e-tests', function (done) {

	gutil.log(gutil.colors.magenta('WARNING: you must have `gulp webserver` going before running this task, plus an active internet connection (for karma proxies).'));

	new Server({
		configFile: __dirname + '/karma.conf.js',
		proxies: {
		  '/demos/img/': 'http://localhost:8081/demos/img/'
		},
		 singleRun: true
	}, function() {
		if(forceKill && webserverStream) webserverStream.emit("kill");
		done();
	}).start();
});


gulp.task('e2e-tests-responsive', function (done) {

	gutil.log(gutil.colors.magenta('WARNING: you must have `gulp webserver` going before running this task, plus an active internet connection (for karma proxies).'));

	new Server({
		configFile: __dirname + '/karma-responsive.conf.js',
		proxies: {
		  '/demos/img/': 'http://localhost:8081/demos/img/'
		},
		 singleRun: true
	}, function() {
		if(webserverStream) webserverStream.emit("kill");
		
		if(forceKill) gutil.log(gutil.colors.magenta('gulp task "done" callback not working because karma process still running, so manually exiting.'));
		
		done();
		
		if(forceKill) process.exit(1);
	}).start();
});

gulp.task('default', function(done) {
	runSequence('vendor-prefix', 'test', done)
})
