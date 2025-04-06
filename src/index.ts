export { run } from '@oclif/core'

process.on('SIGINT', function () {
    process.exit(1)
})
