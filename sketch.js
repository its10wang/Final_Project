let plane;		   //big plane	
let colors = [];   //color array
let enemy = [];  //enemy plane array
let bullet = [];  //bullets array
let score = 0;     //score
let level = 0;

let bulletNum = 20;  //bullet number
let bulletuseNum = 0;  //bullet used number
let bnum = 0;
let blood = 20;
let isPause = 0;      //pause or not
let hitRange = 40;   //hitting range
/* Explosion effect variable */
plumes = [];
/* Explosion effect color array */
firecolors = ["red", "lime", "blue", "cyan", "yellow", "orange", "magenta"];

/* Background 1 variable */
var particles_a = [];
var particles_b = [];
var particles_c = [];
var nums =200;
var noiseScale = 800;

let winlose = 0;

let enemyhitnum = 1;
let enemyspeed = 5;
let isStart  = 0;
/* Background 2 */
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
	img2 = loadImage("start.jpg");
}

function setup() 
{
	createCanvas(400,windowHeight);
	plane = new Plane();
	eplane = new EnemyPlane();
	colors.push(color(255,0,255));
	colors.push(color(0, 0, 220));
	colors.push(color(0,153,0));
	colors.push(color(175, 100, 220));
	/* Create the enemy */
	for(let i = 0 ; i < 9; i++)
	{
		enemy.push(new Enemy(401,windowHeight+1));
	}
	/* create bullet */
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
	//image(img2,0,0);
	//noLoop();
}

function beforeDraw(){
	image(img2,0,0);
	//noLoop();
}



function afterdraw() 
{
	// background(0);
	//dynamic background
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
	 
	
	/* draw star */
	star();
	//draw small planes
	for (let i = 1; i < enemy.length; i++)
	{
		enemy[i].draw(enemy[i].x,enemy[i].y+enemy[i].len,colors[i%4]);
	} 
	/* bullets */
	for(let i = 0 ; i < bulletNum; i++)
	{
		bullet[i].update();
		bullet[i].draw();
	}
	/* draw big plane */
	plane.drawPlane(); 
	/* draw enemy big plane */
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
	
	// explosion effect display
	for (let i = 0; i < plumes.length; i++){
		plumes[i].update();
		plumes[i].pDraw();
		if (plumes[i].life <= 0){
			plumes.splice(i, 1);
			i -= 1;
		}
	}
	/* Display status  */
	bnum = (bulletNum - bulletuseNum);
	/* console.log(bulletNum);
	console.log(bulletuseNum);
	console.log(bnum); */
	showStatus();
	//pass or fail
	winOrLose();
}


//loop executes drawing
function draw(){
	if(isStart == 0){
		beforeDraw();
		textSize(19);
		fill(143,136,187);
		text("fire",32,48);
	}else{
		afterdraw();
	}
}



//Judge the winning or losing
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

/* Mouse click events */
function mousePressed()
{
	// 370   470   70   170  Click to start in the middle
	if( mouseX>70 &&mouseX<170 &&mouseY>370&&mouseY<470 )
	{
		isStart = 1;
	}
}
/* add effect */
function addBloom(x,y)
{
	let numPlumes = int(random(100, 500));
	let c = colors[int(random(colors.length))];
	for (let j = 0; j < numPlumes; j++){
		plumes.push(new Plume(x,y, random(5, 10), c));
	}
}

/* explosion effect class */
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


/* The keyboard presses the handler
Q key controls the firing of bullets
The space bar controls pause and start
 */
function keyPressed()
{
	console.log(keyCode);
	//'Q key controls the firing of bullets'
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
	//The space bar controls pause and start
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
	/* N next game */
	if(keyCode === 78)  
	{
		/* win and next game */
		if(winlose === 2)
		{
			level++;
			enemyhitnum = enemyhitnum+level; //hit number
			enemyspeed = enemyspeed+level;  //speed
			/* Modify the parameters for the next game */
			for (let i = 1; i < enemy.length; i++)
			{
				enemy[i].changelevel(enemyhitnum,enemyspeed);
			} 
			blood = 20;
			score = 0;
			loop();
		}
	}	
	/* R restart */
	if(keyCode === 82)  
	{
		/* lose and restart */
		if(winlose === 1 || winlose === 2)
		{
			blood = 20;
			score = 0;
			loop();
		}
	}	
}


