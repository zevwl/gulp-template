const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// CSS requirements
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const sassOutputStyle = {
    nested: 'nested',
    compact: 'compact',
    expanded: 'expanded',
    compressed: 'compressed'
};

// JS requirements
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const sourceDirectory = './source/';
const buildDirectory = './build/';

gulp.task('html', () => {
    return gulp.src(`${sourceDirectory}html/index.html`)
        .pipe(gulp.dest(`${buildDirectory}`))
});

gulp.task('css', () => {
    return gulp.src(`${sourceDirectory}sass/main.scss`)
        .pipe(sourceMaps.init())
        .pipe(plumber({errorHandler: function (err) {
            notify({
                title: 'Sass Error',
                message: 'Check the console for more information.'
            }).write(err);
            console.log(err.toString());
            this.emit('end');
        }}))
        .pipe(sass({outputStyle: sassOutputStyle.expanded}).on('error', sass.logError))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(`${buildDirectory}css`));
});

gulp.task('js', () => {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js',
        `${sourceDirectory}js/main.js`
    ])
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${buildDirectory}js`));
});

gulp.task('watch', () => {
    gulp.watch(`${sourceDirectory}sass/**/*.scss`, ['css']);
    gulp.watch(`${sourceDirectory}js/**/*.js`, ['js']);
});


gulp.task('default', () => console.log('First gulp task.'));