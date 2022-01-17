var d = new Date()

// Chalange 1: Your age in days
function ageInDays () {
    var birthYear = prompt("what year were you born??");
    var myAge = (d.getFullYear() - birthYear) * 365;
    
    var h1 = document.createElement('h1');
    var textAnswer = document.createTextNode('You are '+ myAge + ' days');
    
    h1.setAttribute('id', 'myAge');
    h1.appendChild(textAnswer);
    document.getElementById('flex-box-result').appendChild(h1);
    
}

function reset() {
    document.getElementById('myAge').remove();
}

// Chalange 2: Generate Cat
function generateCat() {
    var image = document.createElement("img")
    image.src = "http://thecatapi.com/api/images/get?format=src&type=gif?size=small";
    image.height = 150
    image.width = 150
    document.getElementById("flex-cat-gen").appendChild(image)

}

// Chalange 3: Rock, Paper, Scissors
function rpsGame(yourChoice) {
    var humanChoice, botChoice;
    humanChoice = yourChoice.id;
    botChoice = chooseOption();
    result = decideWinner(humanChoice, botChoice); // [0,1] human lost, bot won
    message = finalMessage(result); // You won!
    console.log(humanChoice, botChoice, message)

    rpsFront(yourChoice, botChoice, message);
}

function chooseOption() {
    options = ['rock', 'scissors', 'paper'];
    randomNumber = Math.floor(Math.random() * 3);
    return options[randomNumber];
}

function decideWinner(humanChoice, botChoice) {
    var choices = {
        'rock': {'rock': 0.5, 'paper': 0, 'scissors': 1},
        'paper': {'rock': 1, 'paper': 0.5, 'scissors': 0},
        'scissors': {'rock': 0, 'paper': 1, 'scissors': 0.5},
    }
    humanStatus = choices[humanChoice][botChoice]
    botStatus = choices[botChoice][humanChoice]
    return [humanStatus, botStatus];
}

function rpsFront(yourChoice, botChoice, message) {
    var humanImage = yourChoice.src
    var botImage = document.getElementById(botChoice).src

    removeElements();
    var humanDiv = document.createElement('div');
    var botDiv = document.createElement('div');
    var messageDiv = document.createElement('div');
    
    humanDiv.innerHTML = "<img src='" + humanImage + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(37,58,233,1);'>"
    messageDiv.innerHTML = "<h1 style='color: "+ message['color'] + "; font-size: 60px; padding: 30px '>" + message['message'] +"</h1>"
    botDiv.innerHTML = "<img src='" + botImage + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(243,38,233,1);'>"
    
    document.getElementById("flex-box-rps-div").appendChild(humanDiv);
    document.getElementById("flex-box-rps-div").appendChild(messageDiv);
    document.getElementById("flex-box-rps-div").appendChild(botDiv);
}

function finalMessage([humanStatus, botStatus]) {
    if (humanStatus === 0) {
        return {'message': 'You Lost!', 'color': 'red'}
    } else if (humanStatus === 0.5) {
        return {'message': 'You tied!', 'color': 'yellow'}
    } else {
        return {'message': 'You Win!', 'color': 'green'}
    }
}

function removeElements() {
    document.getElementById('rock').remove();
    document.getElementById('paper').remove();
    document.getElementById('scissors').remove();
}


// Challenge 4: Change the Colors of All Buttons
var all_buttons = document.getElementsByTagName('button');
var copyButtons = [];

const buttonTypes = {
    'red': 'btn-danger',
    'blue': 'btn-primary',
    'green': 'btn-success'
}

for(let i=0; i < all_buttons.length; i++) {
    copyButtons.push(all_buttons[i].classList[1]);
}

function buttonColorChange(colorChoice) {
    deleteColors()

    if (colorChoice.value === 'random') {
        RandomPainting()
    } else if (colorChoice.value === 'reset') {
        ResetPainting()
    } else {
        OneColorPaint(colorChoice.value)
    }
}

function deleteColors(){
    for(let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1])
    }
}

function OneColorPaint(colorToPaint) {
    for(let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.add(buttonTypes[colorToPaint])
    }
}

