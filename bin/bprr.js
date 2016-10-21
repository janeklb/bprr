#!/usr/bin/env node

var bprr = require('../bprr.js');

var path = process.argv[2],
    encoding = process.argv[3];

bprr(path, encoding);