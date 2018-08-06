var exposeTime = 1000

// create an object array with all images used in the game
var flowers = [
  { name: 'Blue Flower', image: '<img src="flowers/blueflower.png" alt="blue-flower">'},
  { name: 'Pink Flower', image: '<img src="flowers/pinkflower.png" alt="pink-flower">'},
  { name: 'Purple Flower', image: '<img src="flowers/purpleflower.png" alt="purple-flower">'},
  { name: 'Pinky Flower', image: '<img src="flowers/pinkyflower.png" alt="pinky flower">'},
  { name: 'Purply Flower', image: '<img src="flowers/purplyflower.png" alt="purply flower">'},
  { name: 'Pink Flowers', image: '<img src="flowers/pinkflowers.png" alt="pink flowers">'}
];

// double the flowers images
flowers = flowers.concat(flowers);

//setting game players (two players)
var game = {
  player1: {time: "", minute:"",name: ""},
  player2: {time: "", minute:"",name: ""}
}

//change the background to the game
function newBackground() {
  $('*').off(); // clear everything in the body
  $('#intro-page').addClass('hidden'); // hide intro page
  $('body').css('background', '#F8F8FF'); //change background color
  $('#main').removeClass('hidden'); //remove hidden class from main page
}

//Reset Button
function resetGame() {
  $('*').off(); // clear everything in the body
  $('#intro-page').removeClass('hidden'); // hide intro page
  $('body').css('background', ''); //change background color
  $('#main').addClass('hidden'); //remove hidden class from main page
  game.player1.name = $("input[name='player1name']").val("");
  game.player2.name = $("input[name='player2name']").val("");
  $('#start-game').on('click', startRound);// to stop the time--clearInterval(myInterval);
}

//Set up the board and start game

var currentPlayer = game.player1 //setting the currentplayer to player 1
var $board = $('#board');

function startRound() {
  newBackground();
  $board.empty();
  game.player1.name = $("input[name='player1name']").val();
  console.log(game.player1.name);
  game.player2.name = $("input[name='player2name']").val();
  console.log(game.player2.name);
  $('#scoreboard').html("<h1 class='players'>" +currentPlayer.name+ "</h1>");
  shuffleArray(flowers);

  for (var i = 0; i < flowers.length; i++) {
    $board.append('<div class="card"><div class="row"><div class="col-xs-6 col-md-3">' + flowers[i].image +
    '</div></div></div>')
  }
  startTimer();
  activateCards();
};

//Set Matching Card game
var matches = 0; //checks number of matches
var cardSelected = null;


function activateCards() {
  $cards = $('.card')
  $cards.not('.matched').on('click', function(){
    $(this).toggleClass('backside')
    // console.log($(this).find("img").attr('src'));
    if (!cardSelected) {
      cardSelected = $(this)
      $(this).off()
    } else {
      deactivateCards()
      var matched = (cardSelected.find("img").attr('src') == $(this).find("img").attr('src'))
      if (matched) {
        cardSelected.addClass("matched")
        $(this).addClass("matched")
        activateCards()
        matches++;
        checkMatchingCards(myInterval)
      } else {
        var secondCard = $(this)
        $(cardSelected).addClass('backside')
        $(this).addClass('backside')
        setTimeout(function(){
          $('.backside').not('.matched').removeClass('backside')
          activateCards()
        }, exposeTime)
      }
    cardSelected = null
    }
  });
}

function deactivateCards() {
  $cards.off()
}

//Set timer
var time = 0;
var minute = 0;
var myInterval;

function startTimer() {
  // $('#timer').text('0 minutes 0 seconds');
  myInterval = setInterval(function() {
    $('#timer').text(minute +' minutes ' +' '+time+ ' seconds');
    time++;
    if(time == 60) {
      minute++;
      time = 0;
    }
    if(minute == 60){
      hour++;
      minute = 0;
    }
  }, exposeTime);
}

//check matches and switch players

function checkMatchingCards(func) {
  if(matches == 6){
    currentPlayer.time = time
    currentPlayer.minute = minute * 60
    clearInterval(func);
    switchPlayers();
  }
};

//create a function to switch between players
function switchPlayers() {
    if (currentPlayer == game.player1) {
      currentPlayer = game.player2;
      console.log(currentPlayer)
        startRound();
    } else {
      checkWinner();
      currentPlayer = game.player1
      console.log(currentPlayer)
      console.log(game.player2)
    }
  matches = 0
  time = 0
  minute = 0
};

// check the winner and show the modal with the winner
function checkWinner() {
  $('#myModal').modal('show')
  if (game.player1.time + game.player1.minute > game.player2.time + game.player2.minute){
    $('.modal-body').html("<h2>You Win, "+game.player2.name+"!!</h2><h3>You made it in "+game.player2.minute+" minutes and "+game.player2.time+" seconds</h3>")
  } else if (game.player1.time + game.player1.minute === game.player2.time + game.player2.minute){
    $('.modal-body').html("<h2>You're both winners!</h2><h3>It's a tie!</h3><h4>You made it in "+game.player2.minute+" minutes and "+game.player2.time+" seconds</h4>")
  }else {
    $('.modal-body').html("<h2>You Win, "+game.player1.name+"!!</h2><h3>You made it in "+game.player1.minute+" minutes and "+game.player1.time+" seconds</h3>")
  }
  $('#play-again').click(function() {
    startRound();
    $('#myModal').modal('toggle')
  });
  $('#restart-game').click(function() {
    resetGame();
    $('#myModal').modal('toggle')
  });
};

$('#start-game').on('click', startRound);// to stop the time--clearInterval(myInterval);




//create a function to randomly shuffle the images
function shuffleArray(array) {
  var i = 0
  var j = 0
  temp = null

  for (i = array.length - 1 ;i>0; i = i -1) {
    j = Math.floor(Math.random()*(i + 1))
    temp = array [i]
    array[i] = array[j]
    array[j] = temp
  }
};
