var canvas = document.getElementById("taust");	//otsetee taust elemendile
var tausta_canvas = canvas.getContext('2d');	//vaja tausta canvase muutmiseks jne...sinna tekivad tagataustad, menud jne...

var canvas2 = document.getElementById("tegelane");
var tegelase_canvas = canvas2.getContext('2d');		//vaja tegelease canvase muutmiseks (sellel liigub kangelane) 

var canvas3 = document.getElementById("zombid");
var zombid_taust= canvas3.getContext('2d');		//vaja zombide tausta muutmiseks (zombied liiguvad siin)

var canvas4 = document.getElementById("pold");
var pold_taust = canvas4.getContext('2d'); //siin on põld

var canvas5 = document.getElementById("status");
var status_taust = canvas5.getContext('2d');

status_taust.fillStyle = "black";
status_taust.fillRect(0,0,800,500);
status_taust.fillStyle = "white";
status_taust.font = "bold 30px Arial";
status_taust.fillText("Loading...",330,250);

var gameWidth = canvas.width;    // mängu laius
var gameHeight = canvas.height;	 //mängu kõrgus

var mitu_kuuli_alles;
var mitu_kuuli_saab = 8; //palju annab kuuli abi.see hakkab raunides suurenema

var v = document.getElementById("info");
var kuuli_koht = document.getElementById("kuulid");

var isPlaying = false;	//sellega saab m2ngu loopi kinni panna
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        }; 
var abicounter = 1;
var ise = new Hero(); //classi Hero uus objekt ehk siis kangelane, kes ringi liigub
var imgSprite = new Image(); //pilt
imgSprite.src = 'Pildid/sprite.png'; //pildi asukoht
imgSprite.addEventListener('load',init,false); //pildi kuular. kui laetud siis init funktsioon


var vastased = new Array(); //siia sisse tulevad zombid

var mitu_help = 3; //mitu help
var kasvoib = true;
var help = new Array(); //help arrays on abistavad asjad m2ngus (kuulid ja ehk kunagi mingi elud jne)

var wave = 1;
var mitu_zombiet = 5; //mitu zombiet arraysse panna tavalised zombied
var mitu_kiiret = 0;
var mitu_paksu = 0;
var mitu_priest = 0;

//*********Põhifunktsioonid**********//

function init(){
    clearStatusCanvas();
	joonistaMenu();
    taidaVastased(); //taidab vastaste array
	taidaHelp(); 
	document.addEventListener('click',mouseClicked,false); //lisab lehele click kuulari 
} //init sisse tuleb hiljem mängu menüü. Hetkel kuular, mis ootab mouse klikki, et tööle panne mouseClicked funktsioon
function joonistaMenu(){
	tausta_canvas.drawImage(imgSprite,0,600,800,500,0,0,800,500);
}
function clearStatusCanvas(){
	status_taust.clearRect(0,0,800,500);
}
function taidaVastased(){
    if(wave%3 == 0){
		mitu_kiiret++;
	}
	if(wave%4 == 0){
		mitu_paksu++;
	}
	if(wave%5 == 0){
		mitu_priest++;
	}
	for(var i = 0; i < mitu_zombiet;i++){
		vastased[i] = new Zombie();
	}
	for(var i = 0; i < mitu_kiiret;i++){
		vastased[vastased.length] = new Zombie2();
	}
	for(var i = 0; i < mitu_paksu;i++){
		vastased[vastased.length] = new Zombie3();
	}
	for(var i = 0; i < mitu_priest;i++){
		vastased[vastased.length] = new Zombie4();
	}
	
	
	
	
	kasvoib = true;
	
} //vastased array täitmine
function taidaHelp(){
    
	var hetkel = help.length;
	if(wave == 4){
		mitu_kuuli_saab = 15;
	}
	if(wave == 6){
	   mitu_kuuli_saab = 20;
	}
	if(wave == 8){
		mitu_kuuli_saab = 25;
	}
	if(wave == 10){
		mitu_kuuli_saab = 35;
	}
	if(wave == 14){
		mitu_kuuli_saab = 40;
	}
	if(wave == 14){
		mitu_kuuli_saab = 50;
	}
	if(wave == 16){
		mitu_kuuli_saab = 60;
	}
	if(wave == 18){
		mitu_kuuli_saab = 65;
	}
	if(wave == 20){
		mitu_kuuli_saab = 75;
	}
	if(wave == 22){
		mitu_kuuli_saab = 90;
	}
	if(wave == 24){
		mitu_kuuli_saab = 110;
	}
	
	if(wave == 1){
		for(var i = hetkel; i < mitu_help+hetkel;i++){
			help[i] = new Moon(mitu_kuuli_saab);
		}
	}
	
}
function playGame(){
	drawBg(); //joonistab tagatausta (roheline muru)
	joonP(); //joonistab väikese põlluotsa
	startLoop(); // muudab isPlaying muutuja trueks
	document.addEventListener('keydown',checkKeyDown,false); //lisab keydown 
	document.addEventListener('keyup',checkKeyUp,false);//lisab keyup kuularid
} //joonistatakse tagataust ja kutsutakse välja startLoop funktsioon, lisatakse kuularid

