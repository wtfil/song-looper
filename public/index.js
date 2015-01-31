var React = require('react');
var Reflux = require('reflux');
var actions = require('./lib/audio-actions');
var store = require('./lib/audio-store');
var Progress = require('./components/progress');
var PlayerTime = require('./components/player-time');
var SongsList = require('./components/songs-list');
var songStore = require('./lib/song-store');

var UpdatableInput = React.createClass({
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
	onSubmit(e) {
		e.preventDefault();
		this.props.onChange && this.props.onChange(this.state.value);
	},
	render() {
		return <form onSubmit={this.onSubmit}>
			<input className={this.props.className} type="text" value={this.state.value} onChange={this.onChange} />
		</form>;
	}
});

var Player = React.createClass({

	mixins: [Reflux.listenTo(store, 'forceUpdate')],

	changeTempo(value) {
		actions.changeTempo(value + 0.5);
	},

	changePosition(position) {
		actions.changePosition(position * store.duration);
	},

	render() {
		return <div className="player">
			<PlayerTime current={store.current} duration={store.duration} onChange={this.changePosition}/>
			<div className="player__footer">
				<div className="player__controls">
					<div className="player__stop"></div>
					{store.isPlay ?
						<div className="player__pause" onClick={actions.pause}></div> :
						<div className="player__play" onClick={actions.play}></div>
					}
					<Progress progress={store.tempo - 0.5} onChange={this.changeTempo}/>
					<span className="player__tempo">{store.tempo.toFixed(1)}</span>
				</div>
				<UpdatableInput className="player__formula" value={songStore.getFormula()} onChange={actions.changeFormula}/>
			</div>
		</div>;
	}

});

var App = React.createClass({
	render() {
		return <div className="app">
			<SongsList/>
			<Player/>
		</div>;
	}
});

window.addEventListener('keyup', function (e) {
	var node = e.target.nodeName;
	if (node === 'INPUT') {
		return;
	}
	switch (e.keyCode) {
		case 32: actions.pausePlay(); break;
		case 38: actions.speedUp(); break;
		case 40: actions.slowDown(); break;
		case 37: actions.jumpBack(); break;
		case 39: actions.jumpForward(); break;
	}
});

window.addEventListener('DOMContentLoaded', function () {
	React.render(<App/>, document.body);
});
