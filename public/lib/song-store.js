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

	onChangeSong(name) {
		var song = this.songs.filter(function (song) {
			return song.name === name;
		})[0];
		if (!song) {
			throw new Error('can not find song with name "' + name + '"');
		}
		this.currentSong = song;
		this.trigger();
	},

	onSetBreakPoint(time) {
		var song = this.currentSong;
		if (!song) {
			return;
		}
		song.breakPoints = song.breakPoints || [];
		song.breakPoints.push(time);
		dbStore.put(song.name, song);
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

	onUrlCreated(src) {
		this.currentSong.src = src;
		dbStore.put(this.currentSong.name, this.currentSong);
		this.trigger();
	},
	setSongs(songs) {
		this.songs = songs;
		this.trigger();
	},
	getBreakPoints() {
		return this.currentSong && this.currentSong.breakPoints || [];
	}
});

module.exports = fluxStore;