function drawBg(){
	var srcX = 0; //kus kohal spritel x kordinaat
	var srcY = 0; //kus kohal spritel y kordinaat
	var drawX = 800; //laius spritel
	var drawY = 500;//korgus spritel
	tausta_canvas.drawImage(imgSprite,srcX,srcY,drawX,drawY,srcX,srcY,drawX,drawY); //pildi asukoht spritel(x ja y, pikkus ja kordus) ja 
	//joonistamise asukoht(x a y, pikkus ja korgus)
}
function joonP(){
    var posX = 0;
	var posY = 0;
    for(var i = 0; i < 34; i++){
		pold_taust.drawImage(imgSprite,432,545,27,27,posX,posY,27,27);
		posX += 20;
		if(posX >=30){
			posX = 0;
			posY +=30;
		}
	}
	
}
function startLoop(){
    isPlaying = true; 
    loop(); //m2ng l2heb k2ima
	
}

function loop(){
    if(isPlaying){
      ise.draw(); //joonistab farmeri ja kuulid kui on
	  kuuli_koht.value = mitu_kuuli_alles;
	  v.value = wave;
	  drawAllHelp(); //joonistab abi asjad
	  drawAllZombies(); //joonistab zombid
	  kasVoibCheck(); //vaatab kas koik zombied on kutud 
      requestAnimFrame(loop); //kutsub uuesti loop funktsiooni
    }	
}
function kasVoibCheck(){
	if(vastased.length == 0 && kasvoib == true){  //kasvpib muutuja on vajalik, et loop() seda pidevalt ei kutsuks
		kasvoib = false; //et enam loop() siia ei pääseks
		mitu_zombiet++;
		wave++;
		taidaHelp();
		setTimeout("taidaVastased(mitu_zombiet)",5000);
		setTimeout("randomHelp()",6000);
		setTimeout("randomHelp()",9000);
		setTimeout("randomHelp()",14000);
	}
}
function randomHelp(){
    
	help[help.length] = new Moon(mitu_kuuli_saab);
}
function levelCheck(){  
	if(vastased.length == 0){
		taidaVastased(10);
	}
}
function drawAllZombies(){
	clearZombies(); //kustutab zombid_tausta
	for(var i = 0;i<vastased.length;i++){
		vastased[i].draw(); //kutsub iga zombie draw funktsiooni
	}
}
function clearZombies(){
	zombid_taust.clearRect(0,0,800,500);
}
function drawAllHelp(){
    //clearAbi();
	for(var i = 0; i < help.length;i++){
		help[i].draw();
	}
}
function stopLoop(){
    isPlaying = false;	
}
/*
function clearAbi(){
	abi_taust.clearRect(0,0,800,500);
}
*/

//*********Põhifunktsioonide lõpp*********//

//********Hero funktsioonid**********//

function Hero(){
	this.srcX = 54;
	this.srcY = 518;
	this.width = 30;
	this.height = 50;
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
	mitu_kuuli_alles = this.bullets.length;
} //hero class

