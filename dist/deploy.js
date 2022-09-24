"use strict";
const moment = require('moment');
const execSync = require('child_process').execSync;
const replace = require('replace-in-file');
const dateTime = moment().format('YYYY/MM/DD HH:mm:ss');
const options = {
    files: 'dist/travian_v2.js',
    from: /@@BUILD_TIME@@/g,
    to: dateTime,
};
replace.sync(options);
execSync('git add . && git commit -am Deploy && git push');
