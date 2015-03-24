var React = require('react');
var actions = require('../lib/audio-actions');

module.exports = React.createClass({
	render() {
		return <label className="file-input">
			<input type="file" onChange={this.onChange}/>
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
