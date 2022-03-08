// Declarando as váriaveis que serão usadas pelo jogo no contexto global:
let currentScore = 0
let score = document.querySelector('[score]')

let bird = document.querySelector('[bird]')
let birdAltitude = 225
let maxAltitude = 0
let minAltitude = 455

let screenBorder = 3
let screenSize = 480 - (2 * screenBorder)
let birdHeigth = 20

let step = 1
let stepOnClick = 40

let columnArray = document.querySelectorAll('[column]')
let columnStartingPosition = 800
let columnEndingPosition = -160
let callNextColumnPosition = 560
let columnsInMotion = 1
let columnPositionArray = []

let possibleColisionRangeStart = 305
let possibleColisionRangeEnd = 405 

let pipesArray = document.querySelectorAll('[pipe]')

document.addEventListener('keypress', verticalMovement, false);

// Para iniciar o jogo é necessário preencher o array de posição dos canos, e definir a altura dos primeiros canos:
columnArray.forEach(() => columnPositionArray.push(columnStartingPosition))
columnArray.forEach((e, index) => definePipesHeight(index)) 

// O setInterval a seguir é um controla a animação do jogo em frames, chamando as demais funções através da função principal "game" 
var gameMotion = setInterval(game, 10) // Avaliar mudar o intervalo para deixar mais leve, ex: 5px 50ms

// Movimento vertical para cima do jogador:
function verticalMovement() {
    let newAltitude = birdAltitude - stepOnClick
    if (newAltitude >= maxAltitude) {
        bird.style.top = newAltitude + 'px'
        birdAltitude = newAltitude
    }
    else {
        birdAltitude = maxAltitude
        bird.style.top = birdAltitude + 'px'
    }
}
// Reseta o jogo do início:
function newGame() {
    currentScore = 0
    score.innerHTML = `Score: ${currentScore}` 

    birdAltitude = 225
    maxAltitude = 0
    minAltitude = 455
    bird.style.top = birdAltitude

    step = 1
    stepOnClick = 40

    columnStartingPosition = 800
    columnEndingPosition = -160
    callNextColumnPosition = 560
    columnsInMotion = 1
    columnPositionArray = []
    columnArray.forEach(() => columnPositionArray.push(columnStartingPosition))
    columnArray.forEach((column) => column.style.left = columnStartingPosition + 'px')
    columnArray.forEach((e, index) => definePipesHeight(index))

    document.removeEventListener('keypress', newGame, false);
    document.addEventListener('keypress', verticalMovement, false);

    gameMotion = setInterval(game, 10)
}
// As duas próximas funções servem para gerar a altura dos canos aletóriamente:
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function definePipesHeight(columnIndex) {
    let pipeHeight = 0
    document.querySelectorAll(`#column-${columnIndex} [pipe]`).forEach((pipe, pipeIndex) => {
        if (pipeIndex % 2 == 0) { // Para os dois canos na coluna (um em cima e outro em baixo), a soma das alturas deve ser 380px
            pipeHeight = getRandomIntInclusive(100, 280) 
            pipe.style.height = pipeHeight + 'px'
            document.getElementById(`column-${columnIndex}`).setAttribute('gap-between-pipes-top', `${pipeHeight}`)
        }
        else {
            pipeHeight = 380 - pipeHeight
            pipe.style.height = pipeHeight + 'px'
            document.getElementById(`column-${columnIndex}`).setAttribute('gap-between-pipes-bottom', `${screenSize - pipeHeight}`)
        }
    })
}
// Função que controla os movimentos do jogo:
function game() {
    // Gravidade:
    let newAltitude = birdAltitude + step
    if (newAltitude <= minAltitude) {
        bird.style.top = newAltitude + 'px'
        birdAltitude = newAltitude
    }
    for (let i = 0; i < columnsInMotion; i++) {
        // Movimento lateral do cenário:
        function horizontalMovement() {
            let newColumnPosition = columnPositionArray[i] - step
            let birdMax = document.getElementById(`column-${i}`).getAttribute('gap-between-pipes-top') 
            let birdMin = document.getElementById(`column-${i}`).getAttribute('gap-between-pipes-bottom') - birdHeigth
            // Realizando o movimento dos canos:
            if (newColumnPosition >= columnEndingPosition && newColumnPosition !== callNextColumnPosition) {
                columnArray[i].style.left = newColumnPosition + 'px'
                columnPositionArray[i] = newColumnPosition
            }
            else if (newColumnPosition >= columnEndingPosition && newColumnPosition === callNextColumnPosition) {
                columnArray[i].style.left = newColumnPosition + 'px'
                columnPositionArray[i] = newColumnPosition
                if (columnsInMotion < columnArray.length) {
                    columnsInMotion++
                }
            }
            else {
                columnPositionArray[i] = columnStartingPosition
                definePipesHeight(i)
            }
            // Verificando se o passarinho colidiu com algum cano:
            if (newColumnPosition >= possibleColisionRangeStart && newColumnPosition <= possibleColisionRangeEnd && (birdAltitude <= birdMax || birdAltitude >= birdMin)) {
                if (newColumnPosition > possibleColisionRangeStart && newColumnPosition < possibleColisionRangeEnd && birdAltitude <= birdMax){ // Esse if ajusta a posição do passarinho, caso o movimento causado pelo click tenha feito ele ultrapassar o limite do cano
                    bird.style.top = birdMax + 'px'
                }                
                clearInterval(gameMotion) // Game Over
                document.removeEventListener('keypress', verticalMovement, false);
                document.addEventListener('keypress', newGame, false); // New Game: Ativado pelo próximo keypress
            } 
            // Contando pontuação:
            if (newColumnPosition == possibleColisionRangeStart + 1){
                currentScore++
                score.innerHTML = `Score: ${currentScore}` 
            }
        }
        horizontalMovement()
    }
}

