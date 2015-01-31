var Reflux = require('reflux');
var actions = require('./audio-actions');
var IDb =  require('idb-wrapper');

var dbStore = new IDb({
	keyPath: null,
	storeName: 'songs',
	onStoreReady: function () {
		dbStore.getAll(fluxStore.setSongs);
	},
	onError: console.error.bind(console)
});

var fluxStore = Reflux.createStore({
	init() {
		this.listenTo(actions.setFile.completed, 'onUrlCreated');
		this.listenToMany(actions);
		this.songs = [];
	},

	updateCurrentSong(key, value) {
		var song = this.currentSong;
		if (!song) {
			return;
		}
		song[key] = value;
		this.trigger();
		dbStore.put(song.name, song);
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
		this.currentSong = {
			name: file.name
		};
		dbStore.put(file.name, this.currentSong);
		this.songs.push(this.currentSong);
		this.trigger();
	},

	setSongs(songs) {
		this.songs = songs;
		this.trigger();
	},

	getFormula() {
		return this.currentSong && this.currentSong.formula || '';
	}
});

module.exports = fluxStore;
