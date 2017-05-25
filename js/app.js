// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
// move 属性控制每个敌人移动的距离
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (Game.setGameRun === true) {
        this.x += this.speed * dt;
    }
    // 超出右边界限，设置位置到左边
    if (this.x > 505) {
        // 拉动到左边以外，使敌人出来的时间随机
        this.x = -(Game.getRandom(101, 303));
        // 重新设定速度
        this.speed = Game.getRandom(50, 400);
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
/**
* 玩家类的构造函数
* 参数: x,y 为玩家的坐标
* resetX ,resetY 重置玩家坐标为初始化的坐标
* collided 碰撞状态
* collideOn 是否开启碰撞检测
*/
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.resetX = x;
    this.resetY = y;
    this.collided = false;
    // 开启检测碰撞
    this.collideOn = true;
    this.user = 'images/char-boy.png';
};

// 更新玩家位置
Player.prototype.update = function() {
    // 发生碰撞
    if (this.collided) {
        this.handleCollisions();
    }

    // 游戏获胜
    if (Game.winStatus === true && Game.setGameRun === true) {
        this.y -= 60;
        Game.win();
    }
};

// 在屏幕上画出玩家
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.user), this.x, this.y);
};

// 上下左右按键移动玩家的位置
Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
    case 'left':
        if (player.canMoveLeft()) {
            this.moveLeft();
        }
        break;
    case 'up':
        // 玩家到达河边，游戏获胜
        if (player.arriveRiver()) {
            Game.winStatus = true;
        }
        if (player.canMoveUp()) {
            this.moveUp();
        }
        break;
    case 'right':
        if (player.canMoveRight()) {
            this.moveRight();
        }
        break;
    case 'down':
        if (player.canMoveDown()) {
            this.moveDown();
        }
        break;
    default:
        break;
    }
};

// 碰撞处理
Player.prototype.handleCollisions = function() {
    // 游戏暂停
    Game.setGameRun = false;
    // 碰撞时暂停检测碰撞
    this.collideOn = false;
    this.collided = false;
    // 红心数量不为0时碰撞敌人，暂停500ms效果
    if (Game.heartCount > 1) {
        setTimeout(function() {
            // 暂停时间到后，开启碰撞检测
            this.collideOn = true;
            // 重置玩家位置
            this.resetLocation();
            Game.setGameRun = true;
            // 碰撞红心数量减一
            Game.heartCal('-1');
            // 移走红心
            buff.x = 700;
            // 继续开始创建buff
            buff.created = false;
        }.bind(this), 500);// 改变this指向，为Player对象
    }

    // 只剩最后一颗红心时碰撞 先不改变玩家位置  点击失败按钮后才更新玩家位置
    if (Game.heartCount <= 1) {
      // 关闭碰撞检测
        this.collideOn = false;
        Game.heartCal('-1');
    }
};

// 玩家重置到初始化的位置
Player.prototype.resetLocation = function() {
    this.x = this.resetX;
    this.y = this.resetY;
};
// 玩家向左移动
Player.prototype.moveLeft = function() {
    this.x -= 101;
};

// 玩家向右移动
Player.prototype.moveRight = function() {
    this.x += 101;
};

// 玩家向上移动
Player.prototype.moveUp = function() {
    this.y -= 83;
};

// 玩家向下移动
Player.prototype.moveDown = function() {
    this.y += 83;
};

/**
* 定义游戏增益效果
* buffUrl: Buff的图片路径
* created: Buff是否已经出现， true为出现
*/
var Buff = function() {
    this.buffUrl = 'images/Heart.png';
    this.created = false;
};

/**
* Buff的位置更新
* 随机产生两个数，产生的两个数相等时 创建Buff 达到不定时出现Buff效果
*/
Buff.prototype.update = function() {
    // 随机产生两个数
    var randOld = Game.getRandom(1, 1000);
    var randNew = Game.getRandom(1, 100);
    // 游戏运行和没有创建buff的情况下才创建Buff
    if (Game.setGameRun === true && this.created === false) {
        // 两个随机数相等时画出一个红心  达到随机产生buff的效果
        if (randNew === randOld) {
            this.created = true;
            // Buff只出现在石头路的区域
            this.x = Game.getRandom(0, 4) * 101;
            this.y = Game.getRandom(1, 3) * 83;
        }
    }
};