/* bullet class*/
class Bullet
{
	/* Constructor, called when the object is created */
	constructor(color)
	{
		this.bulletX = 0;   //bullet position
		this.bulletY = 0;	//bullet position
		this.isUsed  = 0;   //used or not   
		this.color  = color;   //bullet color 
		this.speed = 3;		   //bullet speed
	}
	
	/* Initializes the bullet information according to the firing position of the bullet */
	init(x,y)
	{
		this.bulletX = x;   //bullet position
		this.bulletY = y;	//bullet position
		this.isUsed  = 1;   //used or not  
	}	
	
	/* draw function */
	draw()
	{
		if(this.isUsed == 1)
		{
			this.drawbullet();
		}
	}
	/* update bullet position*/
	update()
	{
		if(this.isUsed == 1)
		{
			//update bullet position
			this.bulletY = this.bulletY - this.speed;
			if(this.bulletY<10)
			{
				this.isUsed  = 0;
				bulletuseNum--;
			}
		}
	}
	
	/* draw bullet */
	drawbullet()
	{
		stroke(colors[this.color]%4);
		fill(colors[this.color%4]);
		ellipse(this.bulletX,this.bulletY,3,15);
	}
	/* get the usage of the bullets  */
	getUsed()
	{
		return this.isUsed;
	}
	
	/* clear the used of the bullets */
	clearUsed()
	{
		this.isUsed = 0;
	}
}


/* bullet class*/
class EnemyBullet
{
	/* Constructor, called when the object is created */
	constructor(color)
	{
		this.bulletX = 0;   //bullet position
		this.bulletY = 0;	//bullet position
		this.isUsed  = 0;   //used or not  
		this.color  = color;   //bullet color 
		this.speed = 3;		   //bullet speed
	}
	
	/* Initializes the bullet information according to the firing position of the bullet */
	init(x,y)
	{
		this.bulletX = x;   //bullet position
		this.bulletY = y;	//bullet position
		this.isUsed  = 1;   //used or not  
	}	
	
	/* draw function */
	draw()
	{
		if(this.isUsed == 1)
		{
			this.drawbullet();
		}
	}
	/* update bullet position */
	update()
	{
		if(this.isUsed == 1)
		{
			//update bullet position
			this.bulletY = this.bulletY + this.speed;
			if(this.bulletY> height)
			{
				this.isUsed  = 0;
			}
		}
	}
	
	/* draw bullet */
	drawbullet()
	{
		stroke(colors[this.color]%4);
		fill(colors[this.color%4]);
		ellipse(this.bulletX,this.bulletY,3,15);
	}
	/* get bullets usage */
	getUsed()
	{
		return this.isUsed;
	}
	
	/* clear used bullet */
	clearUsed()
	{
		this.isUsed = 0;
	}
}


/*enemy big plane  */
class EnemyPlane 
{
	constructor() 
	{
		this.planeX = width/2;
		this.planeY = 50;
	}
	drawPlane()
	{
		this.plane(this.planeX,this.planeY);
	}
	/* draw plane shape */
	plane(x,y)
	{
		fill(240,166,254);
		stroke(58,166,254);
		ellipse(x, y, 20, 60);
		ellipse(x, y-28, 40, 8);
		ellipse(x, y, 60, 18);
	}
}


