export const info = {
  command: 'render <url>',
  description: 'renders the content at the given path',
  example: 'render /hoodie'
}

export function execute (options = {}, context = {}) {
  const { project, command } = context
  const cli = project.cli
}
