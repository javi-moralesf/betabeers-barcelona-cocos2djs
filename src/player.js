INITIAL_HP = 1;
PLAYER_EVENT_JUMP = 1;

var Player = cc.Sprite.extend({
	speed:BB.PLAYER_SPEED,
	jump_power: BB.PLAYER_JUMP_POWER,
	jump_time: BB.PLAYER_JUMP_TIME,
	HP:INITIAL_HP,
	zOrder:3000,
	active:true,
	is_jumping: false,
	ctor:function (x, y) {
		this._super("#"+t_res.player01);
		this.tag = this.zOrder;
		this.x = x;
		this.y = y;
		this.anchorY = 0;

		// set frame
		var frame0 = cc.spriteFrameCache.getSpriteFrame(t_res.player01);
		var frame1 = cc.spriteFrameCache.getSpriteFrame(t_res.player02);
		
		var animFrames = [];
		animFrames.push(frame0);
		animFrames.push(frame1);
		
		// player animate
		var animation = new cc.Animation(animFrames, 0.1);
		var animate = cc.animate(animation);
		this.runAction(animate.repeatForever());

	},
	jump:function() {
		if(this.is_jumping){
			return;
		}
		
		this.is_jumping = true;
		var actionJump = cc.jumpBy(this.jump_time, cc.p(0, 0), this.jump_power, 1);
		var jump_end = cc.callFunc(function (t) {
			t.is_jumping = false;
		}.bind(this));
		this.runAction(cc.sequence(actionJump, jump_end));
	},
	collideRect:function (x, y) {
		var w = this.width, h = this.height;
		return cc.rect(x - w / 2, y, w, h / 2);
	},
});