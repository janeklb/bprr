module.exports = function timed(label, fn) {
    console.time(label);
    var ret = fn.call();
    console.timeEnd(label);
    return ret;
};
