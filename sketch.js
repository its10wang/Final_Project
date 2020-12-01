let plane;		   //Large aircraft	
let colors = [];   //color array
let enemy = [];  //The enemy plane array
let bullet = [];  //The bullet array
let score = 0;     //score
let level = 0;

let bulletNum = 20;  //子弹个数
let bulletuseNum = 0;  //子弹使用个数
let bnum = 0;
let blood = 20;
let isPause = 0;      //是否暂停
let hitRange = 40;   //子弹杀伤半径
/* 爆炸效果变量 */
plumes = [];
/* 爆炸效果颜色池 */
firecolors = ["red", "lime", "blue", "cyan", "yellow", "orange", "magenta"];

/* 背景1变量 */
var particles_a = [];
var particles_b = [];
var particles_c = [];
var nums =200;
var noiseScale = 800;

let winlose = 0;

let enemyhitnum = 1;
let enemyspeed = 5;
/* 背景2 */
let scrblrs = [];
const COLS = createCols("https://coolors.co/242220-ff6a45-ffb094-7934ad-1bc4b6-6a7a5b");
let img;
let img1;
let eplane;
let ebullet;
function preload()
{
	img = loadImage("bg0.jpg");
	img1 = loadImage("bg1.jpg");
}

/* 初始化函数 */
function setup() 
{
	createCanvas(400,windowHeight);
	plane = new Plane();
	eplane = new EnemyPlane();
	colors.push(color(255,0,255));
	colors.push(color(0, 0, 220));
	colors.push(color(0,153,0));
	colors.push(color(175, 100, 220));
	/* 创建敌机 */
	for(let i = 0 ; i < 9; i++)
	{
		enemy.push(new Enemy(401,windowHeight+1));
	}
	/* 创建子弹 */
	for(let i = 0 ; i < bulletNum; i++)
	{
		bullet.push(new Bullet(i%4));
	}
	ebullet = new EnemyBullet(2);
	bnum = (bulletNum - bulletuseNum);
	initbg();
	for(let i=0; i < 75; i++)
	{
		scrblrs.push(new Scribbler(width/2, height /2));
	}
}

/* 循环执行画图 */
function draw() 
{
	// background(0);
	//动态背景
	if(level == 0)
	{
		image(img,0,0)
	}
	else if(level == 1)
	{
		image(img1,0,0)
	}
	else
	{
		background(0);
		if(level%2===0)
		{
			drawbg();
		}
		else
		{
			for(const scrblr of scrblrs)
			{
				scrblr.update();
				scrblr.display();
			}
		}
	}
	 
	
	/* 画星星 */
	star();
	//画小飞机
	for (let i = 1; i < enemy.length; i++)
	{
		enemy[i].draw(enemy[i].x,enemy[i].y+enemy[i].len,colors[i%4]);
	} 
	/* 子弹 */
	for(let i = 0 ; i < bulletNum; i++)
	{
		bullet[i].update();
		bullet[i].draw();
	}
	/* 画大飞机 */
	plane.drawPlane(); 
	/* 画敌机大飞机 */
	eplane.drawPlane();
	if(ebullet.isUsed == 1)
	{
		ebullet.update();
		ebullet.draw();
	}
	else
	{
		ebullet.init(width/2,80);
	}
	
	//简单的爆炸效果显示
	for (let i = 0; i < plumes.length; i++){
		plumes[i].update();
		plumes[i].pDraw();
		if (plumes[i].life <= 0){
			plumes.splice(i, 1);
			i -= 1;
		}
	}
	/* 显示状态信息 */
	bnum = (bulletNum - bulletuseNum);
	/* console.log(bulletNum);
	console.log(bulletuseNum);
	console.log(bnum); */
	showStatus();
	//判断是否通关，或失败
	winOrLose();
}

/* 输赢判断 */
function winOrLose()
{
	if(blood<0)
	{
		winlose = 1;
		fill(255);
		textSize(38);
		text("You Lose", width/2-60, height/2);
		textSize(20);
		text("R replay, N next", width/2-60, height/2+40);
		noLoop();
	}
	if(score>30)
	{
		winlose = 2;
		fill(255);
		textSize(38);
		text("You Win", width/2-60, height/2);
		textSize(20);
		text("R replay, N next", width/2-60, height/2+40);
		noLoop();
	}
}

