var React = require('react');
var Reflux = require('reflux');
var store= require('../lib/song-store');
var actions = require('../lib/audio-actions');
var formatTime = require('../lib/format-time');
var Input = require('./updatable-input');

var Riff = React.createClass({
	getInitialState() {
		return {editable: false};
	},
	update(prop) {
		return (value) => {
			var data = {
				index: this.props.riff.index,
				songId: this.props.song.id
			};
			data[prop] = value;
			actions.updateRiff(data);
		};
	},
	render() {
		var riff = this.props.riff;

		return <tr onClick={this.playRiff}>
			<td className="riffs__index">
				<span >{riff.index + 1}</span>
				<i className="icon-play small"></i>
			</td>
			{this.state.editable ?
				<td><Input onChange={this.update('name')} value={this.name}/></td> :
				riff.name ?
					<td>{riff.name}</td> :
					<td className="secondary-text">Unnamed section</td>
			}
			<td>
				{this.state.editable ?
					<Input onChange={this.update('from')} value={riff.from}/> :
					formatTime(riff.from)
				}
			</td>
			<td>
				{this.state.editable ?
					<Input onChange={this.update('to')} value={riff.to}/> :
					formatTime(riff.to)
				}
			</td>
			<td>
				{this.state.editable ?
					<i onClick={this.edit} className="icon-save"></i> :
					<i onClick={this.edit} className="icon-edit"></i>
				}
			</td>
		</tr>;
	},
	playRiff(e) {
		actions.playRiff({
			song: this.props.song,
			riff: this.props.riff
		});
	},
	edit(e) {
		e.stopPropagation();
		this.setState({editable: !this.state.editable});
	}
});

var Riffs = React.createClass({
	render() {
		if (!this.props.riffs.length) {
			return <div>
				<div className="secondary-text">There is not sections yet</div>
				<span className="call-to-action" onClick={this.addRiff}>Add section</span>
			</div>;
		}
		return <table className="riffs">
			<thead>
				<tr>
					<td className="riffs__index-title" onClick={this.addRiff}>+</td>
					<td className="riffs__name-title"> <strong>NAME</strong> </td>
					<td className="riffs__time-title"> <strong>FROM</strong> </td>
					<td className="riffs__time-title"> <strong>TO</strong> </td>
					<td></td>
				</tr>
			</thead>
			<tbody>
				{this.props.riffs.map(riff => <Riff riff={riff} song={this.props.song}/>)}
			</tbody>
		</table>;
	},

	addRiff() {
		actions.addRiff(this.props.song.id);
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
		return <div onClick={this.changeSong} className={'song-item ' + (this.state.editable && 'editable' || '')}>
			<i className="song-item__play icon-play small"></i>
			<span >{this.state.name}</span>
			<div className="song-item__collapse" onClick={this.changeEditable}>
				{this.state.editable ?
					<i className="mr icon-collapse off"/> :
					<i className="mr icon-collapse"/>
				}
			</div>
			{this.state.editable && <div className="song-item__options" onClick={this.stopPropagation}>
				<Riffs riffs={this.props.song.riffs} song={this.props.song} />
			</div>}
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
	stopPropagation(e) {
		e.stopPropagation();
	},
	changeEditable(e) {
		e.stopPropagation();
		this.setState({editable: !this.state.editable});
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
