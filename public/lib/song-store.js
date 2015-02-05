var Reflux = require('reflux');
var actions = require('./audio-actions');
var IDb =  require('idb-wrapper');

var dbStore = new IDb({
	keyPath: 'id',
	autoIncrement: true,
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
		this.songs = [];
	},

	updateFromDb() {
		dbStore.getAll(this.setSongs);
	},

	onDeleteSong(id) {
		dbStore.remove(id, this.updateFromDb);
	},

	onChangeName(data) {
		var song = this.songs.filter(song => song.id === data.id)[0];
		if (!song) {
			return;
		}
		song.name = data.name;
		dbStore.put(song);
		this.trigger();
	},

	updateCurrentSong(key, value) {
		var song = this.currentSong;
		if (!song) {
			return;
		}
		song[key] = value;
		this.trigger();
		dbStore.put(song);
	},

	onChangeFormula(formula) {
		this.updateCurrentSong('formula', formula);
	},

	onUrlCreated(src) {
		this.updateCurrentSong('src', src);
	},

	onChangeSong(song) {
		this.currentSong = song;
		this.trigger();
	},

	onSetFile(file) {
		var song = {
			name: file.name,
			sections: []
		};
		dbStore.put(song, this.updateFromDb);
	},

	setSongs(songs) {
		this.songs = songs;
		this.currentSong = songs.slice().pop();
		this.trigger();
	},

	getFormula() {
		return this.currentSong && this.currentSong.formula || '';
	}
});

module.exports = fluxStore;
