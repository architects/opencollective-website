import paths from '../../../webpack/paths' // eslint-disable-line
import expect from 'expect';

const PROJECT_ROOT = process.cwd()

describe('Paths Configuration', () => {
  it('knows the important source paths', () => {
    expect(paths.SOURCE_PATH).toEqual(`${PROJECT_ROOT}/frontend/src`)
  })

  it('provides an easy way to construct paths', () => {
    expect(paths.frontend.relative('index.web.js')).toEqual(`./frontend/src/index.web.js`)
    expect(paths.server.relative('index.node.js')).toEqual(`./server/src/index.node.js`)
  })
})
