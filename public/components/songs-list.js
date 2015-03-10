var React = require('react');
var Reflux = require('reflux');
var store= require('../lib/song-store');
var actions = require('../lib/audio-actions');
var UpdatableInput = require('../components/updatable-input');

var Riff = React.createClass({
	displayName: 'Riff',
	updateName(name) {
		actions.updateRiff({
			index: this.props.index,
			songId: this.props.song.id,
			name: name
		});
	},
	updateFormula(formula) {
		actions.updateRiff({
			index: this.props.index,
			songId: this.props.song.id,
			formula: formula
		});
	},
	playRiff() {
		actions.playRiff({
			song: this.props.song,
			index: this.props.index
		});
	},
	render() {
		return <div className="riff">
			<i className="icon-play" onClick={this.playRiff}/>
			<UpdatableInput className="riff__formula" placeholder="time interval" onChange={this.updateFormula} value={this.props.riff.formula}/>
			<div className="riff__name">
				<UpdatableInput onChange={this.updateName} placeholder="riff name" value={this.props.riff.name}/>
			</div>
		</div>;
	}
});

var Song = React.createClass({
	getInitialState() {
		return {
			editable: false,
			name: this.props.song.name
		};
	},
	render() {
		return <div className={'song-item ' + (this.state.editable && 'editable' || '')}>
			<span onClick={this.changeSong}>{this.state.name}</span>
			{this.state.editable ?
				<i className="mr icon-collapse off right" onClick={this.save}/> :
				<i className="mr icon-collapse right" onClick={this.setEditable}/>
			}
			{this.state.editable && <div>
				<div className="song-item__riffs">
					<i className="icon-add" onClick={this.addRiff}>+</i>
				</div>
				{this.props.song.riffs.map((riff, index) => <Riff riff={riff} key={index} index={index} song={this.props.song}/>)}
				<span onClick={this.deleteItem}>Delete song</span>
			</div>}
		</div>;
	},

	addRiff() {
		actions.addRiff(this.props.song.id);
	},
	deleteItem() {
		actions.deleteSong(this.props.song.id);
	},
	updateName(name) {
		actions.changeName({
			id: this.props.song.id,
			name: name
		});
		this.setState({
			editable: false,
			name: name
		});
	},
	setEditable(e) {
		e.stopPropagation();
		this.setState({editable: true});
	},
	save(e) {
		e.stopPropagation();
		this.setState({editable: false});
	},
	changeSong() {
		actions.changeSong(this.props.song);
	}
});

module.exports = React.createClass({
	displayName: 'SongsList',
	mixins: [Reflux.listenTo(store, 'forceUpdate')],
	render() {
		return <div className="songs-list">
			<div className="songs-list__head">
				<label className="file-input">
					<input type="file" onChange={this.onChange}/>
					<div>+ upload file</div>
				</label>
			</div>
			<div className="songs-list__list">
				{store.songs.map((song, key) => <Song key={song.id} song={song}/>)}
			</div>
		</div>;
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}
});
