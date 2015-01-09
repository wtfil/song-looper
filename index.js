var fileInput = document.querySelector('[type=file]');

function Player(domNode) {
	this._domNode = domNode;
	this._isPlaying = false;
	this._audio = new Audio();
	this.initButtons();
	this.initKeyboard();
}

Player.prototype.initButtons = function () {
	this._stopButton = this._domNode.querySelector('[data-stop]');
	this._playButton = this._domNode.querySelector('[data-play]');
	this._speedButton = this._domNode.querySelector('[data-speed]');
	this._progress = this._domNode.querySelector('progress');
	this._stopButton.addEventListener('click', this.stop.bind(this));
	this._playButton.addEventListener('click', this.pausePlay.bind(this));
	this._speedButton.addEventListener('change', function (e) {
		this.setSpeed(e.target.value);
	}.bind(this));
	this._progress.addEventListener('click', function (e) {
		this.setOffset(e.offsetX / e.target.offsetWidth);
	}.bind(this));
};

Player.prototype.initKeyboard = function () {
	var _this = this;
	window.addEventListener('keyup', function (e) {
		switch (e.keyCode) {
			case 32: _this.pausePlay(); break;
			case 38: _this.speedUp(); break;
			case 40: _this.slowDown(); break;
			case 37: _this.back(); break;
			case 39: _this.next(); break;
		}
		console.log(e.keyCode);
	});
};

Player.prototype.back = function () {
	this._audio.currentTime -= 5;
	this._progress.value = this._audio.currentTime / this._audio.duration;
};
Player.prototype.next = function () {
	this._audio.currentTime += 5;
	this._progress.value = this._audio.currentTime / this._audio.duration;
};

Player.prototype.setFile = function (file) {
	var reader = new FileReader();
	var _this = this;
	reader.onerror = function (e) {
		console.error(e);
	};
	reader.onload = function (e) {
		var audio = new Audio();
		audio.src = e.target.result;
		audio.play();
		setInterval(function () {
			var duration = audio.duration;
			_this._progress.value = duration ? (audio.currentTime / duration) : 0;
		}, 1000);
		_this._audio = audio;
	};
	reader.readAsDataURL(file);
}

Player.prototype.speedUp = function () {
	var speed = Number(this._speedButton.value) + 0.1;
	this._speedButton.value = speed;
	this.setSpeed(speed);
};
Player.prototype.slowDown = function () {
	var speed = Number(this._speedButton.value) - 0.1;
	this._speedButton.value = speed;
	this.setSpeed(speed);
};

Player.prototype.setOffset = function (offset) {
	this._audio.currentTime = offset * this._audio.duration;
};

Player.prototype.setSpeed = function (speed) {
	this._audio.playbackRate = speed;
};

Player.prototype.pausePlay = function () {
	if (this._audio.paused) {
		this._audio.play();
	} else {
		this._audio.pause();
	}
};

Player.prototype.stop = function () {
	this._audio.pause();
	this._audio.currentTime = 0;
};

var player = new Player(document.querySelector('.player'));


fileInput.addEventListener('change', function (e) {
	var file = e.target.files[0];
	player.setFile(file);
});
