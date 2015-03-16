
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var MainLayer = cc.Layer.extend({
	_player:null,
	_ground_y:0,
	_grass:null,
	_grass2:null,
	_score:null,
    _textureBatch:null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
    	cc.spriteFrameCache.addSpriteFrames(res.texture_plist);

    	var size = cc.winSize;
    	this._ground_y = size.height/5;

    	// HASHTAG
    	var hashtag = new cc.LabelTTF("#bbBCN", "Arial", 38);
    	hashtag.x = size.width / 2;
    	hashtag.y = 0;
    	hashtag.setColor(new cc.Color(255, 0, 0));
    	this.addChild(hashtag, 5);
    	var hashtag_animation = cc.moveBy(2.5, cc.p(0, size.height - 40));
    	hashtag.runAction(cc.spawn(hashtag_animation));
    	
    	// SCORE
    	this._score = new cc.LabelTTF(BB.SCORE.toString(), "Arial", 20);
    	this._score.x = 50;
    	this._score.y = 20;
    	this._score.setColor(new cc.Color(255, 0, 0));
    	this.addChild(this._score, BB.UI_Z_ORDER);

    	var mainTexture = cc.textureCache.addImage(res.texture_png);
    	this._textureBatch = new cc.SpriteBatchNode(mainTexture);
    	this.addChild(this._textureBatch);
    	
    	// 	COIN

    	var coin = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(t_res.coin));
    	coin.attr({
    		x: 20,
    		y: 20
    	});
    	this._textureBatch.addChild(coin, BB.UI_Z_ORDER);
    	
    	// BACKGROUND
    	
    	var background = new cc.Sprite(
    		cc.spriteFrameCache.getSpriteFrame(t_res.background)
    	);
    	background.attr({
    		x: 0,
    		y: 0,
    		anchorX: 0,
    		anchorY: 0
    	});
    	this._textureBatch.addChild(background);

    	var ground = new cc.Sprite(
    		cc.spriteFrameCache.getSpriteFrame(t_res.ground)
    	);
    	ground.attr({
    		x: 0,
    		y: this._ground_y,
    		anchorX: 0,
    		anchorY: 1
    	});
    	this._textureBatch.addChild(ground, 0);
    	
    	//PLAYER
    	this._player = new Player(size.width/2, this._ground_y);
    	this._textureBatch.addChild(this._player, this._player.zOrder, BB.UNIT_TAG.PLAYER);

    	//GRASS
    	this._grass = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(t_res.grass));
    	this._grass.attr({
    		x: size.width,
    		y: this._ground_y,
    		anchorX: 0,
    		anchorY: 0
    	});
    	
    	this._grass2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(t_res.grass));
    	this._grass2.attr({
    		x: size.width,
    		y: this._ground_y,
    		anchorX: 1,
    		anchorY: 0
    	});

    	this._textureBatch.addChild(this._grass);
    	this._textureBatch.addChild(this._grass2);
    	
    	var createCoin = function(){
    		var coin = new Coin(this._ground_y, BB.PLAYER_JUMP_POWER);
    		this.addChild(coin);
    		BB.CONTAINER.COINS.push(coin);
    	};
    	
    	this.setupControls();
    	this.schedule(createCoin, 2);
    	this.scheduleUpdate();

    	return true;
    },
    processEvent:function (event) {    	
		if(event === PLAYER_EVENT_JUMP){
			this._player.jump();
		}
    },
    update:function (dt) {   	
		this.moveGrass();
		this.checkIsCollide();
		this.updateUI();
    	
    },
    updateUI:function (dt) {
    	this._score.setString(BB.SCORE.toString());
    },
    moveGrass:function(dt){
    	var speed = BB.PLAYER_SPEED;
    	var sw = cc.winSize.width;
    	this._grass.x-= speed;
    	this._grass2.x-= speed;
    	if(this._grass.x / (1-this._grass.anchorX) + this._grass.width <= sw){
    		this._grass.x = sw;
    		this._grass2.x = sw;
    	}
    },
    checkIsCollide:function () {
    	var selChild, bulletChild;

    	var i, locPlayer =this._player;
    	for (i = 0; i < BB.CONTAINER.COINS.length; i++) {
    		selChild = BB.CONTAINER.COINS[i];
    		if (!selChild.active)
    			continue;

    		if(this.collide(selChild, locPlayer)){
    			selChild.collected();
    		}
    	}
    },
    collide:function (a, b) {
    	var ax = a.x, ay = a.y, bx = b.x, by = b.y;
    	if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
    		return false;

    	var aRect = a.collideRect(ax, ay);
    	var bRect = b.collideRect(bx, by);
    	return cc.rectIntersectsRect(aRect, bRect);
    },
    setupControls: function(){
    	//KEYBOARD
    	if (cc.sys.capabilities.hasOwnProperty('keyboard'))
    		cc.eventManager.addListener({
    			event: cc.EventListener.KEYBOARD,
    			onKeyPressed:function (key, event) {
    				event.getCurrentTarget().processEvent(PLAYER_EVENT_JUMP);
    			}
    		}, this);

    	//CLICK
    	if ('mouse' in cc.sys.capabilities)
    		cc.eventManager.addListener({
    			event: cc.EventListener.MOUSE,
    			onMouseMove: function(event){
    				if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
    					event.getCurrentTarget().processEvent(PLAYER_EVENT_JUMP);
    			}
    		}, this);

    	//TOUCH
    	if (cc.sys.capabilities.hasOwnProperty('touches')){
    		cc.eventManager.addListener({
    			prevTouchId: -1,
    			event: cc.EventListener.TOUCH_ALL_AT_ONCE,
    			onTouchesBegan:function (touches, event) {
    				event.getCurrentTarget().processEvent(PLAYER_EVENT_JUMP);
    			}
    		}, this);
    	}
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

