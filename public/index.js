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
			<button className="player__stop">s</button>
			{store.isPlay ?
				<button className="player__pause" onClick={actions.pause}>||</button> :
				<button className="player__play" onClick={actions.play}>p</button>
			}
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

window.addEventListener('DOMContentLoaded', function () {
	React.render(<App/>, document.body);
});
