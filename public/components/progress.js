var React = require('react');

module.exports = React.createClass({
	displayName: 'progress',
	propTypes: {
		onChange: React.PropTypes.func.isRequired,
		onContextClick: React.PropTypes.func
	},
	render() {
		var progress = (this.props.progress * 100) + '%';
		return <div className="progress" onClick={this.onClick} onContextMenu={this.onContext}>
			<div className="progress__total"></div>
			<div className="progress__done" style={{width: progress}}></div>
			<div className="progress__cursor" style={{left: progress}}></div>
		</div>;
	},

	onClick(e) {
		this.props.onChange(e.nativeEvent.offsetX / this.getDOMNode().offsetWidth);
	},
	onContext(e) {
		if (this.props.onContextClick) {
			e.preventDefault();
			this.props.onContextClick(e.nativeEvent.offsetX / this.getDOMNode().offsetWidth);
		}
	}
});
