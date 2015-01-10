var React = require('react');
var Reflux = require('reflux');
var actions = require('./lib/audio-actions');
var store = require('./lib/audio-store');
var Progress = require('./components/progress');

var Player = React.createClass({

	mixins: [Reflux.listenTo(store, 'forceUpdate')],

	changeTempo(e) {
		actions.changeTempo(e.target.value);
	},

	render() {
		return <div className="player">
			<div className="player__stop"></div>
			<div className="player__play" onClick={actions.play}></div>
			<div className="player__pause" onClick={actions.pause}></div>
			<input className="player__speed" onChange={this.changeTempo} type="range" max="2" min="0" step="0.1" value={store.tempo}/>
			<Progress current={store.current} duration={store.duration} />
		</div>;
	}

});

var App = React.createClass({
	render() {
		return <div className="app">
			<input type="file" onChange={this.onChange}/>
			<Player/>
		</div>;
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}
});

window.addEventListener('keyup', function (e) {
	switch (e.keyCode) {
		case 32: actions.pausePlay(); break;
		case 38: actions.speedUp(); break;
		case 40: actions.slowDown(); break;
		case 37: actions.jumpBack(); break;
		case 39: actions.jumpForward(); break;
	}
	console.log(e.keyCode);
});

window.addEventListener('DOMContentLoaded', function () {
	React.render(<App/>, document.body);
});
