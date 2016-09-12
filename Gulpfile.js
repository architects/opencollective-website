const gulp = require('gulp');
const gutil = require("gulp-util");
const svgSprite = require('gulp-svg-sprite');

const SRC_DIR = 'frontend/src';

process.env.NODE_CONFIG_DIR = "./server/config";
const config = require('config');
const request = require('request');

gulp.task('purge', (cb) => {
  if (!config.cloudflare.email) {
    return gutil.log("purge", gutil.colors.yellow("CLOUDFLARE_EMAIL missing in the env. Skipping purging cloudflare cache"));
  }
  if (!config.cloudflare.key) {
    return gutil.log("purge", gutil.colors.yellow("CLOUDFLARE_KEY missing in the env. Skipping purging cloudflare cache"));
  }
  const options = {
    method: 'DELETE',
    uri: "https://api.cloudflare.com/client/v4/zones/37b6a50c4c5be74e5a6ab8e34620bb1b/purge_cache",
    headers: {
      'X-Auth-Email': config.cloudflare.email,
      'X-Auth-Key': config.cloudflare.key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'purge_everything': true})
  }
  request(options, (err, res, body) => {
    if (err) return cb(JSON.stringify(err));
    const response = JSON.parse(body);
    if (!response.success) return cb(response.errors[0].message);
    return cb(null, "Success");
  });
});

gulp.task('build', ['build:svg'])

gulp.task('build:svg', () => {
  return gulp.src(`${SRC_DIR}/assets/svg/*.svg`)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: 'sprite.svg',
          inline: true,
          example: true,
          dest: 'images'
        }
      },
      shape: {
        id: {
          generator: 'svg-%s'
        }
      }
    }))
    .pipe(gulp.dest('frontend/src/assets'));
});

gulp.task('watch:svg', () => {
  gulp.watch(`${SRC_DIR}/assets/svg/*.svg`, ['build:svg']);
});
