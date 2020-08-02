var canvas = document.getElementById("taust");	//otsetee taust elemendile
var tausta_canvas = canvas.getContext('2d');	//vaja tausta canvase muutmiseks jne...

var canvas2 = document.getElementById("tegelane");
var tegelase_canvas = canvas2.getContext('2d');		//vaja tegelease canvase muutmiseks (sellel liigub kangelane)

var canvas3 = document.getElementById("zombid");
var zombid_taust= canvas3.getContext('2d');		//vaja zombide tausta muutmiseks (zombied liiguvad siin)

var gameWidth = canvas.width;    // mängu laius
var gameHeight = canvas.height;	 //mängu kõrgus



var isPlaying = false;	
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        }; 

var ise = new Hero(); //classi Hero uus objekt ehk siis kangelane, kes ringi liigub
var imgSprite = new Image(); //pilt
imgSprite.src = 'Pildid/sprite.png'; //pildi asukoht
imgSprite.addEventListener('load',init,false); //pildi kuular. kui laetud siis init funktsioon



//*********Põhifunktsioonid**********//

function init(){
	document.addEventListener('click',mouseClicked,false);
	
	 
} //init sisse tuleb hiljem mängu menüü. Hetkel kuular, mis ootab mouse klikki, et tööle panne mouseClicked funktsioon


function playGame(){
	drawBg();
	startLoop();
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);
} //joonistatakse tagataust ja kutsutakse välja startLoop funktsioon, lisatakse kuularid

function drawBg(){
	var srcX = 0;
	var srcY = 0;
	var drawX = 800;
	var drawY = 500;
	tausta_canvas.drawImage(imgSprite,srcX,srcY,drawX,drawY,srcX,srcY,drawX,drawY); //pildi asukoht spritel(x ja y, pikkus ja kordus) ja 
	//joonistamise asukoht(x a y, pikkus ja korgus)
}
function startLoop(){
    isPlaying = true; 
    loop();
	
}
function loop(){
    if(isPlaying){
      ise.draw();
      requestAnimFrame(loop);  
    }	
}//põhi funktsioon, mis joonistab kangelast

function stopLoop(){
    isPlaying = false;	
}

//*********Põhifunktsioonide lõpp*********//

//********Hero funktsioonid**********//

function Hero(){
	this.srcX = 6;
	this.srcY = 516;
	this.width = 30;
	this.height = 32;
	this.speed = 2;
	this.drawX = 200;
	this.drawY = 200;
	this.leftX = this.drawX; 
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.vaade = 3;
	this.noseX = this.drawX + 30;
	this.noseY = this.drawY + 15;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;	
	this.isSpacebar = false;
	this.isShooting = false;
	this.bullets = [];
	this.currentBullet = 0;
	for(var i = 0; i < 5; i++){
		this.bullets[this.bullets.length] = new Bullet(this);	
	}
} //hero class

