var React = require('react');
var Reflux = require('reflux');
var store= require('../lib/song-store');
var actions = require('../lib/audio-actions');
var UpdatableInput = require('../components/updatable-input');

var Song = React.createClass({
	getInitialState() {
		return {
			editable: false,
			name: this.props.song.name
		};
	},
	render() {
		return <div className="song-item">
			{this.state.editable ?
				<UpdatableInput className="song-item__input" value={this.state.name} onChange={this.updateName}/> :
				<span className="song-item__name" onClick={this.onClick}>{this.state.name}</span>
			}
			<span className="song-item__delete" onClick={this.deleteItem}>+</span>
			<span className="song-item__edit" onClick={this.setEditable}>edit</span>
		</div>;
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
	onClick() {
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
				{store.songs.map((song, key) => <Song key={key} song={song}/>)}
			</div>
		</div>;
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}
});
