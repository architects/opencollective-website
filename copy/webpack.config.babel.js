import project from '../project' // eslint-disable-line
import mapValues from 'lodash/mapValues'

// The Web / User facing builds
const I18N_ENTRY_POINTS = {
  i18n: 'src/index.js'
}

// HACK Some webpack plugins rely on process.cwd() / some resolve relative to the config file.
if (process.argv[1].match(/webpack$/) && process.cwd() !== __dirname) {
  process.chdir(__dirname)
}

export default () => (
  project.getWebpackBase('server', {
    paths: project.paths.copy
  })

  .entry(prepare(I18N_ENTRY_POINTS))

  .output({
    path: project.paths.copy.output
  })

  .context(__dirname)

  .target('node')

  .loader('yaml', ['.yml','.yaml'], {
    loader: 'json!yaml',
    include: [
      __dirname
    ]
  })

  .modules(project.paths.copy.src)
  .modules(__dirname)
  .getConfig()
)

/*
  So that webpack can inject the hot middleware runtimes
  etc, we want to pass it an array. Also to facilitate being
  able to run this script from wherever i pass it an absolute path
 */
const prepare = (entryPoints) => (
  mapValues(entryPoints, (req) => (
    typeof req === 'string' ? [abs(req)] : abs(req)
  ))
)

const abs = (p) => project.paths.copy.join(p)