/* 鼠标点击事件 */
function mousePressed()
{
	/* for(let i = 0 ; i < bulletNum; i++)
	{
		if(bullet[i].getUsed()===0)
		{
			bullet[i].init(plane.planeX,plane.planeY);
			bulletuseNum++;
			break;
		}
	} */
	
}
/* 添加保证效果 */
function addBloom(x,y)
{
	let numPlumes = int(random(100, 500));
	let c = colors[int(random(colors.length))];
	for (let j = 0; j < numPlumes; j++){
		plumes.push(new Plume(x,y, random(5, 10), c));
	}
}

/* 爆炸效果类 */
class Plume {
	constructor(x, y, s, c){
		this.x = x;
		this.y = y;
		this.xa = random(-1, 1) * s;
		this.ya = random(-1, 1) * s;
		this.c = c;
		this.life = random(25, 35);
	}
	update(){
		this.x += this.xa;
		this.y -= this.ya;
		this.ya -= 0.07;
		this.life -= 1;
	}
	pDraw(){
		strokeWeight(random(4));
		stroke(this.c);
		point(this.x, this.y);
	}
}


/* 键盘按下处理函数
Q键控制发射子弹
空格键控制暂停与开始
 */
function keyPressed()
{
	console.log(keyCode);
	//'Q控制发射子弹'
	if(keyCode === 81)  
	{
		for(let i = 0 ; i < bulletNum; i++)
		{
			if(bullet[i].getUsed()===0)
			{
				bullet[i].init(plane.planeX,plane.planeY);
				bulletuseNum++;
				break;
			}
		}
	}
	//空格键控制暂停与开始
	if(keyCode ===32)  
	{
		if(isPause === 0)
		{
			isPause = 1;
			noLoop();
		}
		else
		{
			isPause = 0;
			loop();
		}
	}
	/* N 下一局 */
	if(keyCode === 78)  
	{
		/* 成功下一局 */
		if(winlose === 2)
		{
			level++;
			enemyhitnum = enemyhitnum+level; //打中次数
			enemyspeed = enemyspeed+level;  //速度
			/* 修改下一局的参数 */
			for (let i = 1; i < enemy.length; i++)
			{
				enemy[i].changelevel(enemyhitnum,enemyspeed);
			} 
			blood = 20;
			score = 0;
			loop();
		}
	}	
	/* R 重新 */
	if(keyCode === 82)  
	{
		/* 失败重新 */
		if(winlose === 1 || winlose === 2)
		{
			blood = 20;
			score = 0;
			loop();
		}
	}	
}


/* 子弹类*/
class Bullet
{
	/* 构造函数，创建对象时调用 */
	constructor(color)
	{
		this.bulletX = 0;   //子弹位置
		this.bulletY = 0;	//子弹位置
		this.isUsed  = 0;   //是否被使用   
		this.color  = color;   //子弹颜色 
		this.speed = 3;		   //子弹的速度
	}
	
	/* 根据子弹发射位置初始化子弹信息 */
	init(x,y)
	{
		this.bulletX = x;   //子弹位置
		this.bulletY = y;	//子弹位置
		this.isUsed  = 1;   //是否被使用  
	}	
	
	/* draw function */
	draw()
	{
		if(this.isUsed == 1)
		{
			this.drawbullet();
		}
	}
	/* 更新子弹的位置 */
	update()
	{
		if(this.isUsed == 1)
		{
			//更新子弹的位置
			this.bulletY = this.bulletY - this.speed;
			if(this.bulletY<10)
			{
				this.isUsed  = 0;
				bulletuseNum--;
			}
		}
	}
	
	/* 画子弹 */
	drawbullet()
	{
		stroke(colors[this.color]%4);
		fill(colors[this.color%4]);
		ellipse(this.bulletX,this.bulletY,3,15);
	}
	/* 获取子弹使用情况 */
	getUsed()
	{
		return this.isUsed;
	}
	
	/* 清子弹使用标志 */
	clearUsed()
	{
		this.isUsed = 0;
	}
}


/* 子弹类*/
class EnemyBullet
{
	/* 构造函数，创建对象时调用 */
	constructor(color)
	{
		this.bulletX = 0;   //子弹位置
		this.bulletY = 0;	//子弹位置
		this.isUsed  = 0;   //是否被使用   
		this.color  = color;   //子弹颜色 
		this.speed = 3;		   //子弹的速度
	}
	
