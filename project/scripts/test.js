export function command (commander) {
  commander
    .command(`test [suite]`)
    .description('Run the project test suites')
    .action((argv = {}) => {

    })
}
