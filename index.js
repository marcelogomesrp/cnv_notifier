let cron = require('node-cron');
let cnv = require('./cnv');

console.log('run first');
cnv.run();
console.log('start cron');

let task = cron.schedule('* * * * *', () => {
  console.log('stoped task');
  cnv.run();
}, {
  scheduled: false
});

task.start();
