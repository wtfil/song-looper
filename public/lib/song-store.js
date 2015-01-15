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
		this.listenTo(actions.setFile, 'onNewFile');
		this.songs = [];
	},

	onNewFile(file) {
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
		console.log(this.songs);
		this.trigger();
	}
});

module.exports = fluxStore;
