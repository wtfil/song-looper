var times = [];
function repeater(formula) {
	times = formula ?
		formula.split('-').map(Number).filter(Number.isFinite) :
		[];
	return repeater;
}

repeater.end = function () {
	return times.length < 2 ? Infinity : times[1];
};
repeater.start = function () {
	return times.length < 2 ? 0 : times[0];
};

module.exports = repeater;
