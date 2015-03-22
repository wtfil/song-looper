module.exports = function formatTime(time) {
	var minutes = Math.floor(time / 60);
	var seconds = Math.floor(time % 60);
	if (minutes >= 1) {
		minutes = minutes >= 10 ? String(minutes) : ('0' + minutes);
	} else {
		minutes = '00';
	}
	seconds = seconds >= 10 ? String(seconds) : ('0' + seconds);
	return minutes + ':' + seconds;
};