	/* 根据子弹发射位置初始化子弹信息 */
	init(x,y)
	{
		this.bulletX = x;   //子弹位置
		this.bulletY = y;	//子弹位置
		this.isUsed  = 1;   //是否被使用  
	}	
	
	/* draw function */
	draw()
	{
		if(this.isUsed == 1)
		{
			this.drawbullet();
		}
	}
	/* 更新子弹的位置 */
	update()
	{
		if(this.isUsed == 1)
		{
			//更新子弹的位置
			this.bulletY = this.bulletY + this.speed;
			if(this.bulletY> height)
			{
				this.isUsed  = 0;
			}
		}
	}
	
	/* 画子弹 */
	drawbullet()
	{
		stroke(colors[this.color]%4);
		fill(colors[this.color%4]);
		ellipse(this.bulletX,this.bulletY,3,15);
	}
	/* 获取子弹使用情况 */
	getUsed()
	{
		return this.isUsed;
	}
	
	/* 清子弹使用标志 */
	clearUsed()
	{
		this.isUsed = 0;
	}
}


/*敌机 大飞机类 */
class EnemyPlane 
{
	/* 构造函数 创建对象时调用 */
	constructor() 
	{
		this.planeX = width/2;
		this.planeY = 50;
	}
	/* 画飞机  */
	drawPlane()
	{
		this.plane(this.planeX,this.planeY);
	}
	/* 画飞机的形状 */
	plane(x,y)
	{
		fill(240,166,254);
		stroke(58,166,254);
		ellipse(x, y, 20, 60);
		ellipse(x, y-28, 40, 8);
		ellipse(x, y, 60, 18);
	}
}


/* 大飞机类 */
class Plane 
{
	/* 构造函数 创建对象时调用 */
	constructor() 
	{
		this.planeX = 160;
		this.planeY = 500;
		this.speed = 5;    //速度
	}
	/* 修改飞机位置 */
	mouseLister(x,y)
	{
		this.planeX = x;
		this.planeY = y;
	}
	/* 画飞机  */
	drawPlane()
	{
		this.update();
		/* 判断大飞机是否被撞到 */
		for (let i = 1; i < enemy.length; i++)
		{
			//enemy[i].draw(enemy[i].x,enemy[i].y+enemy[i].len,colors[i%4]);
			if(Math.abs(enemy[i].x - this.planeX)<40&&Math.abs(enemy[i].y - this.planeY)<40)
			{
				//被撞击
				blood--;
				//小飞机无效
				enemy[i].clearEnemy();
			}
		} 
		this.plane(this.planeX,this.planeY);
		//let count = (this.planeX+120)/35;
		/* 子弹 */
		/* for(let i=0; i < 3; i++)
		{
			for(let j=0;j <= count; j++)
			{
				stroke(colors[j%4]);
				fill(colors[j%4]);
				let x=(this.planeX-20)+i*20;
				let y=(this.planeX-50)-j*25;
				ellipse(x,y,3,15);
			}
		}  */
	}
	/* 更新位置 */
	update()
	{
		let px;
		let py;
		//有按键按下
		if(keyIsPressed === true)
		{
			//方向键 向左
			if (keyCode === LEFT_ARROW) 
			{
				px = this.planeX-this.speed;
				let planeX=px<40?40:px>360?360:px;
				let planeY= this.planeY   ;//mouseY<40?40:mouseY>560?560:mouseY;
				this.mouseLister(planeX,planeY);
			}
			//方向键 向右
			if (keyCode === RIGHT_ARROW) 
			{
				px = this.planeX+this.speed;
				let planeX=px<40?40:px>360?360:px;
				let planeY= this.planeY   ;//mouseY<40?40:mouseY>560?560:mouseY;
				this.mouseLister(planeX,planeY);
			}
			//方向键 向上
			if (keyCode === UP_ARROW) 
			{
				py = this.planeY-this.speed;
				let planeX=this.planeX;
				let planeY= py<40?40:py>560?560:py;
				this.mouseLister(planeX,planeY);
			}
			//方向键 向下
			if (keyCode === DOWN_ARROW) 
			{
				py = this.planeY+this.speed;
				let planeX=this.planeX;
				let planeY= py<40?40:py>560?560:py;
				this.mouseLister(planeX,planeY);
			}
		}	
	}
	