Hero.prototype.draw = function(){
	clearTegelaseTaust(); //kustutab pidevalt tegelease canvast.
	this.updateCoors(); // kus asub hero (kui palju katab ta keha maad)
	this.checkDirection(); //muutab hero x ja y kordinaate, et saaks toimuda liikumine
	switch(this.vaade){ //kuhu poole hero vaatab
	    case 2: //paremale
			tegelase_canvas.drawImage(imgSprite,85,518,40,this.height,this.drawX,this.drawY,40,this.height);
			break;
		case 3: //alla
			tegelase_canvas.drawImage(imgSprite,54,518,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			break;
		case 1: //ylesse
			tegelase_canvas.drawImage(imgSprite,130,518,30,this.height,this.drawX,this.drawY,30,this.height);
			break;
		case 4: //vasakule
			tegelase_canvas.drawImage(imgSprite,6,518,40,this.height,this.drawX,this.drawY,40,this.height);
			break;
	}
	this.kustutamisele(); //vaatab koik kuulid läbi ja kustutab need mis on välja lastud ja märgitud kustutamisele
	this.checkShooting(); //kui space on vajutatud vaatab kuulide mas ja kui leiab vaja kuuli muutab kuuli x kordinaati.
	this.drawAllBullets(); //vaatab koik kuulid l2bi ja need millel on x kordinaat suurem kui 0 neid hakkab joonistama.	
	this.checkHelp(); //vaatab kas saadi help paketile pihta
};
Hero.prototype.checkHelp = function(){
	for(var i = 0; i < help.length;i++){
	   
	   if(help[i].drawX >= this.drawX &&
		  help[i].drawX <= this.drawX + this.width && 
		  help[i].drawY >= this.drawY && 
		  help[i].drawY <= this.drawY + this.height){
		    var a = document.getElementById("info");
			//a.value = "Pihtsa";
			var mitu = help[i].mituk;
			while(mitu >0){
				ise.bullets.push(new Bullet()); //lisab kuuli
				mitu--;
			}
			mitu_kuuli_alles += help[i].mituk;
			
			help.splice(i,1); //võtab abipaketi 2ra
		}
	}
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
}; //toimub hero x ja y kordinaadi muutmine
Hero.prototype.kustutamisele = function(){
	for(var i = 0; i < this.bullets.length;i++){
		if(this.bullets[i].kustutamisele === true){
			this.bullets.splice(i,1); //eemaldab kuuli salvest =) kui on m22ratud kustutamisele
		}
	}
};
Hero.prototype.checkShooting = function(){
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		for(var i =0; i <this.bullets.length;i++){	
			if(this.bullets[i].kasutuses === false){
			   mitu_kuuli_alles--;
			   this.bullets[i].suund = this.vaade; //m22rab kuuli suuna kuhu lendab
			   if(this.bullets[i].suund == 1){ //suund ylesse
				 this.noseX = this.drawX + 15;
				 this.noseY = this.drawY - 10;
			   }else if(this.bullets[i].suund == 2){ //suund paremale
			     this.noseX = this.drawX + 32;
				 this.noseY = this.drawY + 22;
			   }else if(this.bullets[i].suund == 3){ //suund alla
				 this.noseX = this.drawX + 8;
				 this.noseY = this.drawY + 45;
			   }else if(this.bullets[i].suund == 4){ //suund vasakule
			     this.noseX = this.drawX;
				 this.noseY = this.drawY + 22;
			   }
			   this.bullets[i].fire(this.noseX, this.noseY); //paneb kuuli pyssitoru juurde
			   return;
			}
		}		
	}else if(!this.isSpacebar){
		this.isShooting = false;
	}
};
Hero.prototype.drawAllBullets = function(){
	for(var i = 0; i<this.bullets.length;i++){
		if(this.bullets[i].drawX >=0){ //koik kuulid mille x kordinaat on suurem kui 0 lastakse v2lja
			this.bullets[i].draw();//laskmine
		}	
	}
};

//*******Hero funktsioonide lõpp


//****kuuli funktsioonid**********//

function Bullet(j){ 
	this.hero = j;
	this.srcX = 8;
	this.srcY = 576;
	this.drawX = -20; //algselt on kuuli x kordinaat -20px
	this.drawY = 0;
	this.width = 8;
	this.height = 8;
	this.kasutuses = false;
	this.kustutamisele = false;
	this.suund = 2;
	this.damage = 10;
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
	this.kasPihtas(); //kas sai zombile pihta
	if(this.drawX > gameWidth || this.drawY < 0 || this.drawY > gameHeight || this.drawX < 0){
	    
	    //this.delete;
		this.kustuta();
	}
};

