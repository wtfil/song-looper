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
				<i className="icon-play"></i>
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
			<td><i onClick={this.edit} className="icon-edit"></i></td>
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
		return <div className={'song-item ' + (this.state.editable && 'editable' || '')}>
			<span onClick={this.changeSong}>{this.state.name}</span>
			{this.state.editable ?
				<i className="mr icon-collapse off right" onClick={this.save}/> :
				<i className="mr icon-collapse right" onClick={this.setEditable}/>
			}
			{this.state.editable && <div className="song-item__options">
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