Hero.prototype.draw = function(){
	clearTegelaseTaust(); //kustutab pidevalt tegelease canvast.
	this.updateCoors(); // kus asub hero (kui palju katab ta keha maad)
	this.checkDirection(); //muutab hero x ja y kordinaate, et saaks toimuda liikumine
	switch(this.vaade){ //kuhu poole hero vaatab
	    case 2: //paremale
			tegelase_canvas.drawImage(imgSprite,6,581,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			break;
		case 3: //alla
			tegelase_canvas.drawImage(imgSprite,6,516,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			break;
		case 1: //ylesse
			tegelase_canvas.drawImage(imgSprite,6,613,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			break;
		case 4: //vasakule
			tegelase_canvas.drawImage(imgSprite,6,549,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			break;
	}
	this.kustutamisele(); //vaatab koik kuulid läbi ja kustutab need mis on välja lastud ja märgitud kustutamisele
	this.checkShooting(); //kui space on vajutatud vaatab kuulide mas ja kui leiab vaja kuuli muutab kuuli x kordinaati.
	this.drawAllBullets(); //vaatab koik kuulid l2bi ja need millel on x kordinaat suurem kui 0 neid hakkab joonistama.	
};
Hero.prototype.updateCoors = function(){
    this.noseX = this.drawX + 30; //kust kohast kuul v2lja saata
	this.noseY = this.drawY + 15;
	this.leftX = this.drawX; 
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
}; //
function clearTegelaseTaust(){
	tegelase_canvas.clearRect(0,0,800,500);
}
Hero.prototype.checkDirection = function(){
	if(this.isUpKey && this.topY > 0){   
		this.drawY -= this.speed;
	}
	if(this.isRightKey && this.rightX < gameWidth){  
		this.drawX += this.speed;
	}
	if(this.isDownKey && this.bottomY < gameHeight){
		this.drawY += this.speed;
	}
	if(this.isLeftKey && this.leftX > 0){
		this.drawX -= this.speed;
	}
};
Hero.prototype.kustutamisele = function(){
	for(var i = 0; i < this.bullets.length;i++){
		if(this.bullets[i].kustutamisele === true){
			this.bullets.splice(i,1);
		}
	}
};
Hero.prototype.checkShooting = function(){
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		for(var i =0; i <this.bullets.length;i++){	
			if(this.bullets[i].kasutuses === false){
			   this.bullets[i].suund = this.vaade;
			   if(this.bullets[i].suund == 1){
				 this.noseX = this.drawX + 15;
				 this.noseY = this.drawY - 10;
			   }else if(this.bullets[i].suund == 3){
				 this.noseX = this.drawX + 15;
				 this.noseY = this.drawY + 20;
			   }else if(this.bullets[i].suund == 4){
			     this.noseX = this.drawX;
				 this.noseY = this.drawY + 15;
			   }
			   this.bullets[i].fire(this.noseX, this.noseY);
			   return;
			}
			
		}
		/*
		if(this.currentBullet < this.bullets.length){
			this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
			this.currentBullet++;
		}
		/*
		/*
		if(this.currentBullet >= this.bullets.length){
			this.currentBullet = 0;
		}
		*/
	}else if(!this.isSpacebar){
		this.isShooting = false;
	}
};
Hero.prototype.drawAllBullets = function(){
	for(var i = 0; i<this.bullets.length;i++){
		if(this.bullets[i].drawX >=0){ 
			this.bullets[i].draw();	
		}	
	}
};

//*******Hero funktsioonide lõpp


//****kuuli funktsioonid**********//

function Bullet(j){ 
	this.hero = j;
	this.srcX = 15;
	this.srcY = 654;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 10;
	this.height = 10;
	this.kasutuses = false;
	this.kustutamisele = false;
	this.suund = 2;
}
Bullet.prototype.draw = function(){
    if(this.suund == 2){ //kui kuul on suunaga paremale, siis liidan x kordinaadile +=5
		this.drawX += 5;
	}else if(this.suund == 1){ //kui aga ylesse
		this.drawY -= 5;
	}else if(this.suund == 3){ //kui aga alla
	    this.drawY += 5;
	}else{  //ei jää midaig muud üle kui vasakule
		this.drawX -= 5;
	}
	
	tegelase_canvas.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	if(this.drawX > gameWidth || this.drawY < 0 || this.drawY > gameHeight || this.drawX < 0){
	    
	    //this.delete;
		this.kustuta();
	}
};
Bullet.prototype.kustuta = function(){ //lisab kuulile kustutamise märgi
	this.drawX = -20;
	this.kustutamisele = true;
};
Bullet.prototype.fire= function(startX, startY){
	this.drawX = startX; 
	this.drawY = startY;
	this.kasutuses = true;
};
//****kuuli funktsioonide lopp******//




//*********Event funktsioonid**********//

function mouseClicked(e){
    document.removeEventListener("click",mouseClicked,false);  
	playGame();
}



function checkKeyDown(e){
  var keyID = e.keyCode || e.which; //(e.keyCode) ? e.keyCode : e.which
  if(keyID === 38 || keyID === 87){ // 38 means upp arrow and 87 means w key
    ise.vaade = 1;
	ise.isUpKey = true;
	e.preventDefault();
  }
  if(keyID === 39 || keyID === 68){ // 38 means right arrow and 87 means d key
    ise.vaade = 2;
    ise.isRightKey = true;
	e.preventDefault();
  }
  if(keyID === 40 || keyID === 83){ // 38 means down arrow and 87 means s key
    ise.vaade = 3;
    ise.isDownKey = true;
	e.preventDefault();
  }
  if(keyID === 37 || keyID === 65){ // 38 means left arrow and 87 means a key
    ise.vaade = 4;
    ise.isLeftKey = true;
	ise.bullets.push(new Bullet());
	e.preventDefault();
  }
  if(keyID === 32){ // 32 space
    ise.isSpacebar = true;
	e.preventDefault();
  }
}
function checkKeyUp(e){
  var keyID = e.keyCode || e.which;
  if(keyID === 38 || keyID === 87){ // 38 means upp arrow and 87 means w key
	ise.isUpKey = false;
	e.preventDefault();
  }
  if(keyID === 39 || keyID === 68){ // 38 means right arrow and 87 means d key
	ise.isRightKey = false;
	e.preventDefault();
  }
  if(keyID === 40 || keyID === 83){ // 38 means down arrow and 87 means s key
    ise.isDownKey = false;
	e.preventDefault();
  }
  if(keyID === 37 || keyID === 65){ // 38 means left arrow and 87 means a key
    ise.isLeftKey = false;
	e.preventDefault();
  }
  if(keyID === 32){ // 32 space
    ise.isSpacebar = false;
	e.preventDefault();
  }
}



