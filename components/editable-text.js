var React = require('react');
var Input = require('./updatable-input');

module.exports = React.createClass({
	displayName: 'EditableText',
	getInitialState() {
		return { editable: false, value: this.props.value };
	},

	render() {
	  	return this.state.editable ?
	  		<Input className={this.props.className} autoFocus onChange={this.onChange} value={this.state.value}/> :
	  		<span className={this.props.className} onClick={this.setEditable}>{this.state.value}</span>;
	},

	setEditable(e) {
		e.stopPropagation();
		this.setState({editable: true});
	},

	onChange(value) {
		this.setState({
			value: value,
			editable: false
		}, () => {
			this.props.onChange && this.props.onChange(value);
		});
	}

});