Bullet.prototype.kasPihtas = function(){
	for(var i =0; i < vastased.length;i++){
			if(this.drawX >= vastased[i].drawX && 
			   this.drawX <=vastased[i].drawX + vastased[i].width &&
			   this.drawY >=vastased[i].drawY &&
			   this.drawY <=vastased[i].drawY + vastased[i].height && vastased[i].kasHaavatav == true){
			     vastased[i].elud -= this.damage; //v6tab zombilt elusid
				 this.kustutamisele = true; //kustutab kuuli
				 if(vastased[i].elud <=0){ //kui zombil on elus <=0
					vastased.splice(i,1); //kustutab selel zombie vastaste arrayst
				 }			 
			}
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

//*****reload funktsioonid*******//

function Moon(mitu_kuuli_annab){
    //var randomnumber=Math.floor(Math.random()*11)
	this.srcX = 24;
	this.srcY = 582;
	this.drawX = Math.floor(Math.random()*600);
	this.drawY = Math.floor(Math.random()*500);
	this.width = 22;
	this.height = 10;
	this.mituk = mitu_kuuli_annab;
}
Moon.prototype.draw = function(){
	tegelase_canvas.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};


//*****end of reload funktsioonid*****//
//*****Zombie funktsioonid*******//
function Zombie(){ //tavaline zombie
    this.drawX = Math.floor(Math.random()*300+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
	}
	this.srcX = 295;
	this.srcY = 518;
	this.width = 40;
	this.height = 60;
	this.speed = 0.5;
	this.elud = 30;
	this.kasHaavatav = true;
}
Zombie.prototype.draw = function(){
	this.drawX -= this.speed;
	zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	if(this.drawX <=30){
		isPlaying = false;
	}
};
function Zombie2(){ //kiire zombie
	this.drawX = Math.floor(Math.random()*300+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
	}
	this.srcX = 237;
	this.srcY = 518;
	this.width = 50;
	this.height = 60;
	this.speed = 0.7;
	this.elud = 20;
	this.kasHaavatav = true;
}
Zombie2.prototype.draw = function(){
	this.drawX -= this.speed;
	zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	if(this.drawX <=30){
		isPlaying = false;
	}
};
function Zombie3(){ //paks zombie

	this.drawX = Math.floor(Math.random()*300+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=70;
	}
	this.srcX = 171;
	this.srcY = 518;
	this.width = 50;
	this.height = 80;
	this.speed = 0.4;
	this.elud = 80;
	this.kasHaavatav = true;
}
Zombie3.prototype.draw = function(){
	this.drawX -= this.speed;
	zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	if(this.drawX <=30){
		isPlaying = false;
	}
};
function Zombie4(){ //priest zombie
    this.drawX = Math.floor(Math.random()*300+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
	}
	this.srcX = 460;
	this.srcY = 524;
	this.width = 38;
	this.height = 60;
	this.speed = 0.5;
	this.elud = 100;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie4.prototype.draw = function(){
    
	if(this.elud <=50 && this.kontroll == false){
		this.reborn = true;
	}
	if(this.reborn == false){
		this.drawX -= this.speed;
		zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	}else{
		zombid_taust.drawImage(imgSprite,518,528,26,40,this.drawX,this.drawY+15,26,40);
		this.kasHaavatav = false;
		if(this.kasSees == false){
		    var kutsumine = this.uuenda;
			var self = this;
			this.kasSees = true;
			//setTimeout(kutsumine,6000,self);	//exploreri peal ei töödanud
			  setTimeout(function(){
				kutsumine(self);
			  },6000);	
		}
		
	}
	
	if(this.drawX <=30){
		isPlaying = false;
	}
};
Zombie4.prototype.uuenda = function(self){
	self.kontroll = true;
    self.reborn = false;
    self.kasHaavatav = true;
};
/*
function uuenda(zom){
  alert(zom);
  zom.kontroll = true;
  zom.reborn = false;
  zom.kasHaavatav = true;
}
*/

//*****Zombie funktsioonide lopp******//

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



