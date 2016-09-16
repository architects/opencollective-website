const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');

const SRC_DIR = 'frontend/src';
const DIST_DIR = 'frontend/dist';

gulp.task('build:svg', () => {
  return gulp.src(`${SRC_DIR}/assets/svg/*.svg`)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: 'sprite.svg',
          inline: true,
          example: true,
          dest: 'partials'
        }
      },
      shape: {
        id: {
          generator: 'svg-%s'
        }
      }
    }))
    .pipe(gulp.dest('server/dist/views'));
});

gulp.task('watch:svg', () => {
  gulp.watch(`${SRC_DIR}/assets/svg/*.svg`, ['build:svg']);
});
