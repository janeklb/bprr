"use strict";

var libxmljs = require('libxmljs'),
    _ = require('lodash'),
    timed = require('./timed'),
    fs = require('fs');

var BPRXPATH = '//xmlns:TraceData/xmlns:Events/xmlns:Event[@name="Blocked process report"]/xmlns:Column[@name="TextData"]/text()';

class BlockedProcessReport {

    constructor(path, encoding) {

        this.queries = {
            all: {},
            blocking: {},
            blocked: {}
        };
        this.reports = {
            all: null,
            blocking: null,
            blocked: null
        };

        this.xml = timed('Read xml file', () => fs.readFileSync(path, encoding || 'ucs2'));
    }

    _addQuery(query, store) {
        if (!store[query]) {
            store[query] = 0;
        }
        store[query]++;
    }

    addBlocking(query) {
        this._addQuery(query, this.queries.all);
        this._addQuery(query, this.queries.blocking);
    }

    addBlocked(query) {
        this._addQuery(query, this.queries.all);
        this._addQuery(query, this.queries.blocked);
    }

    report() {
        console.log('\n')
        this.printReport('all');
        this.printReport('blocking');
        this.printReport('blocked');
        console.log('-------------');
    }

    printReport(type) {

        console.log('----------------------')
        console.log(type, 'queries report');

        var report =
                _.map(
                    this.queries[type],
                    (count, query) => ({ query, count })
                )
                .sort((a, b) => b.count - a.count);

        console.log('found', report.length, 'unique queries', '\n');

        report.forEach((r) => {
           console.log('# executions: ', r.count);
           console.log('\t', r.query, '\n');
        });
        console.log();
    }

    // ---------- libxmljs

    load_libxmljs() {

        var xmlDoc  = timed('Load XML', () => libxmljs.parseXml(this.xml));
        var defNS   = xmlDoc.root().namespace().href();

        var bprs    = timed('Find Blocked process report TextData', () => xmlDoc.find(BPRXPATH, defNS));

        console.info("Found", bprs.length, "'Blocked process report' events");

        bprs.forEach((node) => this.addEvent_libxml(node.text()));
    }

    addEvent_libxml(xmlEventTextData) {

        var xmlDoc = libxmljs.parseXml(xmlEventTextData);

        var blocked     = xmlDoc.find('//blocked-process/process/inputbuf')[0].text();
        var blocking    = xmlDoc.find('//blocking-process/process/inputbuf')[0].text();

        this.addBlocking(_.trim(blocking));
        this.addBlocked(_.trim(blocked));
    }

}

module.exports = function(path, encoding) {
    var bpr = new BlockedProcessReport(path, encoding);
    bpr.load_libxmljs();
    bpr.report();
};
