const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score-points')
  },
  cardsSprits: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type')
  },
  fieldCards: {
    player: document.querySelector('#player-field-card'),
    computer: document.querySelector('#computer-field-card'),
  },
  actions: {
    button: document.querySelector('#next-duel'),
  },
  playersSide: {
    player1: 'player-cards',
    player1Box: document.querySelector('#player-cards'),
    computerBox: document.querySelector('#computer-cards'),
    computer1: 'computer-cards',
  }
}

const playersSide = {
  player1: 'player-cards',
  computer1: 'computer-cards',
}

const pathImage = './src/assets/icons'

const cardData = [
  {
    id: 0,
    name: 'Blue Eyes White Dragon',
    type: 'Paper',
    img: `${pathImage}/dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImage}/magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImage}/exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  }
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement('img')
  cardImage.setAttribute('height', '100px')
  cardImage.setAttribute('src', './src/assets/icons/card-back.png')
  cardImage.setAttribute('data-id', IdCard)
  cardImage.classList.add('card')
  
  if (fieldSide === playersSide.player1) {
    cardImage.addEventListener('click', () => {
      setCardsFields(cardImage.getAttribute('data-id'));
    })
    cardImage.addEventListener('mouseover', () => {
      drawSelectedCard(IdCard)
    })
  }

  return cardImage
}

async function setCardsFields(cardId){

  //remove todas as cartas antes
  await removeAllCarsImages();
  let compuiterCardId = await getRandomCardId()

  state.fieldCards.player.style.display = 'block';
  state.fieldCards.computer.style.display = 'block';

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[compuiterCardId].img;

  let duelResults = await cheDuelResults(cardId, compuiterCardId)
  await updateScore()
  await drawButton(duelResults)
}

async function drawButton(text){
  console.log(text, 'cheguei');
  state.actions.button.innerText = text;
  state.actions.button.style.display = 'block';
}

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} 
  | Lose: ${state.score.computerScore}`
}

async function cheDuelResults(playerId, computerId){
  let duelResults = 'Draw'
  let playerCard = cardData[playerId]

  if(playerCard.WinOf.includes(computerId)){
    duelResults = 'win'
    await playAudio(duelResults)
    state.score.playerScore++;
  }

  if(playerCard.LoseOf.includes(computerId)){
    duelResults = 'lose'
    await playAudio(duelResults)
    state.score.computerScore++;
  }

  return duelResults
}

async function removeAllCarsImages(){
  let cards = state.playersSide.computerBox
  let imageElements = cards.querySelectorAll('img')
  imageElements.forEach((img) => img.remove())

  cards = state.playersSide.player1Box
  imageElements = cards.querySelectorAll('img')
  imageElements.forEach((img) => img.remove())
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function drawSelectedCard(index) {
  state.cardsSprits.avatar.src = cardData[index].img
  state.cardsSprits.name.innerText = cardData[index].name
  state.cardsSprits.type.innerText = 'attribute : ' + cardData[index].type
}

async function resetDuel(){
  state.cardsSprits.avatar.src = ''
  state.actions.button.style.display = 'none'

  state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'
  init()

}

async function playAudio(status){

  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
}

function init() {
  drawCards(5, playersSide.player1)
  drawCards(5, playersSide.computer1)
  sounds()
}

init()


function sounds(){
  const som = new Audio('./src/assets/audios/egyptian_duel.mp3')
  som.play()
}