// 画出Buff
Buff.prototype.render = function() {
    ctx.drawImage(Resources.get(this.buffUrl), this.x, this.y);
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 Game.allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

// 实例buff对象
var buff = new Buff();
// 实例玩家对象
var player = new Player(202, 382);

// 玩家能否向左移
player.canMoveLeft = function() {
    if (this.x > 0) {
        return true;
    }
    return false;
};

// 玩家能否向右移
player.canMoveRight = function() {
    if (this.x < 404) {
        return true;
    }
    return false;
};

// 玩家能否向下移
player.canMoveDown = function() {
    if (this.y < 382) {
        return true;
    }
    return false;
};

// 玩家能否向上移动
player.canMoveUp = function() {
    if (this.y > 50) {
        return true;
    }
    return false;
};

// 玩家是否到达河边
player.arriveRiver = function() {
    if (this.y <= 50) {
        return true;
    }
    return false;
};

/**
* 定义游戏公共资源对象
*/
var Game = {
    allEnemies: [], // 定义所有敌人的一个数组
    heartCount: 3, // 初始化红心数量3个
    winStatus: false, // 游戏获胜
    gameOverStatus: false, // 游戏失败
    // 设置游戏是否运行  setGameRun = false 敌人和玩家禁止移动
    setGameRun: true,
    btnSettingStatus: false, // 设置按钮点击状态
    changeRole: false, // 是否选择角色
    btnScoreStatus: false, // 设置里面的最高分按钮的点击状态
    score: 0, // 记录当前的得分
    newScore: 0, // 最高分
    btnWinOrFldSpd: 200, // 游戏获胜或者失败按钮出现的动画移动速度
    btnMoveX: 0, // 游戏获胜或者失败按钮移动的X坐标
    btnMoveY: 0, // 游戏获胜或者失败按钮移动的Y坐标
    x: 0, // 点击获取画布坐标 x
    y: 0, // 点击获取画布坐标 y

    /**
     * 定义一个介于min到max的随机数整数
     * min 随机数的最小值 max 随机数的最大值
     */
    getRandom: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * 制作敌人的函数
     * enemyNum: 需要制造敌人的数量
     */
    makeEnemies: function(enemyNum) {
        // 判断是否有传enemyNum进来以及 enemyNum 的类型对不对
        if (enemyNum && typeof enemyNum === 'number') {
            for (var i = 0; i < enemyNum; i++) {
                var enemy = new Enemy();
                // 通过随机函数 不同敌人有不同的移动速度
                enemy.speed = this.getRandom(20, 500);
                enemy.x = -(this.getRandom(202, 404));
                enemy.y = Math.floor(i % 3) * 83 + 50;
                // 所有敌人实例放进Game.allEnemies数组
                this.allEnemies.push(enemy);
            }
        } else {
            alert('makeEnemies 需要接收一个参数，并且这个参数必须是number类型的');
        }
    },

    /**
     * 敌人与玩家碰撞检测函数
     * 碰撞的条件 ：
     * 1.敌人进入玩家区域前 ：敌人坐标的 x + 敌人图标的宽度 大于等于 玩家坐标 x
     * 2.敌人离开玩家区域前 ：敌人坐标的 x 小于玩家坐标 x + 玩家图标的宽度
     * 3.敌人的y坐标与玩家的y坐标相同
     * IMG_WIDTH: 图标宽度设置  这里把图标宽度调到50 突出碰撞效果
     */
    checkCollisions: function() {
        var IMG_WIDTH = 50;
        // 没有碰撞的前提下进行检测
        if (player.collideOn === true) {
            this.allEnemies.forEach(function(enemy) {
                if ((enemy.x + IMG_WIDTH >= player.x &&
                    enemy.x <= player.x + IMG_WIDTH) &&
                    enemy.y === player.y) {
                    player.collided = true;
                    buff.created = false;
                }
            });

            // 玩家不碰撞敌人的前提下 才能碰撞buff
            if (player.collided === false && buff.created === true) {
                if (buff.x === player.x && (buff.y - 33) === player.y) {
                    this.heartCal('+1');
                    buff.created = false;
                    // 碰撞加了buff后 ，移走buff
                    buff.x = 700;
                }
            }
        }
    },

    /**
    * 重置敌人位置
    */
    resetAllEnemiesLocation: function() {
        // 保存this对象
        var _this = this;
        this.allEnemies.forEach(function(enemy) {
            enemy.x = -(_this.getRandom(202, 404));
        });
    },

    /**
    * 绘制顶部导航
    */
    makeNav: function() {
        // 绘制导航条颜色
        ctx.fillStyle = '#5FC148';
        ctx.beginPath();
        ctx.fillRect(0, 0, 505, 50);
        ctx.fill();
        ctx.closePath();

        // 绘制红心
        ctx.drawImage(Resources.get('images/Heart.png'), 300, -20, 50, 84);

        // 绘制红心数量
        this.heartCal();

        // 游戏设置按钮
        this.drawGameSetting();

        // 绘制得分分数
        this.drawScore();
    },

    /**
     * 计算红心数量
     * 通过函数的arguments对象构建不同的函数功能
     * 当碰撞发生时 只需传入一个参数  字符串 '+1' 或 '-1'
     */
    heartCal: function() {
        // arguments是类数组对象需要转为数组
        var arg = Array.prototype.slice.call(arguments);

        ctx.font = '36px Impact';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';

        if (typeof this.heartCount === 'number') {
            // 不传参数 红心数量不变
            if (arg.length === 0) {
                ctx.fillText('X ' + this.heartCount, 380, 40);
            } else if (arg.length === 1) {
                // 红心数量加1
                if (arg[0] === '+1') {
                    ctx.fillText('X ' + (this.heartCount++), 425, 40);
                } else if (arg[0] === '-1') {
                    // 红心数量减1
                    ctx.fillText('X ' + (this.heartCount--), 425, 40);
                }
            }
        } else {
            alert('红心数量初始化设置的不是number类型');
        }
        // 红心数量少于等于0时游戏失败
        if (this.heartCount <= 0 && this.gameOverStatus === false) {
            this.failed();
        }
    },

    /**
    * 游戏设置按钮
    */
    drawGameSetting: function() {
        ctx.fillStyle = '#2B8217';
        ctx.fillRect(445, 5, 60, 40);
        ctx.fill();

        // 绘制设置按钮的三条白线
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(455, 15);
        ctx.lineTo(495, 15);
        ctx.moveTo(495, 25);
        ctx.lineTo(455, 25);
        ctx.moveTo(455, 35);
        ctx.lineTo(495, 35);
        ctx.stroke();
        ctx.closePath();
    },

    /*
    * 画出得分
    */
    drawScore: function() {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.font = '25px sans-serif';
        ctx.fillText('得分', 50, 35);
        ctx.fillText(this.score, 100, 35);
        ctx.closePath();
    },

    /**
    * 游戏设置下拉条
    */
    drawSelection: function() {
      // 下拉框
        ctx.fillStyle = '#2B8217';
        ctx.fillRect(425, 50, 80, 128);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        // 角色和最高分按钮
        ctx.fillText('角色', 465, 92);
        ctx.fillText('最高分', 465, 156);
    },

    /**
    * 最高分
    */
    topScore: function() {
        ctx.fillStyle = '#2B8217';
        ctx.fillRect(355, 114, 70, 64);
        ctx.fillStyle = '#EC3737';
        ctx.fillText(this.newScore, 390, 156);
    },

    /**
    * 角色选择
    */
    chooseRole: function() {
        var update = false, // 是否更新角色
            roleUrl;// 角色图片路径
        if ((this.x >= 120 && this.x < 182)
        && (this.y > 50 && this.y < 114)) {
            roleUrl = 'images/char-boy.png';
            update = true;
        } else if ((this.x >= 182 && this.x < 244)
        && (this.y > 50 && this.y < 114)) {
            roleUrl = 'images/char-cat-girl.png';
            update = true;
        } else if ((this.x >= 244 && this.x < 306)
        && (this.y > 50 && this.y < 114)) {
            roleUrl = 'images/char-horn-girl.png';
            update = true;
        } else if ((this.x >= 306 && this.x < 368)
        && (this.y > 50 && this.y < 114)) {
            roleUrl = 'images/char-pink-girl.png';
            update = true;
        } else if ((this.x >= 368 && this.x < 430)
        && (this.y > 50 && this.y < 114)) {
            roleUrl = 'images/char-princess-girl.png';
            update = true;
        }
        update === true && this.updateRole(roleUrl);
    },

    /**
    * 更新角色
    */
    updateRole: function(url) {
        player.user = url;
        this.setGameRun = true;
        this.changeRole = false;
        // 红心数量重置
        this.heartCount = 3;
        // 重置设置按钮状态
        this.btnSettingStatus = false;
        this.score = 0;
        // 重置玩家位置
        player.resetLocation();
        // 重置敌人位置
        this.resetAllEnemiesLocation();
        // 移除buff
        buff.x = 700;
        // 产生buff
        buff.created = false;
    },

    /**
    * 角色预览
    */
    previewTheRoles: function() {
        ctx.drawImage(Resources.get('images/roles.png'), 120, 50, 310, 64);
    },

    /**
    * 绘制失败或获胜按钮
    */
    drawWinOrFailedBtn: function(dt, url) {
        if (this.gameOverStatus === true) {
            // 游戏失败 从右往左移动按钮
            this.btnMoveX -= this.btnWinOrFldSpd * dt;
            // x坐标 157就停止
            this.btnMoveX <= 157 && (this.btnMoveX = 157);
        } else if (this.winStatus === true) {
            // 游戏获胜 从左往右移动按钮
            this.btnMoveX += this.btnWinOrFldSpd * dt;
            this.btnMoveX >= 157 && (this.btnMoveX = 157);
        }
        this.btnMoveY += this.btnWinOrFldSpd * dt;
        this.btnMoveY >= 250 && (this.btnMoveY = 250);
        ctx.drawImage(Resources.get(url), this.btnMoveX, this.btnMoveY);
    },

    /**
    * 游戏获胜
    */
    win: function() {
        // 到达河边加10分
        this.score += 10;
        // 更新最高分
        this.score > this.newScore && (this.newScore = this.score);
        // 设置游戏暂停
        this.setGameRun = false;
        // 重置设置按钮状态
        this.btnSettingStatus = false;
        // 获胜按钮从左上角开始移动
        this.btnMoveX = 0;
        // 禁止产生buff
        buff.created = true;
    },

    /**
    *  游戏失败
    */
    failed: function() {
        // 游戏失败
        this.gameOverStatus = true;
        // 红心数量清 0
        this.heartCount = 0;
        this.setGameRun = false;
        this.btnSettingStatus = false;
        // 失败按钮从右上角开始移动
        this.btnMoveX = 505;
        // 禁止产生buff
        buff.created = true;
    },

    /*
    * 获胜、失败后的初始化
    */
    winOrFailedInit: function() {
        this.setGameRun = true;
        this.winStatus = false;
        this.gameOverStatus = false;
        this.btnScoreStatus = false;
        // 获胜或失败按钮y坐标回到顶部
        this.btnMoveY = 0;
        buff.created = false;
        // 移走buff
        buff.x = 700;
        // 重置玩家位置
        player.resetLocation();
        // 开启碰撞检测
        player.collideOn = true;
        // 隐藏获胜或失败按钮
        ctx.clearRect(151, 250, 210, 60);
        // 游戏重新开始
        Resources.readyCallbacks.forEach(function(func) { func(); });
    },

    /**
     * 获取用户点击的画布坐标
     */
    handleMouseClick: function(evt) {
        this.x = evt.clientX - c.offsetLeft;
        this.y = evt.clientY - c.offsetTop;

        // 游戏失败或者获胜后出现的按钮点击处理
        if ((this.x >= 151 && this.x < 361)
        && (this.y >= 250 && this.y < 310)) {
            this.handleWinOrFailed();
        }

        // 游戏设置按钮
        if ((this.x >= 430 && this.x < 495)
        && (this.y >= 5 && this.y < 40)) {
            this.handleBtnSetting();
        }

        // 角色选择按钮
        if ((this.x >= 425 && this.x < 505)
        && (this.y >= 50 && this.y < 114)) {
            this.handleBtnRole();
        }
        // 按下了角色按钮，才能点击选择不同的角色
        if (this.changeRole === true) {
            this.chooseRole();
        }

        // 最高分按钮
        if ((this.x >= 425 && this.x < 505)
        && (this.y >= 114 && this.y < 178)) {
            this.handleBtnTopScore();
        }
    },

    /**
    * 游戏获胜或失败按钮点击后处理
    */
    handleWinOrFailed: function() {
        // 游戏失败
        if (this.gameOverStatus === true) {
            // 红心数量重置
            this.heartCount = 3;
            // 得分清 0
            this.score = 0;
            // 重置怪物位置
            this.resetAllEnemiesLocation();
            this.winOrFailedInit();
        } else if (this.winStatus === true) { // 游戏获胜
            this.winOrFailedInit();
        }
    },

    /**
    * 按enter键与点击游戏获胜或失败按钮同样的操作
    */
    handleEnterInput: function(keyCode) {
        // 游戏获胜或失败按钮不移动后，按enter有效
        if (this.btnMoveX === 157 && this.btnMoveY === 250 && keyCode === 'enter') {
            this.handleWinOrFailed();
        }
    },
    /**
    * 设置按钮点击处理
    */
    handleBtnSetting: function() {
        // 如果游戏失败或者获胜 设置按钮无作用
        if (this.gameOverStatus === true || this.winStatus === true) {
            return;
        }
        // 设置游戏运行
        if (this.setGameRun === false) {
            this.setGameRun = true;
            // 设置按钮状态重置
            this.btnSettingStatus = false;
            // 角色按钮重置
            this.changeRole = false;
            // 得分按钮重置
            this.btnScoreStatus = false;
        } else {
            // 设置游戏暂停
            this.setGameRun = false;
            this.btnSettingStatus = true;
        }
    },

    /**
    * 游戏角色选择按钮  点击将会出现角色预览栏
    */
    handleBtnRole: function() {
        // 改变按钮状态
        this.changeRole === false ? (this.changeRole = true)
        : (this.changeRole = false);
        // 得分按钮重置
        this.btnScoreStatus = false;
    },

    /**
    * 最高分按钮  点击可以看到游戏的最高得分 再次点击隐藏最高得分
    */
    handleBtnTopScore: function() {
        // 改变按钮状态
        this.btnScoreStatus === false ? (this.btnScoreStatus = true)
        : (this.btnScoreStatus = false);
        // 角色按钮重置
        this.changeRole = false;
    },
};

// 制造6个敌人
Game.makeEnemies(6);
// 获取canvas元素
var c = document.querySelector('canvas');
// 为canvas元素绑定点击事件
c.addEventListener('click', Game.handleMouseClick.bind(Game), false);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // 游戏运行才能移动玩家
    Game.setGameRun === true && player.handleInput(allowedKeys[e.keyCode]);
    // 获胜或失败时按下enter键，游戏重新开始
    Game.handleEnterInput(allowedKeys[e.keyCode]);
});
