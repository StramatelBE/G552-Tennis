const restartJob = require('./restartJob');

const CronIndex = {
  startAllJobs: function () {
    restartJob.start();
  }
};

module.exports = CronIndex;
