//Define Variables and Arrays, set inital values for Stats
let captions = ["See this screen, commander? It'll provide you live updates on the asteroid.", "Scientists have identified the trajectory!", "Asteroid has entered in range of our camera!", "Asteroid has entered zone 2.", "Asteroid has entered zone 3", "Asteroid has entered zone 4", "Last chance Commander! Zone 5!", "You did it Commander! The world is saved!", "...", "Nice job! Our gravity field slowed down the asteroid!"]
let images = ["url(images/space1.png)", "url(images/wrong1.gif)", "url(images/wrong2.gif)", "url(images/wrong3.gif)", "url(images/wrong4.gif)", "url(images/wrong5.gif)", "url(images/wrong6.gif)", "url(images/win.gif)", "url(images/lose.gif)"];
let x, btn, myP, letter, t, element, secretadj, secretnoun, a, b, blankadj, blanknoun, resetletter, oldadj, oldnoun, wrongcount, adjlist, nounlist;
let totalpoints = 0;
let totalgames = 0;
let totalwon = 0;
let highscore = 0;


//creates lists from files
let adjraw = new XMLHttpRequest();
adjraw.open("GET", "adjectives.txt");
adjraw.onload = function() {
	adjlist = adjraw.responseText.split("\n");
}
adjraw.send();

let nounraw = new XMLHttpRequest();
nounraw.open("GET", "nouns.txt");
nounraw.onload = function() {
	nounlist = nounraw.responseText.split("\n");
}
nounraw.send();

