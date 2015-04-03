var Reflux = require('reflux');
var actions = require('./audio-actions');
var IDb =  require('idb-wrapper');
var extend = require('extend');

var dbStore = new IDb({
	keyPath: null,
	storeName: 'songs',
	onStoreReady: function () {
		fluxStore.updateFromDb();
	},
	onError: console.error.bind(console)
});

var fluxStore = Reflux.createStore({
	init() {
		this.listenTo(actions.setFile.completed, 'onUrlCreated');
		this.listenToMany(actions);
		this.ready = false;
		this.songs = [];
	},

	updateFromDb() {
		this.ready = true;
		dbStore.getAll(this.setSongs);
	},

	onDeleteSong(id) {
		dbStore.remove(id, this.updateFromDb);
	},

	updateCurrentSong(key, value) {
		var song = this.currentSong;
		if (!song) {
			return;
		}
		song[key] = value;
		this.trigger();
		dbStore.put(song.id, song);
	},

	updateById(id, key, value) {
		var song = this.getById(id);
		if (!song) {
			return;
		}
		song[key] = value;
		dbStore.put(id, song);
		this.trigger();
	},

	getById(id) {
		return this.songs.filter(song => song.id === id)[0];
	},

	onChangeName(data) {
		this.updateById(data.id, 'name', data.name);
	},

	onUrlCreated(src) {
		this.updateCurrentSong('src', src);
	},

	onAddRiff(id) {
		var riffs = this.getById(id).riffs;
		var riff = {
			name: '',
			from: 0,
			to: 0,
			active: false,
			index: riffs.length
		};
		this.updateById(id, 'riffs', riffs.concat(riff));
	},

	onDeleteRiff(data) {
		var riffs = this.getById(data.songId).riffs
			.filter(riff => riff !== data.riff);

		this.updateById(data.songId, 'riffs', riffs);
	},

	onUpdateRiff(data) {
		var riffs = this.getById(data.songId).riffs;
		extend(riffs[data.index], data, {active: true});
		this.updateById(data.songId, 'riffs', riffs);
	},

	onChangeSong(song) {
		this.currentSong = song;
		this.trigger();
	},

	onSetFile(file) {
		var id = this.songs.length ?
			this.songs.slice().pop().id + 1 :
			1;

		var song = {
			name: file.name,
			id: id,
			riffs: []
		};
		this.songs.push(song);
		this.currentSong = song;
		this.trigger();
		dbStore.put(id, song);
	},

	setSongs(songs) {
		this.songs = songs;
		this.trigger();
	},

	getNextSong(songId) {
		var song = this.getById(songId);
		var index = this.songs.indexOf(song);
		if (index === -1) {
			return this.songs[0] || null;
		}
		index = index === this.songs.length - 1 ? 0 : (index + 1);
		return this.songs[index];
	},
	getPrevSong(songId) {
		var song = this.getById(songId);
		var index = this.songs.indexOf(song);
		if (index === -1) {
			return this.songs.slice().pop() || null;
		}
		index = index ===  0 ? this.songs.length - 1 : (index - 1);
		return this.songs[index];
	},

	getNextSection(songId, riff) {
		var song = this.getById(songId);
		var index = song.riffs.indexOf(riff);
		index = index === song.riffs.length - 1 ? 0 : (index + 1);
		return song.riffs[index];
	},

	getPrevSection(songId, riff) {
		var song = this.getById(songId);
		var index = song.riffs.indexOf(riff);
		index = index === 0 ? song.riffs.length - 1 : (index - 1);
		return song.riffs[index];
	},

	isEmpty() {
		return this.songs.length === 0;
	},
	isReady() {
		return this.ready;
	}

});

module.exports = fluxStore;
