var React = require('react');
var actions = require('../lib/audio-actions');

module.exports = React.createClass({
	render() {
		var className = 'file-input';
		if (this.props.small) {
			className += ' small';
		}
		return <label className={className}>
			<input type="file" onChange={this.onChange} accept=".mp3"/>
			<div>
				<div className="file-input__icon">+</div>
				<div className="file-input__text">{this.props.children}</div>
			</div>
		</label>;
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}

});