/* big plane class */
class Plane 
{
	constructor() 
	{
		this.planeX = 160;
		this.planeY = 500;
		this.speed = 5;    //speed
	}
	/* modify the plane position */
	mouseLister(x,y)
	{
		this.planeX = x;
		this.planeY = y;
	}
	/* draw plane  */
	drawPlane()
	{
		this.update();
		/* Determine if the big plane was hit */
		for (let i = 1; i < enemy.length; i++)
		{
			//enemy[i].draw(enemy[i].x,enemy[i].y+enemy[i].len,colors[i%4]);
			if(Math.abs(enemy[i].x - this.planeX)<40&&Math.abs(enemy[i].y - this.planeY)<40)
			{
				//be hit
				blood--;
				//small plane invalid
				enemy[i].clearEnemy();
			}
		} 
		this.plane(this.planeX,this.planeY);
		//let count = (this.planeX+120)/35;
		/* bullet */
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
	/* update position */
	update()
	{
		let px;
		let py;
		if(keyIsPressed === true)
		{
			//arrow key left
			if (keyCode === LEFT_ARROW) 
			{
				px = this.planeX-this.speed;
				let planeX=px<40?40:px>360?360:px;
				let planeY= this.planeY   ;//mouseY<40?40:mouseY>560?560:mouseY;
				this.mouseLister(planeX,planeY);
			}
			//arrow key right
			if (keyCode === RIGHT_ARROW) 
			{
				px = this.planeX+this.speed;
				let planeX=px<40?40:px>360?360:px;
				let planeY= this.planeY   ;//mouseY<40?40:mouseY>560?560:mouseY;
				this.mouseLister(planeX,planeY);
			}
			//arrow key up
			if (keyCode === UP_ARROW) 
			{
				py = this.planeY-this.speed;
				let planeX=this.planeX;
				let planeY= py<40?40:py>560?560:py;
				this.mouseLister(planeX,planeY);
			}
			//arrow key down
			if (keyCode === DOWN_ARROW) 
			{
				py = this.planeY+this.speed;
				let planeX=this.planeX;
				let planeY= py<40?40:py>560?560:py;
				this.mouseLister(planeX,planeY);
			}
		}	
	}
	
	/* draw plane shape */
	plane(x,y)
	{
		fill(58,166,254);
		stroke(58,166,254);
		ellipse(x, y, 20, 60);
		ellipse(x, y+28, 40, 8);
		ellipse(x, y, 60, 18);
	}
}

/* enemy plane */
class Enemy 
{
	constructor(x,y) 
	{
		this.x = x;
		this.y = y;
		this.len = 5;  //Control speed control difficulty
		this.hitnum = 0; //The number of hits,control difficulty
		this.maxHitnum = 1; //Maximum hits
	}
	/* Modifies the speed and hit times of small aircraft */
	changelevel(num,speed)
	{
		this.hitnum = num;
		this.len = speed;
	}
	
	/* Draw small plane */
	draw(x,y,c)
	{
		/* if(plane.planeX<x&&(x-plane.planeX)<50||plane.planeX>x&&(plane.planeX-x)<50)
		{
			//Hit score plus
			score++;   
			y=windowHeight+10;
			x=999;
			
		} */
		
		for(let i = 0;i< bulletNum;i++)
		{
			//Effective bullet
			if(bullet[i].getUsed()===1)
			{
				//Determine if the enemy plane has been hit
				if(Math.abs(x-bullet[i].bulletX)<hitRange && Math.abs(y-bullet[i].bulletY)<hitRange)
				{
					//The bullet is invalid
					bullet[i].clearUsed();
					bulletuseNum--;
					//Hit count plus 1
					this.hitnum++;
				}
			}
		}
		//Was shot down
		if(this.hitnum>this.maxHitnum)
		{
			//Add explosion effect
			addBloom(x,y);
			score++;   
			y=windowHeight+10;
			x=999;
		}
		//Determine if the position increases naturally beyond the range or is struck and exploded
		//this.x = x>400?(int)(Math.random()*350)+40:this.x;
		//this.y = y>windowHeight?-(int)(Math.random()*200):y;
		if(x>400 || y>windowHeight)
		{   
			//restart
			this.x = (int)(Math.random()*350)+40;
			this.y = -(int)(Math.random()*200);
			this.hitnum = 0; //reset hit times
		}
		else
		{
			this.x = x;
			this.y = y;
		}
		this.MiniPlane(this.x,this.y,c);
	}

	clearEnemy()
	{
		this.y=windowHeight+10;
		this.x=999;
	}
	/*small plane shape*/
	MiniPlane(x,y,c)
	{
		fill(c);
		stroke(c);
		ellipse(x, y, 10, 30);
		ellipse(x, y-15, 20, 10);
		ellipse(x, y, 30, 10);
	}
}


/* star */
function star()
{
	let star;
	stroke(255);
	fill(255);
	star=random(7);
	ellipse(random(width),random(height),star,star);
	ellipse(random(width),random(height),star,star);
}

/* Mouse movement modifies aircraft position */
function mouseMoved()
{
	
}
/* Displays the score ,level and the amount of blood */
function showStatus() 
{
	/* score */
	fill(255);
	textSize(16);
	text("score:"+score, 5, 16);
	/* level */
	fill(255);
	textSize(16);
	text("level:"+level, 5, 32);
	/* bullet left */
	fill(255);
	textSize(16);
	text("bullet:"+bnum, 5, 48);
	/* blood */
	fill(255);
	textSize(16);
	text("blood:"+blood, 5, 64);
} 


/* Background 1 initialization */
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
/* Refresh display background*/
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

/* backgroud2 */
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