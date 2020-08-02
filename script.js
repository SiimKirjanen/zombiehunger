var canvas = document.getElementById("taust");	//otsetee taust elemendile
var tausta_canvas = canvas.getContext('2d');	//vaja tausta canvase muutmiseks jne...sinna tekivad tagataustad, menud jne...

var canvas2 = document.getElementById("tegelane");
var tegelase_canvas = canvas2.getContext('2d');		//vaja tegelease canvase muutmiseks (sellel liigub kangelane) 

var canvas3 = document.getElementById("zombid");
var zombid_taust= canvas3.getContext('2d');		//vaja zombide tausta muutmiseks (zombied liiguvad siin)

var canvas4 = document.getElementById("pold");
var pold_taust = canvas4.getContext('2d'); //siin on p6ld

var canvas5 = document.getElementById("status");
var status_taust = canvas5.getContext('2d');

var canvas6 = document.getElementById("info");
var info_taust = canvas6.getContext('2d');

var kasNaidatud = false;
status_taust.fillStyle = "black";
status_taust.fillRect(0,0,800,550);
status_taust.fillStyle = "white";
status_taust.font = "bold 30px Arial";
status_taust.fillText("Loading...",330,250);

var gun1 = new Audio("Sounds/gunfire.ogg");
var gun2 = new Audio("Sounds/gunfire.ogg");
var gun3 = new Audio("Sounds/gunfire.ogg");
var gun4 = new Audio("Sounds/gunfire.ogg");
var gun5 = new Audio("Sounds/gunfire.ogg");

var reloadSound1 = new Audio("Sounds/reload.ogg");

var menu_snd = new Audio("Sounds/menu1.ogg");
var music = new Audio("Sounds/music.ogg");
music.loop = true;

var music2 = new Audio("Sounds/music2.ogg");
music2.loop = true;

gun1.addEventListener('canplaythrough',loadKontroll,false);
gun2.addEventListener('canplaythrough',loadKontroll,false);
gun3.addEventListener('canplaythrough',loadKontroll,false);
gun4.addEventListener('canplaythrough',loadKontroll,false);
gun5.addEventListener('canplaythrough',loadKontroll,false);

reloadSound1.addEventListener('canplaythrough',loadKontroll,false);
menu_snd.addEventListener('canplaythrough',loadKontroll,false);
music.addEventListener('canplaythrough',loadKontroll,false);

var touchable = 'createTouch' in document;

var gameWidth = canvas.width;    // m�ngu laius
var gameHeight = canvas.height;	 //m�ngu k�rgus

var mitu_kuuli_alles;
var mitu_kuuli_saab = 8; //palju annab kuuli abi.see hakkab raunides suurenema                   KUULIDE ARV ESIALKSELT!!!

var kill = 0;

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
var ise = new Hero(); 
var imgSprite = new Image(); 
imgSprite.src = 'Pildid/sprite.png';
imgSprite.addEventListener('load',loadKontroll,false);

var toimus_asukoha_muutus = false;
var hiirekursorX;
var hiirekursorY; 
var vastased = new Array(); //siia sisse tulevad zombid



var mitu_help = 3; //mitu help
var kasvoib = true;
var help = new Array(); //help arrays on abistavad asjad m2ngus (kuulid ja ehk kunagi mingi elud jne)
var wave = 1;
var mitu_zombiet = 5; //mitu zombiet arraysse panna tavalised zombied
var mitu_kiiret = 0;
var mitu_paksu = 0;
var mitu_priest = 0;
var mitu_soldier = 0;
var mitu_behemoth = 0;
var mitu_orc = 0;
var mitu_bossi = 0;
var mitu_death = 0;
var tekstid = new Array();
//*********P�hifunktsioonid**********//

var kontrollSumma = 0;


function loadKontroll(){
	kontrollSumma++;
	if(kontrollSumma == 9){
		assetsLoaded();
	}
}


