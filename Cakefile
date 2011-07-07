# Run "cake build"

{exec} = require 'child_process'

task 'build', 'Build the .js files', (options) ->
  exec "coffee -c web.coffee editor/index.coffee", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
