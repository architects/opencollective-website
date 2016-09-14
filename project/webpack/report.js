export class Report {
  static create (stats, options = {}) {
    return new Report(stats, options)
  }

  constructor (stats, options = {}) {

    this.hasErrors = stats.hasErrors()
    this.hasWarnings = stats.hasWarnings()
    this.isSuccess = !this.hasWarnings && !this.hasErrors

    this.stats = stats
    this.json = stats.toJson(options)

    this.endTime = stats.endTime
    this.startTime = stats.startTime
    this.hash = stats.hash
  }

  get formattedWarnings() {
    return this.json.warnings.map(warning => formatMessage(warning))
  }

  get formattedErrors() {
    return this.json.errors
      .filter(error => isLikelyASyntaxError(error))
      .map(error => formatMessage(error))
  }

  get timeInMs() {
    return ((this.endTime-this.startTime)/ 1000).toFixed(2)
  }

}

export default Report

const friendlySyntaxErrorLabel = 'Syntax error'

const isLikelyASyntaxError = (message) => {
  return message.indexOf('SyntaxError') !== -1
}

const formatMessage = (message) =>
  message
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )

    //.replace(/using description file:.*/m, '')

    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y

    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
