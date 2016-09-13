import expect from 'expect';

const paths = require('../../paths')
const PROJECT_ROOT = process.cwd()

describe('Paths Configuration', () => {
  it('knows the important source paths', () => {
    expect(paths.SOURCE_PATH).toEqual(`${PROJECT_ROOT}/frontend/src`)
  })

  it('provides an easy way to construct paths', () => {
    expect(paths.frontend.srcPath('index.web.js')).toEqual(`./frontend/src/index.web.js`)
    expect(paths.server.srcPath('index.node.js')).toEqual(`./server/src/index.node.js`)
  })
})
