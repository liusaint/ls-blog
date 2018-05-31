
var app = {

	init() {
		this.video = document.querySelector('video');
		this.bindEvent();
		this.musics = [
			'http://other.web.nm01.sycdn.kuwo.cn/resource/n1/73/61/1963532644.mp3',
			'http://other.web.rh01.sycdn.kuwo.cn/resource/n3/22/97/3591423245.mp3'
		]
	},
	bindEvent() {
		var video = this.video;
		var that = this;

		video.addEventListener('play', function() {
			that.removeAd();
		});
		video.addEventListener('pause', function() {
			that.addAd();
		});
	},
	//切换
	muscicEvent() {
		var that = this;
		$("#ls_music")[0].addEventListener('ended', function() {
			var musicArr = that.musics;
			var index = Number($("#ls_music").attr(index));
			var len = musicArr.length;
			var next = index +1;
			if(next == len){
				next = 0;
			}
			$("#ls_music").attr('src',musicArr[next]);
			$("#ls_music")[0].play();
		})
	},
	createMusic() {
		this.musicStr = '<video id="ls_music" style="display:none;" index="0" src="'+this.musics[0]+'"  controls="" autoplay="" name="media"></video>';
	},
	addAd() {
		var video = this.video;
		var parent = $(video).parent();
		parent.css('position', 'relative');
		$('.ls_ad').remove();
		$(parent).append('<div class="ls_ad" style="position:fixed;right:0;bottom:0;width:60%;height:80%;z-index:999;">1234123123123</div>');
		this.createMusic();
		if ($("#ls_music").length < 1) {
			$(parent).append(this.musicStr);
			this.muscicEvent();
		} else {
			$("#ls_music")[0].play();
		}

	},
	removeAd() {
		$('.ls_ad').remove();
		$("#ls_music")[0].pause();
	}

};


app.init();