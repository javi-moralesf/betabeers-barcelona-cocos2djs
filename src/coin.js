
var Coin = cc.Sprite.extend({
	active:true,
	zOrder:3001,
	ctor:function (min, max) {
		this._super(cc.spriteFrameCache.getSpriteFrame(t_res.coin));
		this.tag = this.zOrder;
		this.x = cc.winSize.width;
		this.y = Math.floor(Math.random() * max) + min;
		this._setAnchorX(0);
		this.scheduleUpdate();
	},
	collected:function () {
		BB.SCORE++;
		this.active = false;
		this.unscheduleUpdate();
		this.setVisible(false);

		if (BB.SOUND) {
			cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WP8 ? res.coin_wav : res.coin_mp3);
		}
	},
	update:function(){
		this.x-=BB.PLAYER_SPEED;
	},
	collideRect:function (x, y) {
		var w = this.width, h = this.height;
		return cc.rect(x, y - h / 2, w, h / 2);
	},
});