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
			tegelase_canvas.drawImage(imgSprite,54,518,30,this.height,this.drawX,this.drawY,30,this.height);
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
var kord = 1;
Hero.prototype.checkHelp = function(){
	for(var i = 0; i < help.length;i++){
	   if(help[i].drawX >= this.drawX &&
		  help[i].drawX <= this.drawX + this.width && 
		  help[i].drawY >= this.drawY && 
		  help[i].drawY <= this.drawY + this.height){
		    var xkor = help[i].drawX;
			var ykor = help[i].drawY;
			var mitu1 = help[i].mituk;
			if(kord == 1){
				reloadSound1.play();
				kord++;
			}else{
			   reloadSound2.play();
			   kord--;
			}
			
		    tekstid[tekstid.length] = new Tekst(xkor,ykor,mitu1);
			var mitu = help[i].mituk;
			 
			
			while(mitu >0){
				ise.bullets.push(new Bullet()); //lisab kuuli
				mitu--;
			}
			mitu_kuuli_alles += help[i].mituk;		
			help.splice(i,1); //võtab abipaketi 2ra
			var alpha = 0;		
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
				    kill++;
					vastased.splice(i,1); //kustutab selel zombie vastaste arrayst
				 }			 
			}
	}
};

Bullet.prototype.kustuta = function(){ //lisab kuulile kustutamise märgi
	this.drawX = -20;
	this.kustutamisele = true;
};
var gunSoundNumber = 1;
Bullet.prototype.fire= function(startX, startY){
	if(gunSoundNumber == 1){
		gun1.play();
	}
	if(gunSoundNumber == 2){
		gun2.play();
	}
	if(gunSoundNumber == 3){
		gun3.play();
	}
	if(gunSoundNumber == 4){
		gun4.play();
	}
	if(gunSoundNumber == 5){
		gun5.play();
	}
	gunSoundNumber++;
	if(gunSoundNumber >5){
		gunSoundNumber = 1;
	}
	this.drawX = startX; 
	this.drawY = startY;
	this.kasutuses = true;
};
function Moon(mitu_kuuli_annab){
    //var randomnumber=Math.floor(Math.random()*11)
	this.width = 22;
	this.height = 10;
	this.srcX = 24;
	this.srcY = 582;
	this.drawX = Math.floor(Math.random()*600);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >= gameHeight - this.height){
		this.drawY -= this.height;
	}
	this.mituk = mitu_kuuli_annab;
}
Moon.prototype.draw = function(){
	tegelase_canvas.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};
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
		setTimeout("gameOver()",2000);
		//gameOver();
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
		setTimeout("gameOver()",2000);
		//gameOver();
	}
};
function Zombie3(){ //paks zombie

	this.drawX = Math.floor(Math.random()*300+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >420){
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
		setTimeout("gameOver()",2000);
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
		//gameOver();
		setTimeout("gameOver()",2000);
	}
};
Zombie4.prototype.uuenda = function(self){
	self.kontroll = true;
    self.reborn = false;
    self.kasHaavatav = true;
};
function Tekst(x,y,m){
	this.xkor = x;
	this.ykor = y;
	this.mitu = m;
	this.alpha = 0;
	this.kustutamisele = false;
	this.fadein = true;
	//this.fadeout = false;
}
Tekst.prototype.draw = function(){
	status_taust.clearRect(this.xkor,this.ykor-22,25,15);
	status_taust.fillStyle = "rgba(0,0,0," + this.alpha + ")";
	//status_taust.strokeStyle = "rgba(0,0,0," + this.alpha + ")";
	status_taust.font = "bold 15px Arial";
	status_taust.fillText("+"+this.mitu,this.xkor,this.ykor-10);
	//status_taust.strokeText("+"+this.mitu,this.xkor,this.ykor-10);
	if(this.fadein === true){
		this.alpha += 0.04;
	}else{
	   this.alpha -= 0.04;
	   if(this.alpha <= 0){
		  this.kustutamisele = true;
	   }
	}
	if(this.alpha >= 1){
		this.fadein = false;
	}
	
}