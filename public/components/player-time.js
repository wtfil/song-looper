var React = require('react');
var Progress = require('./progress');
function formatTime(time) {
	var minutes = ~~(time / 60)
	var seconds = ~~(time % 60);
	if (minutes >= 1) {
		minutes = minutes >= 10 ? String(minutes) : ('0' + minutes);
	} else {
		minutes = '00';
	}
	seconds = seconds >= 10 ? String(seconds) : ('0' + seconds);
	return minutes + ':' + seconds;
}

module.exports = React.createClass({
	render() {
		return <div className="time">
			<Progress progress={this.props.current/this.props.duration} onChange={this.props.onChange}/>
			<div className="time__current">{formatTime(this.props.current)}</div>
			<div className="time__duration">{formatTime(this.props.duration)}</div>
		</div>;
	}
});
