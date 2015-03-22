var React = require('react');
var Progress = require('./progress');
var formatTime = require('../lib/format-time');

module.exports = React.createClass({
	render() {
		return <div className="time">
			<Progress progress={this.props.current/this.props.duration} onChange={this.props.onChange}/>
			<div className="time__current">{formatTime(this.props.current)}</div>
			<div className="time__duration">{formatTime(this.props.duration)}</div>
		</div>;
	}
});
