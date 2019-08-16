

const exec = require('child_process').exec;
var cmdStr = 'bash bash.sh';
exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
        console.log('get weather api error:' + stderr);
    } else {
        var data = JSON.parse(stdout);
        console.log(data);
    }

});