	/* 画飞机的形状 */
	plane(x,y)
	{
		fill(58,166,254);
		stroke(58,166,254);
		ellipse(x, y, 20, 60);
		ellipse(x, y+28, 40, 8);
		ellipse(x, y, 60, 18);
	}
}

/* 敌机 */
class Enemy 
{
	/* 构造函数，创建对象时调用 */
	constructor(x,y) 
	{
		this.x = x;
		this.y = y;
		this.len = 5;  //控制速度  控制难易程度
		this.hitnum = 0; //被击中次数，控制难易程度
		this.maxHitnum = 1; //最大被击中次数
	}
	/* 修改小飞机的速度与打中次数 */
	changelevel(num,speed)
	{
		this.hitnum = num;
		this.len = speed;
	}
	
	/* 画小飞机 */
	draw(x,y,c)
	{
		/* if(plane.planeX<x&&(x-plane.planeX)<50||plane.planeX>x&&(plane.planeX-x)<50)
		{
			//被击中 数据加
			score++;   
			y=windowHeight+10;
			x=999;
			
		} */
		
		for(let i = 0;i< bulletNum;i++)
		{
			//有效的子弹
			if(bullet[i].getUsed()===1)
			{
				//判断是否打中敌机
				if(Math.abs(x-bullet[i].bulletX)<hitRange && Math.abs(y-bullet[i].bulletY)<hitRange)
				{
					//子弹无效
					bullet[i].clearUsed();
					bulletuseNum--;
					//击中次数加1
					this.hitnum++;
				}
			}
		}
		//被击落
		if(this.hitnum>this.maxHitnum)
		{
			//添加爆炸效果
			addBloom(x,y);
			score++;   
			y=windowHeight+10;
			x=999;
		}
		//判断位置是否超过范围  自然增加超过范围或者被击爆炸
		//this.x = x>400?(int)(Math.random()*350)+40:this.x;
		//this.y = y>windowHeight?-(int)(Math.random()*200):y;
		if(x>400 || y>windowHeight)
		{   
			//重新开始
			this.x = (int)(Math.random()*350)+40;
			this.y = -(int)(Math.random()*200);
			this.hitnum = 0; //被击中次数清零
		}
		else
		{
			this.x = x;
			this.y = y;
		}
		this.MiniPlane(this.x,this.y,c);
	}
	/* 小飞机无效 */
	clearEnemy()
	{
		this.y=windowHeight+10;
		this.x=999;
	}
	/*画小飞机的形状*/
	MiniPlane(x,y,c)
	{
		fill(c);
		stroke(c);
		ellipse(x, y, 10, 30);
		ellipse(x, y-15, 20, 10);
		ellipse(x, y, 30, 10);
	}
}


/* 星星 */
function star()
{
	let star;
	stroke(255);
	fill(255);
	star=random(7);
	ellipse(random(width),random(height),star,star);
	ellipse(random(width),random(height),star,star);
}

/* 鼠标移动 修改飞机位置 */
function mouseMoved()
{
	
}
/* 显示得分 等级 以及血量 */
function showStatus() 
{
	/* 显示得分 */
	fill(255);
	textSize(16);
	text("score:"+score, 5, 16);
	/* 显示等级 */
	fill(255);
	textSize(16);
	text("lovel:"+level, 5, 32);
	/* 显示血量 */
	fill(255);
	textSize(16);
	text("bullet:"+bnum, 5, 48);
	/* 显示血量 */
	fill(255);
	textSize(16);
	text("blood:"+blood, 5, 64);
} 


/* 背景1初始化 */
function initbg()
{
	background(21, 8, 50);
	for(var i = 0; i < nums; i++){
		particles_a[i] = new Particle(random(0, 400),random(0,height));
		particles_b[i] = new Particle(random(0, 400),random(0,height));
		particles_c[i] = new Particle(random(0, 400),random(0,height));
	}
}

