var React = require('react');

module.exports = React.createClass({
	displayName: 'UpdatableInput',
	getInitialState() {
		return {value: this.props.value, initialValue: this.props.value};
	},
	componentWillReceiveProps({value}) {
		if (value !== this.state.initialValue) {
			this.setState({value: value, initialValue: value});
		}
	},
	onChange(e) {
		this.setState({value: e.target.value});
	},
	onKeyUp(e) {
		if (e.keyCode === 13 && this.props.onChange) {
			this.props.onChange(this.state.value);
		}
	},
	render() {
		return <input
			className={this.props.className}
			placeholder={this.props.placeholder}
			type="text"
			value={this.state.value}
			onChange={this.onChange}
			onKeyUp={this.onKeyUp}
		/>;
	}
});