//Opens first drop down, creates buttons
function openNav() {
	createButtons();
	document.getElementById("nav").style.height = "100%";
}
//Takes name, closes drop down
function closeNav() {
	let name = document.getElementById('name').value;
	document.getElementById('com').innerHTML = name;
	document.getElementById("nav").style.height = "0%";
	setTimeout(openAbout, 750);
}
//Opens About drop down
function openAbout() {
	document.getElementById("about").style.height = "100%";
}
//Starts Game, closes drop down
function closeAbout() {
	document.getElementById("about").style.height = "0%";
	resetGame();
}
//Adds 1 to total games, generates words, initializes the images and captions, clears letters picked, ables all buttons
function resetGame() {
	totalgames++;
	generateWords();
	updateImage(0);
	updateCaptions(0);
	document.getElementById("p1").innerHTML = ""
	for(x=1; x<=26; x++) {
		resetletter = String.fromCharCode(x+64);
		document.getElementById(resetletter).disabled = false;
	}
}
//Creates buttons for all 26 letters in 2 lines, adds specific id to each, adds onclick listener
function createButtons() {
	for(x=1; x<=26; x++) {
		btn = document.createElement("BUTTON");
		myP = document.createElement("br");
		letter = String.fromCharCode(x+64);
		t = document.createTextNode(letter);
		btn.appendChild(t);
		btn.id = letter;
		myP.id = "brk"
		btn.addEventListener("click", checkLetter);
		document.getElementById("letters").appendChild(btn);
		if (x%13 == 0) {
			document.getElementById("letters").appendChild(myP);
		}
	}
}
//Sets lives to 7 and incorrect guesses to 0, randomly generates from 6 adjectives and 16 nouns - creates 96 combinations, creates the underscores for words and updates those words on screen
function generateWords() {
	document.getElementById("lives").innerHTML = 7;
	wrongcount = 0;
	blankadj = "";
	blanknoun = "";
	secretadj = adjlist[Math.floor(Math.random()*adjlist.length)].toString().toUpperCase().trim();
	secretnoun = nounlist[Math.floor(Math.random()*nounlist.length)].toString().toUpperCase().trim();
	for(a = 0; a < secretadj.length; a++) {
		if(secretadj.charAt(a) == "-") {
			blankadj += " -";
		} else {
			blankadj += " _";
		}
	}
	for(a = 0; a < secretnoun.length; a++) {
		if(secretnoun.charAt(a) == "-") {
			blanknoun += " -";
		} else {
			blanknoun += " _";
		}
	}
	updateWords();
}
//Updates words on screen
function updateWords() {
	document.getElementById("blankadj").innerHTML = blankadj;
	document.getElementById("blanknoun").innerHTML = blanknoun;
}
//Adds the letter onto letters picked, initializes replaceLetter, disable button for letter
function checkLetter() {
	document.getElementById("p1").innerHTML += this.id + " ";
	replaceLetter(this.id);
	document.getElementById(this.id).disabled = true;
}
//Checks and replaces specific letter in the blank words, if there is no change it will add 1 to wrongcount, update lives, images, and captions, also checks if player won or lost
function replaceLetter(letterId) {
	oldadj = blankadj
	oldnoun = blanknoun
	for(b = 0; b < secretadj.length; b++) {
		if(letterId == secretadj.charAt(b)) {
			blankadj = blankadj.substring(0,(b*2+1)) + letterId + blankadj.substring((b*2+2));
		}
	}
	for(b = 0; b < secretnoun.length; b++) {
		if(letterId == secretnoun.charAt(b)) {
			blanknoun = blanknoun.substring(0,(b*2+1)) + letterId + blanknoun.substring((b*2+2));
		}
	}
	if(oldadj == blankadj && oldnoun == blanknoun) {
		wrongcount += 1;
		document.getElementById("lives").innerHTML = 7 - wrongcount;
		if(wrongcount > 6) {
			gameLose();
		} else {
			updateImage(wrongcount);
			updateCaptions(wrongcount);
		}
	} else {
		updateCaptions(9);
	}
	updateWords();
	if(blankadj.includes("_") == false && blanknoun.includes("_") == false) {
		gameWin(7-wrongcount);
	}
}
//Updates image
function updateImage(x) {
	document.getElementById("image").style.backgroundImage = images[x];
}
//Updates caption
function updateCaptions(x) {
	document.getElementById("caption").innerHTML = '"' + captions[x] + '"';
}
//Adds remaining lives to points and updates screen, image, and caption, replaces highscore if higher than previous, adds 1 to total won, sets the stats on win drop down, disable letters, waits for animation to finish before drop down
function gameWin(x) {
	totalpoints += x;
	if(highscore < totalpoints) {
		highscore = totalpoints;
	}
	totalwon++;
	document.getElementById("total").innerHTML = totalpoints;
	document.getElementById('percentage').innerHTML = "Games Won: " + totalwon + "/" + totalgames + "<br>Win Percentage: " + Math.round(totalwon * 100/totalgames) + "%<br>Current Score: " + totalpoints + "<br>High Score: " + highscore;
	updateImage(7);
	updateCaptions(7);
	for(x=1; x<=26; x++) {
		resetletter = String.fromCharCode(x+64);
		document.getElementById(resetletter).disabled = true;
	}
	setTimeout(openWin, 3850);
}
//Drop down for winning
function openWin() {
	document.getElementById("winsplash").style.height = "100%";
}
//Closes drop down, initializes about page
function closeWin() {
	document.getElementById("winsplash").style.height = "0%";
	setTimeout(openAbout, 750);
}
//Updates image and caption, replaces highscore if higher than previous, sets the stats on lose drop down, disable letters, waits for animation to finish before drop down
function gameLose() {
	if(highscore < totalpoints) {
		highscore = totalpoints;
	}
	document.getElementById('loststats').innerHTML = "Games Won: " + totalwon + "/" + totalgames + "<br>Win Percentage: " + Math.round(totalwon * 100/totalgames) + "%<br>Final Score: " + totalpoints + "<br>High Score: " + highscore;
	updateImage(8);
	updateCaptions(8);
	for(x=1; x<=26; x++) {
		resetletter = String.fromCharCode(x+64);
		document.getElementById(resetletter).disabled = true;
	}
	setTimeout(openLose, 2850);
}
//Drop down for losing
function openLose() {
	document.getElementById("losesplash").style.height = "100%";
}
//Close drop down, reset points and updates it on screen, initializes about page
function closeLose() {
	document.getElementById("losesplash").style.height = "0%";
	totalpoints = 0;
	document.getElementById("total").innerHTML = totalpoints;
	setTimeout(openAbout, 750);
}
