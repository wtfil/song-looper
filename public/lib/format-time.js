module.exports = function formatTime(time) {
	var minutes = ~~(time / 60)
	var seconds = ~~(time % 60);
	if (minutes >= 1) {
		minutes = minutes >= 10 ? String(minutes) : ('0' + minutes);
	} else {
		minutes = '00';
	}
	seconds = seconds >= 10 ? String(seconds) : ('0' + seconds);
	return minutes + ':' + seconds;
};
