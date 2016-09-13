import expect from 'expect';

const project = require('../../project').project

describe('Paths Configuration', () => {
  it('knows the important source paths', () => {
    expect(project.paths.SOURCE_PATH).toEqual(`${process.cwd()}/frontend/src`)
  })

  it('provides an easy way to construct paths', () => {
    expect(project.paths.frontend.srcPath('index.web.js')).toEqual(`./frontend/src/index.web.js`)
    expect(project.paths.server.srcPath('index.node.js')).toEqual(`./server/src/index.node.js`)
  })
})
