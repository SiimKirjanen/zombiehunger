var canvas = document.getElementById("taust");	
var tausta_canvas = canvas.getContext('2d');	

var canvas2 = document.getElementById("tegelane");
var tegelase_canvas = canvas2.getContext('2d');		

var canvas3 = document.getElementById("zombid");
var zombid_taust= canvas3.getContext('2d');		

var canvas4 = document.getElementById("pold");
var pold_taust = canvas4.getContext('2d'); 

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
var reloadSound2 = new Audio("Sounds/reload.ogg");

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
reloadSound2.addEventListener('canplaythrough',loadKontroll,false);
music.addEventListener('canplaythrough',loadKontroll,false);

var touchable = 'createTouch' in document;

var gameWidth = canvas.width;    // mängu laius
var gameHeight = canvas.height;	 //mängu kõrgus

var mitu_kuuli_alles;
var mitu_kuuli_saab = 8; //palju annab kuuli abi.see hakkab raunides suurenema

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
var ise = new Hero(); //classi Hero uus objekt ehk siis kangelane, kes ringi liigub
var imgSprite = new Image(); //pilt
imgSprite.src = 'Pildid/sprite.png'; //pildi asukoht
imgSprite.addEventListener('load',loadKontroll,false); //pildi kuular. kui laetud siis init funktsioon

var toimus_asukoha_muutus = false; //
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
var tekstid = new Array();
//*********Põhifunktsioonid**********//

var kontrollSumma = 0;


function loadKontroll(){
	kontrollSumma++;
	if(kontrollSumma == 9){
		init();
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
function init(){
    //clearStatusCanvas();
	joonistaMenu();
    taidaVastased(); //taidab vastaste array
	taidaHelp(); 
	document.addEventListener('click',mouseClicked,false); //lisab lehele click kuulari
    document.addEventListener('keydown',valitudKeyboard,false); //lisab lehele keydown kuulari, ehk kui valitud hiirega mängimine	
} //init sisse tuleb hiljem mängu menüü. Hetkel kuular, mis ootab mouse klikki, et tööle panne mouseClicked funktsioon


function joonistaMenu(){
	status_taust.drawImage(imgSprite,0,600,800,500,0,20,800,500);
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
	    music.pause();
		music2.play();
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
    clearStatusCanvas();
	drawBg(); //joonistab tagatausta 
	joonP(); //joonistab väikese põlluotsa
	music.play();
	startLoop(); // muudab isPlaying muutuja trueks
} //joonistatakse tagataust ja kutsutakse välja startLoop funktsioon, lisatakse kuularid
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
		kasvoib = false; //et enam loop() siia ei pääseks
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
    
	for(var i = 0; i < help.length;i++){
		help[i].draw();
	}
}
function stopLoop(){
    isPlaying = false;	
}




function kustutaPlussid(x,y,m){ 
	tausta_canvas.clearRect(x,y-15,20,20);
	hiirex.value = x;
	hiirey.value = y;
	var alpha1 = 1;
}

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


Hero.prototype.drawAllBullets = function(){
	for(var i = 0; i<this.bullets.length;i++){
		if(this.bullets[i].drawX >=0){ //koik kuulid mille x kordinaat on suurem kui 0 lastakse v2lja
			this.bullets[i].draw();//laskmine
		}	
	}
};



function touchLohistus(e){
    e.preventDefault();
	
    //hiirekursorX = e.pageX - canvas6.offsetLeft;
	//hiirekursorY = e.pageY - canvas6.offsetTop;
	hiirekursorX = e.touches[0].clientX;
	hiirekursorY = e.touches[0].clientY;
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
function touchTulistamine(e){
	e.preventDefault();
	if(e.target.id == "kast"){
	   ise.isSpacebar = true;
	}
	
}
function touchTulistamineLopp(e){
	e.preventDefault();
	if(e.target.id == "kast"){
	   ise.isSpacebar = false;
	}
	
}
function mouseClicked(e){
    document.removeEventListener("click",mouseClicked,false);
	document.removeEventListener("keydown",valitudKeyboard,false);
	
	if(touchable){
	    document.addEventListener("touchmove",touchLohistus,false);
		document.addEventListener("touchstart",touchTulistamine,false);
		document.addEventListener("touchend",touchTulistamineLopp,false);
		var kast = document.createElement('div');
		kast.setAttribute('id','kast');
		document.body.appendChild(kast);
		playGame();
    }else{
		canvas6.onmousemove = hiirelohistus; //kuulab mousemove eventi canvas 5 on kõige pealmine
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