function Particle(x, y){
	this.dir = createVector(0, 0);
	this.vel = createVector(0, 0);
	this.pos = createVector(x, y);
	this.speed = 0.4;

	this.move = function(){
		var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*TWO_PI*noiseScale;
		this.dir.x = cos(angle);
		this.dir.y = sin(angle);
		this.vel = this.dir.copy();
		this.vel.mult(this.speed);
		this.pos.add(this.vel);
	}

	this.checkEdge = function(){
		if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
			this.pos.x = random(50, width);
			this.pos.y = random(50, height);
		}
	}

	this.display = function(r){
		ellipse(this.pos.x, this.pos.y, r, r);
	}
}
/* 刷新显示背景 */
function drawbg()
{
	noStroke();
	smooth();
	for(var i = 0; i < nums; i++)
	{
		var radius = map(i,0,nums,1,2);
		var alpha = map(i,0,nums,0,250);

		fill(69,33,124,alpha);
		particles_a[i].move();
		particles_a[i].display(radius);
		particles_a[i].checkEdge();

		fill(7,153,242,alpha);
		particles_b[i].move();
		particles_b[i].display(radius);
		particles_b[i].checkEdge();

		fill(255,255,255,alpha);
		particles_c[i].move();
		particles_c[i].display(radius);
		particles_c[i].checkEdge();
	}  
}

/* 背景2 */
class Scribbler
{
	constructor(x, y)
	{
    this.cX = x;
    this.cY = y;
		this.minRadius = 25;
		this.maxRadius = min(width, height) * 0.4;
		
		this.isMovingAngle = false;
		this.radius = random(this.minRadius, this.maxRadius);
		this.angle = random(TWO_PI);
		this.angleV = 0;
		this.radiusV = 0;
    this.randomVelocities();
    
    this.strokeW = random(1,2.5);
    this.strokeC = COLS[floor(random(1,COLS.length))];
		
		this.cache = [];
		this.cacheCapacity = 120;
		
		this.cycle = floor(random(200,300));
		this.rotateAngle = random(TAU);
		this.rotateAngleTarget = this.rotateAngle + random(-1, 1);
		this.ratio = 0;
		this.frameOffset = floor(random(this.cycle));
	}
	
  
  update()
  {
		//pos
    let curX = (cos(this.angle) * this.radius);
    let curY = (sin(this.angle) * this.radius);
    this.cache.push(createVector(curX,curY));
		if(this.cache.length > this.cacheCapacity) this.cache.shift();
		
		//param
    if(this.isMovingAngle)
    {
      this.angle += this.angleV;
    }
    else 
    {
			if(this.radius < this.minRadius && this.radiusV < 0)this.radius += 0;
			else this.radius += this.radiusV * (1 + this.radius * 0.005);
    }
    if(random(1) > 0.9)
    {
       this.swapMode();
    }
		
		//time
		const count = frameCount + this.frameOffset;
		const cycleRatio = (count % this.cycle) / this.cycle;
		const cycleRatioMult = min(cycleRatio * 4, 1);
		const cycleRatioEased = easingEaseInOutCubic(cycleRatioMult);
		this.ratio = cycleRatioEased;
		if(count % this.cycle == 0){
			this.rotateAngle = this.rotateAngleTarget;
			this.rotateAngleTarget = this.rotateAngle + random(-1, 1);
		}
  }
	
	display()
	{
		let rotateAngle =  lerp(this.rotateAngle, this.rotateAngleTarget, this.ratio);
		let vertRatio =  1 + sin((this.ratio) * TAU) * 0.01;
		stroke(this.strokeC);
		strokeWeight(this.strokeW);
		noFill();
		push();
		translate(this.cX, this.cY);
		rotate(rotateAngle);
		beginShape();
		for(const p of this.cache){
			vertex(p.x * vertRatio, p.y* vertRatio);
		}
		endShape();
		pop();
	}
  
  swapMode()
  {
     this.isMovingAngle = !this.isMovingAngle;
     this.randomVelocities();
  }
  
  randomVelocities()
  {
		const angleSP = 0.05;
		const radiusSP = 2;
    this.angleV = random() > 0.5 ? random(-angleSP, -angleSP * 0.1) : random(angleSP, angleSP * 0.1) ;
		if(this.radius < this.minRadius)this.radiusV =  random(radiusSP * 0.1, radiusSP);
		else if(this.radius > this.maxRadius)this.radiusV =  random(-radiusSP, -radiusSP * 0.1);
		else this.radiusV = random() > 0.5 ? random(radiusSP * 0.1, radiusSP) : random(-radiusSP, -radiusSP * 0.1);
  }
}


function easingEaseInOutCubic (x) {
	if(x < 0.5)return 0.5 * pow(2*x, 3);
	else return 0.5 * pow(2*(x-1), 3) + 1;
}

function createCols(_url)
{
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = '#' + arr[i];
  }
  return arr;
}