function ResetPainting () {
    for(let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.add(copyButtons[i])
    }
}

function RandomPainting() {
    var keys = Object.keys(buttonTypes)
    for(let i=0; i < all_buttons.length; i++) {
        check = buttonTypes[keys[ Math.floor(keys.length * Math.random())]];
        all_buttons[i].classList.add(check)
    }
}


// Challenge 5: BlackJack
const GAME = {
    'you': {'result': '#your-blackjack-result', 'board': '#your-box', 'score': 0},
    'dealer': {'board': '#dealer-box', 'result': '#dealer-blackjack-result', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    // 'isHit': false,
    'isStand': false,
    'turnOver': false
}

const YOU = GAME['you'];
const DEALER = GAME['dealer'];
const HITSOUND = new Audio('static/sounds/swish.mp3');
const WINSOUND = new Audio('static/sounds/cash.mp3');
const LOSESOUND = new Audio('static/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit)
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal)
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic)


function blackjackHit() {
    if (GAME['isStand'] === false) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function sleep(ms) {
    return new Promise(resolve =>  {
        setTimeout(resolve, ms)
    })
}

async function dealerLogic() {
    GAME['isStand'] = true;
    while (DEALER['score'] < 17 && GAME['isStand'] === true) {
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    
    GAME['turnOver'] = true;
    showResult(computeWinner());
    
}

function showCard(ActivePlayer, card) {
    if (ActivePlayer['score'] <= 21) {
    let img = document.createElement('img');
    img.src = "static/images/" + card + ".png"
    document.querySelector(ActivePlayer['board']).appendChild(img)
    HITSOUND.play()
    }
}

function blackjackDeal () {
    if (GAME['turnOver'] === true) {
        GAME['isStand'] = false;
        GAME['turnOver'] = false;
        
        let youCards = document.querySelector(YOU['board']).querySelectorAll('img')
        let dealerCards = document.querySelector(DEALER['board']).querySelectorAll('img')
        
        if (youCards.length > 0) {
            for(i=0; i < youCards.length; i++) {
                youCards[i].remove();
            }
        }
            
        if (dealerCards.length > 0) {
            for(i=0; i < dealerCards.length; i++) {
                dealerCards[i].remove();
            }
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['result']).textContent = 0;
        document.querySelector(YOU['result']).style.color = 'blanchedalmond';
        document.querySelector(DEALER['result']).textContent = 0;
        document.querySelector(DEALER['result']).style.color = 'blanchedalmond';
    
        document.querySelector('#blackjack-result').textContent = "Let's Play"
        document.querySelector('#blackjack-result').style.color = 'black'    
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return GAME['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        // If adding 11 keeps me below 21, add 11. Otherwise, add 1.
        if (activePlayer['score'] + GAME['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += GAME['cardsMap'][card][1];
        } else {
            activePlayer['score'] += GAME['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += GAME['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['result']).textContent = 'BUST!';
        document.querySelector(activePlayer['result']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['result']).textContent = activePlayer['score'];
    }
}

// compute winner and return who just won
// update the wins, draws and losses.
function computeWinner() {
    let winner;
    // condition: higher score than dealer or when dealer busts but you're not
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            GAME['wins'] ++ ;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            GAME['losses'] ++ ;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            GAME['draws'] ++ ;
        }
    // condition: When user busts but dealer doesn't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        GAME['losses'] ++ ;
        winner = DEALER;
    
    // condition: When you AND the dealer busts
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        GAME['draws'] ++ ;
    }
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (GAME['turnOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = GAME['wins']
            message = 'You won!'
            messageColor = 'green'
            WINSOUND.play()
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = GAME['losses']
            message = 'You Lost!'
            messageColor = 'red'
            LOSESOUND.play()
        } else {
            document.querySelector('#draws').textContent = GAME['draws']
            message = 'You drew!'
            messageColor ='black'
        }
    
        document.querySelector('#blackjack-result').textContent = message
        document.querySelector('#blackjack-result').style.color = messageColor
    }
}