function gameOver(){
    music.pause();
	music2.pause();
    info_taust.clearRect(0,0,800,600);
    if(toimus_asukoha_muutus){
		document.removeEventListener("onmousemove",hiirelohistus,false);
		document.removeEventListener("onmousedown",muudaspace,false);
		document.removeEventListener("onmouseup",muudaspace2,false);
	}
	canvas6.setAttribute('id','vahetuseks');
    var alpha = 0;
	var interval = setInterval(function(){
		status_taust.fillStyle = "rgba(0, 0, 0," + alpha + ")";
		status_taust.fillRect(0,0,800,550);
		status_taust.fillStyle = "rgba(250,0,0," + alpha + ")";
		//status_taust.strokeStyle = "rgba(255,255,0" +alpha + ")";
		status_taust.font = "bold 70px Arial";
		status_taust.fillText("GAME OVER",190,280);
		//status_taust.strokeText("GAME OVER",200,250);
		alpha += 0.02;
		if(alpha >= 1){
			clearInterval(interval);
			kutsuteine();
		}
	},50);
		setTimeout(function(){
			document.addEventListener("click",uuesti,false);
			document.addEventListener("keydown",uuesti,false);
		},3000);
	}
function uuesti(){
	window.location.reload();
}
function kutsuteine(){
    var alpha2 = 0;
	var interval2 = setInterval(function(){
		status_taust.fillStyle = "rgba(250,250,250," + alpha2 + ")";
		status_taust.font = "bold 30px Arial";
		status_taust.fillText("TRY AGAIN?",320,330);
		alpha2 += 0.04;
		if(alpha2 >= 1){
			clearInterval(interval2);
		}
	},50);
}
function assetsLoaded(){
	clearStatusCanvas();
	status_taust.fillStyle = "black";
	status_taust.fillRect(0,0,800,550);
	status_taust.fillStyle = "white";
	status_taust.font = "bold 30px Arial";
	status_taust.fillText("Press any key to continue",220,250);
	
	document.addEventListener('keydown', assetsLoadedClickHandler, false);
}

function assetsLoadedClickHandler() {
	document.removeEventListener("click", assetsLoadedClickHandler,false);
	init();
}

function init() {
	menu_snd.play();
	joonistaMenu();
    taidaVastased(); //taidab vastaste array
	taidaHelp(); 
	document.addEventListener('click',mouseClicked,false); //lisab lehele click kuulari
    document.addEventListener('keydown',valitudKeyboard,false); //lisab lehele keydown kuulari, ehk kui valitud hiirega m�ngimine	
}

