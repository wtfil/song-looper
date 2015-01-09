var React = require('react');
var Reflux = require('reflux');
var actions = require('./lib/audio-actions');
var store = require('./lib/audio-store');

var Player = React.createClass({

	mixins: [Reflux.ListenerMixin],

	componentDidMount() {
		this.listenTo(store, this.forceUpdate);
	},

	getInitialState() {
		return {
			reverseTime: false
		};
	},

	changeReverseTime() {
		this.setState({reverseTime: !this.state.reverseTime});
	},

	changeTempo(e) {
		actions.changeTempo(e.target.value);
	},

	render() {
		var time = this.state.reverseTime ?
			(store.duration - store.current) : store.current;
		var minutes = (time / 60).toFixed(0);
		var seconds = (time % 60).toFixed(0);
		if (minutes >= 1) {
			minutes = minutes >= 10 ? minutes : ('0' + minutes);
		} else {
			minutes = '00';
		}
		seconds = seconds >= 10 ? seconds : ('0' + seconds);
		time = minutes + ':' + seconds;

		return <div className="player">
			<button className="player__stop">s</button>
			{store.isPlay ?
				<button className="player__pause" onClick={actions.pause}>||</button> :
				<button className="player__play" onClick={actions.play}>p</button>
			}
			<input className="player__speed" onChange={this.changeTempo} type="range" max="2" min="0" step="0.1" value={store.tempo}/>
			<span onClick={this.changeReverseTime}>{time}</span>
			<progress value={store.current / store.duration}></progress>
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

window.addEventListener('DOMContentLoaded', function () {
	React.render(<App/>, document.body);
});
