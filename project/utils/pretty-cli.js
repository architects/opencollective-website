const { rainbow } = require('colors')
const pretty = require('pretty-cli')
const isArray = require('lodash/isArray')
const mapValues = require('lodash/mapValues')
const padEnd = require('lodash/padEnd')
const chalk = require('chalk')
const max = require('lodash/max')

export const template = () => {
  const block = (msg) => ` ${msg} `

  const types =  {
    'info': {initial: 'I', blockColor:['bgBlue','black'], titleColor:'blue'},
    'error': {initial: 'E', blockColor:['bgRed','white'], titleColor:'red'},
    'warning': {initial: 'W', blockColor:['bgYellow','black'], titleColor:'yellow'},
    'success': {initial: 'S', blockColor:['bgGreen','black'], titleColor:'green'},
    'note': {initial: 'N', blockColor:['bgBlack','yellow'], titleColor:'yellow'}
  }

  const template = {};

  // template['log'] = function(content){
  //   return content;
  // }

  const indentLines = (lines, spaces) => (
    isArray(lines)
      ? lines.join(`${Array(spaces).join(' ')}`)
      : lines
  )

  Object.keys(types).map((type) => {
    const _specs = types[type];
    template[type] = (content, override) => {
      let line
      const specs={}

      Object.assign(specs, _specs, override)

      if (typeof content !== 'string'){
        let blk

        if (isArray(content)){
          blk = block(specs.initial)
          line = [chalk[specs.blockColor[0]][specs.blockColor[1]](blk), indentLines(content, blk.length+2)].join(" ")
        } else {
          if (content.type === 'title'){
            blk = block(content.name);
            line =  [chalk[specs.blockColor[0]][specs.blockColor[1]](blk),
                    chalk[specs.titleColor](indentLines(content.message, blk.length+2))].join(" ")
          } else {
            blk = block(specs.initial);
            line = [chalk[specs.blockColor[0]][specs.blockColor[1]](blk), indentLines(content.message, blk.length)].join(" ")
          }
        }
      } else {
        line = [chalk[specs.blockColor[0]][specs.blockColor[1]](block(_specs.initial)), content].join(" ")
      }

      return line
    }

    return type
  })

  return template
}

export const attach = (project) => {
  const cli = pretty({template: template()})

  cli.registerCommand = (...args) => cli.addCustomMethod(...args)

  cli.addCustomMethod('print', (message = '', indentationLevel = 0) => {
    console.log(indentationLevel > 0 ? `${Array(indentationLevel).join(' ')}${message}` : message)
  })

  cli.addCustomMethod('paddedList', (items, indentationLevel) => {
    const labels = Object.keys(items)
    const width = max(labels.map(i => i.length + 1))

    mapValues(items, (data, label) => {
      label = `${label}:`
      cli.print(`${padEnd(label, width + 4)} ${data}`, 2)
    })
  })

  cli.addCustomMethod("projectInfo", () => {
    console.log()
    cli.print(`Project ${project.name.blue} ${project.version.cyan} NODE_ENV: ${process.env.NODE_ENV.green}`)
    console.log()
  })

  cli.addCustomMethod("gitInfo", () => {
    cli.print(`Git SHA: ${project.gitInfo.abbreviatedSha.yellow}`)
    cli.print(`Git Branch: ${project.gitInfo.branch.yellow}`)
  })

  cli.addCustomMethod('banner', () => {
    cli.print('')

    cli.print(
      rainbow(require('figlet').textSync('OpenCollective'))
    )

    cli.print('')
  })

  const friendlySyntaxErrorLabel = 'Syntax error'

  const isLikelyASyntaxError = (message) =>
    message.indexOf('SyntaxError') !== -1

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

      // Internal stacks are generally useless so we strip them
      .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y

      // Webpack loader names obscure CSS filenames
      .replace('./~/css-loader!./~/postcss-loader!', '');

  cli.addCustomMethod('clear', () => (
    process.stdout.write('\x1bc')
  ))

  cli.addCustomMethod('displayHeader', () => {
    cli.banner('Open Collective')
  })


  cli.addCustomMethod('showHelp', () => {
    cli.print('Available Commands:\n', 2)
    cli.print()

    mapValues(scripts, (script) => {
      cli.describeComponent({
        type: 'script/help',
        component: script,
        project
      })
    })

    cli.print()
  })

  cli.addCustomMethod('describeComponent', (component) => {
    require('./describe-component').describe(component, project)
  })

  cli.addCustomMethod('buildInfo', (results) => {

    const json = results.json

    cli.print('Signatures'.underline.cyan, 4)
    cli.print(`Git: ${project.gitInfo.branch} ${project.gitInfo.abbreviatedSha.yellow}`, 4)
    cli.print(`Webpack hash: ${results.hash}`, 4)
    cli.print()

    cli.print(`Assets`.underline, 4)

    mapValues(json.assets, (asset) => {
      cli.print(`${asset.name}: ${ asset.size } bytes`, 4)
    })
  })

  /* eslint-disable */
  cli.addCustomMethod('displayWarnings', (title, messages) => {
    if (!messages.length) return;

    cli.warning({type:'title', name:'WARNING', message: title});

    var rx = path.join(__dirname,'../../')+'.*\n';
    var processDir = path.join(process.cwd(),'../')
    messages.forEach(message => {
      var messageString = formatMessage(message)
                            .replace(new RegExp(rx,''), '\\033[0m')
                            .replace(new RegExp(processDir), './');
      cli.warning('Warning in '+ messageString);
    })

    cli.note(['You may use special comments to disable some warnings.',
    'Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.',
    'Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.'
    ]);
  })

    cli.addCustomMethod('displayErrors', function(title, messages){
      if (!messages.length) return;
      cli.error({type:'title', name:'ERROR', message: title});
      if (messages.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        messages = messages.filter(isLikelyASyntaxError);
      }

      var rx = path.join(__dirname,'../../')+'[^:]*: ';
      var processDir = path.join(process.cwd(),'../')

      messages.forEach(message => {
        var messageString = formatMessage(message)
                              .replace(new RegExp(rx,''), '   ')
                              .replace(new RegExp(processDir), './');

        cli.error(messageString);

      });

    })

    return cli
}
