export { run } from '@oclif/command'

process.on('SIGINT', function () {
    process.exit(1)
})
