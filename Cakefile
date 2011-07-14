# Run "cake build-dependencies && cake build"

{exec} = require 'child_process'

task 'build-dependencies', 'Compile all coffee files from ShareJS', (options) ->
  exec "coffee --compile --bare --output node_modules/share/lib/ node_modules/share/src/", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr || 'build-dependencies done.'

task 'build', 'Build the .js files', (options) ->
  exec "coffee -c web.coffee editor/index.coffee", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr || 'build done.'
