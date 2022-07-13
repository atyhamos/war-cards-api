let deckId = ''
const cards = []
const cardContainersEl = document.getElementsByClassName('card-slot')
const scoring = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
}
const headerEl = document.getElementById('header')
const computerScoreEl = document.getElementById('score-com')
const playerScoreEl = document.getElementById('score-player')
const remainingEl = document.getElementById('remaining')
const drawButtonEl = document.getElementById('draw')

let computerScore = 0,
  playerScore = 0

async function getNewDeck(e) {
  e.preventDefault()

  const response = await fetch(
    'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
  )
  const data = await response.json()
  deckId = data.deck_id
  remainingEl.innerHTML = `Remaining cards: ${data.remaining}`
  // Reset the game
  drawButtonEl.disabled = false
  headerEl.textContent = `Game of War`
  computerScoreEl.textContent = `Computer score: 0`
  playerScoreEl.textContent = `My score: 0`
  cardContainersEl[0].innerHTML = ``
  cardContainersEl[1].innerHTML = ``
}

async function drawCards(e) {
  e.preventDefault()

  const response = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  )
  const data = await response.json()

  cards[0] = data.cards[0]
  cards[1] = data.cards[1]
  cardContainersEl[0].innerHTML = `<img src=${cards[0].image} alt=${cards[0].value} />`
  cardContainersEl[1].innerHTML = `<img src=${cards[1].image} alt=${cards[1].value} />`
  headerEl.textContent = compare(cards[0], cards[1])
  remainingEl.textContent = `Remaining cards: ${data.remaining}`
  computerScoreEl.textContent = `Computer score: ${computerScore}`
  playerScoreEl.textContent = `My score: ${playerScore}`
  if (data.remaining === 0) {
    // Game over
    drawButtonEl.disabled = true
    headerEl.textContent =
      playerScore > computerScore
        ? `Player wins!`
        : playerScore === computerScore
        ? `It's a draw!`
        : `Computer wins!`
  }
}

function compare(card1, card2) {
  score1 = scoring[card1.value]
  score2 = scoring[card2.value]
  if (score1 > score2) {
    computerScore++
    return `Computer wins with ${card1.value}`
  } else if (score1 < score2) {
    playerScore++
    return `Player wins with ${card2.value}`
  } else {
    return `War!`
  }
}

document
  .getElementById('new-deck')
  .addEventListener('mousedown', (event) => getNewDeck(event))
document
  .getElementById('draw')
  .addEventListener('mousedown', (event) => drawCards(event))
