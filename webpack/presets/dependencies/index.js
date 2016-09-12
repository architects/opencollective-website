export const base = (options = {}) => {

}

export default base

export const web = (options = {}) => ({
  ...require('./web'),
  ...options
})

export const node = (options = {}) => ({
  ...require('./node'),
  ...options
})

export const targets = {
  node,
  web
}
