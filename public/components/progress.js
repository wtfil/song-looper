var React = require('react');

function formatTime(time) {
	var minutes = (time / 60).toFixed(0);
	var seconds = (time % 60).toFixed(0);
	if (minutes >= 1) {
		minutes = minutes >= 10 ? minutes : ('0' + minutes);
	} else {
		minutes = '00';
	}
	seconds = seconds >= 10 ? seconds : ('0' + seconds);
	return minutes + ':' + seconds;
}

module.exports = React.createClass({
	render() {
		var progress = (this.props.current / this.props.duration * 100) + '%';
		return <div className="progress">
			<div className="progress__total"></div>
			<div className="progress__done" style={{width: progress}}></div>
			<div className="progress__cursor" style={{left: progress}}></div>
			<div className="progress__current">{formatTime(this.props.current)}</div>
			<div className="progress__duration">{formatTime(this.props.duration)}</div>
		</div>;
	}
});