function joonistaMenu(){
	status_taust.drawImage(imgSprite,0,600,800,500,0,20,800,500);
}
function clearStatusCanvas(){
	status_taust.clearRect(0,0,800,500);
}
function taidaVastased(){
	if(wave%2 == 0){
		mitu_zombiet++;
	}
    if(wave%3 == 0){
		mitu_kiiret++;
	}
	if(wave%4 == 0){
		mitu_paksu++;
	}
	if(wave%5 == 0){
		mitu_priest++;
	}	
	if(wave%6 == 0){
		mitu_soldier++;
	}
	if(wave%7 == 0){
		mitu_behemoth++;
	}	
	if(wave%8 == 0){
		mitu_orc++;
	}	
	if(wave%11 == 0){
		mitu_death++;
	}
	if(wave%10 == 0){
		mitu_bossi=1;
	}
	if(wave%11 == 0){
		mitu_bossi=0;
	}	
	if(wave%21 == 0){
		mitu_bossi=0;
	
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
	
	for(var i = 0; i < mitu_bossi;i++){
		vastased[vastased.length] = new Zombie5();
	}
	for(var i = 0; i < mitu_soldier;i++){
		vastased[vastased.length] = new Zombie6();
	}
	for(var i = 0; i < mitu_behemoth;i++){
		vastased[vastased.length] = new Zombie7();
	}
	for(var i = 0; i < mitu_orc;i++){
		vastased[vastased.length] = new Zombie8();	
	}
	for(var i = 0; i < mitu_death;i++){
		vastased[vastased.length] = new Zombie9();	
	}
	kasvoib = true;	
} //vastased array t�itmine
function taidaHelp(){
	var hetkel = help.length;
	if(wave == 4){
		mitu_kuuli_saab = 12;
	}
	if(wave == 5){
		mitu_kuuli_saab = 18;
	}	
	if(wave == 6){
	   mitu_kuuli_saab = 25;
	}
	if(wave == 7){
	   mitu_kuuli_saab = 35;
	}   
	if(wave == 8){
		mitu_kuuli_saab = 45;
	}
	if(wave == 10){
	
		mitu_kuuli_saab = 90;
	}
	
	if(wave == 11){
	
		mitu_kuuli_saab = 58;
	}	
	if(wave == 12){
	
		mitu_kuuli_saab = 75;	
	}	
	if(wave == 14){
		mitu_kuuli_saab = 90;
	}
	if(wave == 15){
		mitu_kuuli_saab = 115;
	}
	if(wave == 16){
		mitu_kuuli_saab = 160;
	}
	if(wave == 18){
		mitu_kuuli_saab = 200;
	}
	if(wave == 20){
		mitu_kuuli_saab = 350;
	}
	if(wave == 22){
		mitu_kuuli_saab = 500;
	}
	if(wave == 24){
		mitu_kuuli_saab = 900;
	}
	
	if(wave == 1){
		for(var i = hetkel; i < mitu_help+hetkel;i++){
			help[i] = new Moon(mitu_kuuli_saab);
		}
	}
}
function playGame(){
    menu_snd.pause();
    clearStatusCanvas();
	drawBg(); //joonistab tagatausta 
	joonP(); //joonistab v�ikese p�lluotsa
	music.play();
	startLoop(); // muudab isPlaying muutuja trueks
} //joonistatakse tagataust ja kutsutakse v�lja startLoop funktsioon, lisatakse kuularid
function hiirelohistus(e){
	hiirekursorX = e.pageX - canvas6.offsetLeft;
	hiirekursorY = e.pageY - canvas6.offsetTop;
	if(hiirekursorX > ise.drawX + ise.width){
		ise.vaade = 2;
		ise.width = 40;
		ise.noseX = ise.drawX + 25;
		ise.noseY = ise.drawY + 22;
        toimus_asukoha_muutus = true;		
	}
	if(hiirekursorX < ise.drawX){  
		ise.vaade = 4;
		ise.width = 40;
		ise.noseX = ise.drawX;
		ise.noseY = ise.drawY + 22;
        toimus_asukoha_muutus = true;		
	}
	if(hiirekursorY > ise.drawY + ise.height){	
		ise.vaade = 3;	
		ise.width = 30;
		ise.noseX = ise.drawX + 8;
		ise.noseY = ise.drawY + 45;
		toimus_asukoha_muutus = true;
	}
	if(hiirekursorY < ise.drawY){
		ise.vaade = 1;
		ise.width = 30;
		ise.noseX = ise.drawX + 15;
		ise.noseY = ise.drawY - 10;
		toimus_asukoha_muutus = true;
	}	
}
function drawBg(){
    canvas6.setAttribute('id','piirjoon');
	var srcX = 0; //kus kohal spritel x kordinaat
	var srcY = 0; //kus kohal spritel y kordinaat
	var drawX = 800; //laius spritel
	var drawY = 500;//korgus spritel
	tausta_canvas.drawImage(imgSprite,srcX,srcY,drawX,drawY,srcX,srcY,drawX,drawY); //pildi asukoht spritel(x ja y, pikkus ja kordus) ja 
	//joonistamise asukoht(x a y, pikkus ja korgus)
	info_taust.fillRect(0,500,800,100);
	info_taust.beginPath();
	info_taust.moveTo(0,500);
	info_taust.lineTo(800,500);
	info_taust.lineWidth = 2;
	info_taust.strokeStyle = "rgb(255,165,0)";
	info_taust.stroke();
	info_taust.drawImage(imgSprite,6,1139,70,35,15,530,70,35); //joonistab kuulikarbi alla
	info_taust.drawImage(imgSprite,112,1130,38,46,230,525,38,46); //joonistab kollase noole
	info_taust.drawImage(imgSprite,221,1130,44,46,390,525,44,46); //joonistab zombies left
	info_taust.drawImage(imgSprite,174,1130,37,46,600,525,37,46); //joonistab kill count
	
	
	 //info_taust.drawImage(imgSprite,6,1139,35,70,6,510,35,70);
	//info_taust.drawImage(imgSprite,173,520,35,70,6,510,35,70);
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
function loop(){ // k6ige t2htsam
    if(isPlaying){
	  if(kasNaidatud == false){
		leveliNaitamine();
	 }
	  if(toimus_asukoha_muutus === true){
		positsioonile();
	  }
      ise.draw(); //joonistab farmeri ja kuulid kui on
	  kuuliPluss();
	  drawMenuLisad();
	  drawAllHelp(); //joonistab abi asjad
	  drawAllZombies(); //joonistab zombid
	  kasVoibCheck(); //vaatab kas koik zombied on kutud 
      requestAnimFrame(loop); //kutsub uuesti loop funktsiooni
	
    }	
}
function drawMenuLisad(){
    info_taust.fillStyle = "black";
    info_taust.fillRect(90,510,80,80);
	info_taust.fillStyle = "rgb(255,255,255)";
	info_taust.font = "bold 30px Arial";
	info_taust.fillText(mitu_kuuli_alles,100,558);
	info_taust.fillStyle = "black";
    info_taust.fillRect(282,510,80,80);
	info_taust.fillStyle = "rgb(255,255,255)";
	info_taust.font = "bold 30px Arial";
	info_taust.fillStyle = "white";
	info_taust.fillText(wave,282,558);
	var mitu_left = vastased.length;
	info_taust.fillStyle = "black";
    info_taust.fillRect(444,510,80,80);
	info_taust.fillStyle = "rgb(255,255,255)";
	info_taust.font = "bold 30px Arial";
	info_taust.fillText(mitu_left,450,558);
	
	info_taust.fillStyle = "black";
    info_taust.fillRect(656,510,120,80);
	info_taust.fillStyle = "rgb(255,255,255)";
	info_taust.font = "bold 30px Arial";
	info_taust.fillText(kill,656,558);
	
}
function kuuliPluss(){
	for(var i = 0; i < tekstid.length;i++){
		tekstid[i].draw();
		if(tekstid[i].kustutamisele == true){
			status_taust.clearRect(tekstid[i].xkor,tekstid[i].ykor-22,25,15);
			tekstid.splice(i,1);
		}
	}
}
function leveliNaitamine(){
        kasNaidatud = true; 
        var alpha = 0;	
	    var interval = setInterval(function(){
		status_taust.clearRect(300,150,300,200);
		status_taust.fillStyle = "rgba(200,0,0," + alpha + ")";
	    status_taust.strokeStyle = "rgba(0,0,0," + alpha + ")";
		status_taust.font = "bold 60px Arial";
		status_taust.fillText("Wave "+wave,305,260);
		status_taust.strokeText("Wave "+wave,305,260);	
		alpha += 0.02;
		if(alpha >= 1){
			clearInterval(interval);
			setTimeout("kustutastats()",2000);
		}
	},50);
}
function kustutastats(){
	var alpha2 = 1;
	var interval2 = setInterval(function(){
	            status_taust.clearRect(300,150,300,200);
				status_taust.fillStyle = "rgba(200,0,0," + alpha2 + ")";
				status_taust.strokeStyle = "rgba(0,0,0," + alpha2 + ")";
				status_taust.font = "bold 60px Arial";
				status_taust.fillText("Wave "+wave,305,260);
				status_taust.strokeText("Wave "+wave,305,260);
				alpha2 -= 0.02;	
					if(alpha2 <= 0){
						clearInterval(interval2);
						status_taust.clearRect(300,200,300,200);
					}	
            },50);			
}
function positsioonile(){
		if(hiirekursorX > ise.drawX + ise.width){
                if(ise.drawX < gameWidth - ise.width){
					ise.drawX+=2;
				}				
		}	
		if(hiirekursorX < ise.drawX){  
			ise.drawX-=2;
		}	
		if(hiirekursorY > ise.drawY + ise.height){ 
			if(ise.drawY + ise.height <= gameHeight){
				ise.drawY+=2;
			}	
		}
		if(hiirekursorY < ise.drawY){  
			ise.drawY-=2;
		}
}
function kasVoibCheck(){
	if(vastased.length == 0 && kasvoib == true){  //kasvpib muutuja on vajalik, et loop() seda pidevalt ei kutsuks
		kasvoib = false; //et enam loop() siia ei p��seks
		mitu_zombiet++;
		wave++;
		var random1 = Math.floor(Math.random()*15000 + 5000);
		var random2 = Math.floor(Math.random()*15000 + 5000);
		var random3 = Math.floor(Math.random()*15000 + 5000);
		taidaHelp();
		setTimeout("taidaVastased(mitu_zombiet)",5000);
		kasNaidatud = false;
		setTimeout("randomHelp()",random1);
		setTimeout("randomHelp()",random2);
		setTimeout("randomHelp()",random3);
		setTimeout("randomClock()",random1);
	}
}
function randomClock(){
}
function randomHelp(){
    
	help[help.length] = new Moon(mitu_kuuli_saab);
}
function levelCheck(){  
	if(vastased.length == 0){
		taidaVastased(10);
	}
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
//*********P�hifunktsioonide l�pp*********//

//********Hero funktsioonid**********//

function Hero(){
	this.srcX = 54;
	this.srcY = 518;
	this.width = 30;
	this.height = 50;
	this.speed = 2;  //jooksmis kiirus
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
	this.kustutamisele(); //vaatab koik kuulid l�bi ja kustutab need mis on v�lja lastud ja m�rgitud kustutamisele
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
	
			reloadSound1.play();
		    tekstid[tekstid.length] = new Tekst(xkor,ykor,mitu1);
			var mitu = help[i].mituk;
			
			while(mitu >0){
				ise.bullets.push(new Bullet()); //lisab kuuli
				mitu--;
			}
			mitu_kuuli_alles += help[i].mituk;		
			help.splice(i,1); //v�tab abipaketi 2ra	
		}
	}
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
function kustutaPlussid(x,y,m){ 
	tausta_canvas.clearRect(x,y-15,20,20);
	hiirex.value = x;
	hiirey.value = y;
	var alpha1 = 1;
}
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

//*******Hero funktsioonide l�pp


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
	}else{  //ei j�� midaig muud �le kui vasakule
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
			}

	

	





Bullet.prototype.kustuta = function(){ //lisab kuulile kustutamise m�rgi
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
//****kuuli funktsioonide lopp******//

//*****reload funktsioonid*******//

function Moon(mitu_kuuli_annab){
    //var randomnumber=Math.floor(Math.random()*11)
	this.width = 22;
	this.height = 10;
	this.srcX = 24;
	this.srcY = 582;
	this.drawX = Math.floor(Math.random()*500);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >= gameHeight - this.height){
		this.drawY -= this.height;
	}
	this.mituk = mitu_kuuli_annab;
}
Moon.prototype.draw = function(){
	tegelase_canvas.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

function Clock(){
    this.width = 30;
	this.height = 39;
	this.srcX = 13;
	this.srcY = 1200;
    this.drawX = Math.floor(Math.random()*450);
	this.drawY = Math.floor(Math.random()*500);
	
    this.drawY -= this.height;
	}
	
Clock.prototype.draw = function(){
	tegelase_canvas.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		
		
};	
//*****end of reload funktsioonid*****//
//*****Zombie funktsioonid*******//
function Zombie(){ //tavaline zombie
    this.drawX = Math.floor(Math.random()*400+800);
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
	this.drawX = Math.floor(Math.random()*400+800);
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

function Zombie5(){ //zombie boss
    this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >250){
		this.drawY -=160;
		
		}
	this.srcX = 281;	
	this.srcY = 1126;
	this.width = 110;
	this.height = 160;
	this.speed = 0.3;
	this.elud = 600;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie5.prototype.draw = function(){
	this.drawX -= this.speed;
	zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	if(this.drawX <=30){
		isPlaying = false;
		setTimeout("gameOver()",2000);
	}
	
};

var zombiehitpoints = Array(20, 30, 40);// random hitpoints
var zombiehitpoints2 = Array(10, 20, 30);
var zombiehitpoints3 = Array(60, 70, 80, 90, 100);
var zombiehitpoints4 = Array(70, 80, 90, 100, 110);
var zombiehitpoints5 = Array(100, 110, 120, 130, 140);
var zombiehitpoints6 = Array(120, 130, 140, 150, 160, 170, 180);
var zombiehitpoints7 = Array(150, 160, 170, 180, 190, 200, 210);

	
function Zombie3(){ //paks zombie

	this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >420){
		this.drawY -=70;
	}
	this.srcX = 171;
	this.srcY = 518;
	this.width = 50;
	this.height = 80;
	this.speed = 0.4;
	this.elud = zombiehitpoints3[Math.floor(Math.random()*5)];
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
    this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
	}
	this.srcX = 460;
	this.srcY = 524;
	this.width = 38;
	this.height = 60;
	this.speed = 0.48;
	this.elud = 90;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie4.prototype.draw = function(){
    
	if(this.elud <=40 && this.kontroll == false){
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
			//setTimeout(kutsumine,6000,self);	//exploreri peal ei t��danud
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
function Zombie6(){ //zombie soldier
    this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
		
		}
	this.srcX = 560;	
	this.srcY = 518;
	this.width = 38;
	this.height = 70;
	this.speed = 0.45;
	this.speed1 = 0.7;
	this.elud = 120;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie6.prototype.draw = function(){
    
	if(this.elud <=40 && this.kontroll == false){
		this.reborn = true;
		this.drawX -= this.speed1;
	}
	if(this.reborn == false){
		this.drawX -= this.speed;
		
		zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	}else{
		zombid_taust.drawImage(imgSprite,610,517,35,70,this.drawX , this.drawY ,35,70);
		this.kasHaavatav = true;
		if(this.kasSees == true){
		   
			var self = this;
			
	}
	
}
if(this.drawX <=30){
		isPlaying = false;
		//gameOver();
		setTimeout("gameOver()",2000);
	}
};
Zombie6.prototype.uuenda = function(self){
	self.kontroll = true;
    self.reborn = false;
    self.kasHaavatav = true;
};	


function Zombie7(){ //behemoth zombie

	this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >380){
		this.drawY -=70;
	}
	this.srcX = 666;
	this.srcY = 514;
	this.width = 85;
	this.height = 75;
	this.speed = 0.4;
	this.elud = 160;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie7.prototype.draw = function(){
    
	if(this.elud <=100 && this.kontroll == false){
		
		this.speed = 0.3;
	}
if(this.elud <=60 && this.kontroll == false){
		
		this.speed = 0.2;
	}	
	if(this.reborn == false){
		this.drawX -= this.speed;
		
		zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	
	
}
if(this.drawX <=30){
		isPlaying = false;
		//gameOver();
		setTimeout("gameOver()",2000);
	}
};
			
	
if(this.drawX <=30){
		isPlaying = false;
		//gameOver();
		setTimeout("gameOver()",2000);
	}
    
function Zombie8(){ //orc  zombie

    this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >70){
		this.drawY -=80;
	}
	this.srcX = 408;
	this.srcY = 1128;
	this.width = 70;
	this.height = 80;
	this.speed = 0.5;
	this.elud = 180;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
	
}
Zombie8.prototype.draw = function(){
    
	if(this.elud <=90 && this.kontroll == false){
		this.reborn = true;
		
	}
	if(this.reborn == false){
		this.drawX -= this.speed;
		zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	}else{
		zombid_taust.drawImage(imgSprite,498,1128,70,80,this.drawX,this.drawY ,70,80);
		this.kasHaavatav = true;
		if(this.kasSees == false){
		    var kutsumine = this.uuenda;
			var self = this;
			this.elud =+90;
			//setTimeout(kutsumine,6000,self);	//exploreri peal ei t��danud
			  setTimeout(function(){
				kutsumine(self);
			  },10000);	
		}
		
	}
	if(this.drawX <=30){
		isPlaying = false;
		//gameOver();
		setTimeout("gameOver()",2000);
	}
};
Zombie8.prototype.uuenda = function(self){
	self.kontroll = true;
    self.reborn = false;
    self.kasHaavatav = true;
	
};	

function Zombie9(){ //death zombie
    this.drawX = Math.floor(Math.random()*400+800);
	this.drawY = Math.floor(Math.random()*500);
	if(this.drawY >440){
		this.drawY -=60;
	}
	this.srcX = 576;
	this.srcY = 1135;
	this.width = 71;
	this.height = 65;
	this.speed = 0.42;
	this.elud = 240;
	this.kasHaavatav = true;
	this.reborn = false;
	this.kasSees = false;
	this.kontroll = false;
}
Zombie9.prototype.draw = function(){
    
	if(this.elud <=105 && this.kontroll == false){
		this.reborn = true;
		this.speed = 0.2;
	}
	
	if(this.reborn == false){
		this.drawX -= this.speed;
		zombid_taust.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	}else{
		zombid_taust.drawImage(imgSprite,664,1163,32,42,this.drawX+10,this.drawY+26,30,40);
		this.kasHaavatav = false;
		if(this.kasSees == false){
		    var kutsumine = this.uuenda;
			var self = this;
			this.kasSees = true;
			//setTimeout(kutsumine,6000,self);	//exploreri peal ei t��danud
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
Zombie9.prototype.uuenda = function(self){
	self.kontroll = true;
    self.reborn = false;
    self.kasHaavatav = true;
};	

//*****Zombie funktsioonide lopp******//

//*********Event funktsioonid**********//


function mouseClicked(e){
    document.removeEventListener("click",mouseClicked,false);
	document.removeEventListener("keydown",valitudKeyboard,false);
	
	if(touchable){
	    alert("T��tab");
    }else{
		canvas6.onmousemove = hiirelohistus; //kuulab mousemove eventi canvas 5 on k�ige pealmine
		canvas6.onmousedown = muudaspace2;
		canvas6.onmouseup = muudaspace;
		playGame();
	}
}
function valitudKeyboard(e){
	var keyID = e.keyCode || e.which;
	if(keyID == 32){
		document.removeEventListener("click",mouseClicked,false);
		document.removeEventListener("keydown",valitudKeyboard,false);
		document.addEventListener('keydown',checkKeyDown,false); //lisab keydown 
		document.addEventListener('keyup',checkKeyUp,false);//lisab keyup kuularid
		playGame();
	}	
}
function muudaspace(e){
	ise.isSpacebar = false;
	e.preventDefault();
}
function muudaspace2(e){
	ise.isSpacebar = true;
	e.preventDefault();
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



