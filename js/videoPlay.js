(function (window,$) {
	function Video(el,vName,vPath){
		var that = this;
		this.video = $(el);
		// 添加video
		this.video.css("display","block").append(this.load_video(vName,vPath));
		
		this.playVideo = this.video.find('video');
		this.playPause = this.video.find('.playPause'); //播放和暂停
		this.currentTime = this.video.find('.timebar .currentTime'); //当前时间
		this.duration = this.video.find('.timebar .duration'); //总时间
		this.progressBar = this.video.find('.timebar .progress-bar'); //进度条
		this.volumebar = this.video.find('.volumeBar .volumewrap').find('.progress-bar');
		this.playContent = this.video.find('.playContent');
		this.volumeBar = this.video.find('.volumeBar');
		this.playTip = this.video.find('.playTip');
		this.fullScreen = this.video.find('.fullScreen');
		this.playControll = this.video.find('#willesPlay .playControll');
		this.volume = this.video.find('.volume');
		this.progress = this.video.find('.timebar .progress');
		this.volumewrap = this.video.find('.volumeBar .volumewrap');
	
		var domPlayVideo = this.playVideo[0];
		domPlayVideo.volume = 0.4; //初始化音量
		
		this.playPause.on('click', function() {
			that.playControl();
		});
		this.playContent.on('click', function() {
			that.playControl();
		});
		// $(document).click(function() {
		// 	this.volumeBar.hide();
		// });
		this.playVideo.on('loadedmetadata', function() {
		that.duration.text(that.formatSeconds(domPlayVideo.duration));
		});

		this.playVideo.on('timeupdate', function() {
			that.currentTime.text(that.formatSeconds(domPlayVideo.currentTime));
			that.progressBar.css('width', 100 *domPlayVideo.currentTime /domPlayVideo.duration + '%');
		});
		this.playVideo.on('ended', function() {
			that.playTip.removeClass('glyphicon-pause').addClass('glyphicon-play').fadeIn();
			that.playPause.toggleClass('playIcon');
		});
		
		$(window).keyup(function(event){
			event = event || window.event;
				if(event.keyCode == 32)that.playControl();
				if(event.keyCode == 27){
				that.fullScreen.removeClass('cancleScreen');
				that.playControll.css({
					'bottom': -48
				}).removeClass('fullControll');
				};
			event.preventDefault();
		});
		
		
		//全屏
		this.fullScreen.on('click', function() {
			if ($(this).hasClass('cancleScreen')) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozExitFullScreen) {
					document.mozExitFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
				$(this).removeClass('cancleScreen');
				that.playControll.css({
					'position' : 'relative',
					'bottom': 0,
					'z-index' : 10
				}).removeClass('fullControll');
			} else {
				if (domPlayVideo.requestFullscreen) {
				domPlayVideo.requestFullscreen();
				} else if (domPlayVideo.mozRequestFullScreen) {
				domPlayVideo.mozRequestFullScreen();
				} else if (domPlayVideo.webkitRequestFullscreen) {
				domPlayVideo.webkitRequestFullscreen();
				} else if (domPlayVideo.msRequestFullscreen) {
				domPlayVideo.msRequestFullscreen();
				}
				$(this).addClass('cancleScreen');
				that.playControll.css({
					'position' : 'fixed',
					'left': 0,
					'bottom': 0,
					'z-index' : 2147483650
				}).addClass('fullControll');
			}
			return false;
		});
		//音量
		this.volume.on('click', function(e) {
			e = e || window.event;
			that.volumeBar.toggle();
			e.stopPropagation();
		});
		this.volumeBar.on('click mousewheel DOMMouseScroll', function(e) {
			e = e || window.event;
			that.volumeControl(e);
			e.stopPropagation();
			return false;
		});
		this.progress.mousedown(function(e) {
			e = e || window.event;
			that.updatebar(e.pageX);
		});
		//$('.playContent').on('mousewheel DOMMouseScroll',function(e){
		//this.volumeControl(e);
		//});

	}
	Video.prototype ={
		load_video: function(playHeader,videoPath){
		  var style = "";
		  var player = "";
		  // 判断是否有视频名称
		  if($.trim(playHeader) === ""){
		    style = 'style="display:none;"';
		    // $("#willesPlay .playHeader").css("display","none");
		  } 
		  player = '<div id="willesPlay">'+
		    '<div class="playHeader"'+style+'>'+
		      '<div class="videoName">'+playHeader+'</div>'+
		    '</div>'+
		    '<div class="playContent">'+
		      '<video width="100%" height="100%" id="playVideo">'+
		        '<source src="'+videoPath+'" type="video/mp4"></source>'+
		        '当前浏览器不支持 video直接播放，点击这里下载视频： <a href="/">下载视频</a>'+
		      '</video>'+
		      '<div class="playTip glyphicon glyphicon-play"></div>'+
		    '</div>'+
		    '<div class="playControll">'+
		      '<div class="playPause playIcon"></div>'+
		      '<div class="timebar">'+
		        '<span class="currentTime">0:00:00</span>'+
		        '<div class="progress">'+
		          '<div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>'+
		        '</div>'+
		        '<span class="duration">0:00:00</span>'+
		      '</div>'+
		      '<div class="otherControl">'+
		        '<span class="volume glyphicon glyphicon-volume-down"></span>'+
		        '<span class="fullScreen glyphicon glyphicon-fullscreen"></span>'+
		        '<div class="volumeBar">'+
		          '<div class="volumewrap">'+
		            '<div class="progress">'+
		              '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 8px;height: 40%;"></div>'+
		            '</div>'+
		          '</div>'+
		        '</div>'+
		      '</div>'+
		    '</div>'+
		  '</div>';
		  return player;
		},
		updatebar: function(x) {
			var maxduration =this.playVideo[0].duration; //Video 
			var positions = x -this.progressBar.offset().left; //Click pos
			var percentage = 100 * positions / this.progress.width();
			//Check within range
			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage < 0) {
				percentage = 0;
			}

			//Updatethis.progress bar and videothis.currentTime
			this.progressBar.css('width', percentage + '%');
			this.playVideo[0].currentTime = maxduration * percentage / 100;
		},
		volumeControl: function(e){   //音量控制
			e = e || window.event;
			var eventype = e.type;
			var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
			var positions = 0;
			var percentage = 0;
			if (eventype == "click") {
				positions =this.volumebar.offset().top - e.pageY;
				percentage = 100 * (positions +this.volumebar.height()) / this.volumewrap.height();
			} else if (eventype == "mousewheel" || eventype == "DOMMouseScroll") {
				percentage = 100 * (volumebar.height() + delta) / this.volumewrap.height();
			}
			if (percentage < 0) {
				percentage = 0;
				this.volume.attr('class', 'volume glyphicon glyphicon-volume-off');
			}
			if (percentage > 50) {
				this.volume.attr('class', 'volume glyphicon glyphicon-volume-up');
			}
			if (percentage > 0 && percentage <= 50) {
				this.volume.attr('class', 'volume glyphicon glyphicon-volume-down');
			}
			if (percentage >= 100) {
				percentage = 100;
			}
			this.volumebar.css('height', percentage + '%');
			this.playVideo[0].volume = percentage / 100;
			e.stopPropagation();
			e.preventDefault();
		},
		playControl: function() {  //控制视频播放和暂停
			this.playPause.toggleClass('playIcon');
			if (this.playVideo[0].paused) {
				this.playVideo[0].play();
				this.playTip.removeClass('glyphicon-play').addClass('glyphicon-pause').fadeOut();
			} else {
				this.playVideo[0].pause();
				this.playTip.removeClass('glyphicon-pause').addClass('glyphicon-play').fadeIn();
			}
		},
		pauseControl: function(){   //强制视频暂停
			if(!this.playPause.hasClass('playIcon')){
				this.playPause.addClass('playIcon');
			}
			if (!this.playVideo[0].paused){
				this.playVideo[0].pause();
				this.playTip.removeClass('glyphicon-pause').addClass('glyphicon-play').fadeIn();
			}
		},
		playOn: function(){
			this.playVideo[0].play();
			this.playTip.removeClass('glyphicon-play').addClass('glyphicon-pause').fadeOut();
		},
		formatSeconds: function(value) {		//秒转时间
			value = parseInt(value);
			var time;
			if (value > -1) {
				hour = Math.floor(value / 3600);
				min = Math.floor(value / 60) % 60;
				sec = value % 60;
				day = parseInt(hour / 24);
				if (day > 0) {
					hour = hour - 24 * day;
					time = day + "day " + hour + ":";
				} else time = hour + ":";
				if (min < 10) {
					time += "0";
				}
				time += min + ":";
				if (sec < 10) {
					time += "0";
				}
				time += sec;
			}
			return time;
		}
	};
	window.Video = Video;

})(window,jQuery);

