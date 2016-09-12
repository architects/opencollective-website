import * as webpack from '../webpack'

module.exports = function (options = {}, context = {}) {
  console.log(webpack.getConfig())
}
