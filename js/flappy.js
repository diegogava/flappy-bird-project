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

document.addEventListener('keypress', verticalMovement, false)

/**
 * To start the game its necessary to fill the
 * position array of pipes, and define the
 * height of first pipes
 */
function createFirstPipes() {
    columnArray.forEach(() => columnPositionArray.push(columnStartingPosition))
    columnArray.forEach((e, index) => definePipesHeight(index))
}

createFirstPipes()

// The 'setInterval' bellows controls the animation of the
// game in frames, calling the other functions through the
// main function 'game'.
// TODO: evaluate changing the range to make it lighter, eg:
// 5px 50ms
let gameMotion = setInterval(performAnimation, 10)

/**
 * Performs the vertical movement of the bird
 */
function verticalMovement() {
    let newAltitude = birdAltitude - stepOnClick
    if (newAltitude >= maxAltitude) {
        bird.style.top = newAltitude + 'px'
        birdAltitude = newAltitude
    } else {
        birdAltitude = maxAltitude
        bird.style.top = birdAltitude + 'px'
    }
}

/**
 * Resets the variables to their initial values
 */
function resetVariables() {
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
}

/**
 * Generates an integer between the parameters
 *
 * @param {integer} min
 * @param {integer} max
 *
 * @returns {integer}
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Defines the pipe heights
 *
 * @param {integer} columnIndex
 */
function definePipesHeight(columnIndex) {
    let pipeHeight = 0
    document.querySelectorAll(`#column-${columnIndex} [pipe]`)
        .forEach((pipe, pipeIndex) => {
            // The sum pf the heights must be 380px for the
            // two pipes in the column (one on the top and
            // the other one below)
            if (pipeIndex % 2 == 0) {
                pipeHeight = getRandomIntInclusive(100, 280)
                pipe.style.height = pipeHeight + 'px'
                document.getElementById(`column-${columnIndex}`)
                    .setAttribute('gap-between-pipes-top', `${pipeHeight}`)
            } else {
                pipeHeight = 380 - pipeHeight
                pipe.style.height = pipeHeight + 'px'
                document.getElementById(`column-${columnIndex}`)
                    .setAttribute('gap-between-pipes-bottom', `${screenSize - pipeHeight}`)
            }
        })
}

/**
 * Controls the moviments of the game
 */
function performAnimation() {
    // Gravidade:
    let newAltitude = birdAltitude + step
    if (newAltitude <= minAltitude) {
        bird.style.top = newAltitude + 'px'
        birdAltitude = newAltitude
    }
    for (let i = 0; i < columnsInMotion; i++) {
        performHorizontalMovement(i)
    }
}

/**
 * Performs the moviment of the scenario
 *
 * @param {integer} position
 */
function performHorizontalMovement(position) {
    let newColumnPosition = columnPositionArray[position] - step
    let birdMax = document.getElementById(`column-${position}`)
        .getAttribute('gap-between-pipes-top')
    let birdMin = document.getElementById(`column-${position}`)
        .getAttribute('gap-between-pipes-bottom') - birdHeigth
    performColumnsMovement(position, newColumnPosition)
    if (checkColision(newColumnPosition, birdMax, birdMin)) {
        // Adjusts the position of the bird, in case the moviment
        // caused by the click has made it cross the limit of the
        // pipe
        if (checkIfHitsThePipe(newColumnPosition, birdMax)) {
            bird.style.top = birdMax + 'px'
        }
        gameOver()
    }
    countTheScore(newColumnPosition)
}

/**
 * Increase and displays the score
 *
 * @param {integer} newColumnPosition
 */
function countTheScore(newColumnPosition) {
    // Counting the score
    if (newColumnPosition == possibleColisionRangeStart + 1) {
        currentScore++
        score.innerHTML = `Score: ${currentScore}`
    }
}

/**
 * Performs the movement of the columns in the screen
 *
 * @param {integer} position
 * @param {integer} newColumnPosition
 */
function performColumnsMovement(position, newColumnPosition) {
    if ((newColumnPosition >= columnEndingPosition) &&
        (newColumnPosition !== callNextColumnPosition)) {
        columnArray[position].style.left = newColumnPosition + 'px'
        columnPositionArray[position] = newColumnPosition
    } else if ((newColumnPosition >= columnEndingPosition) &&
        (newColumnPosition === callNextColumnPosition)) {
        columnArray[position].style.left = newColumnPosition + 'px'
        columnPositionArray[position] = newColumnPosition
        if (columnsInMotion < columnArray.length) {
            columnsInMotion++
        }
    } else {
        columnPositionArray[position] = columnStartingPosition
        definePipesHeight(position)
    }
}

/**
 * Checks if the bird colided with some pipe
 *
 * @returns {boolean}
 */
function checkColision(newColumnPosition, birdMax, birdMin) {
    return newColumnPosition >= possibleColisionRangeStart &&
        newColumnPosition <= possibleColisionRangeEnd &&
        (birdAltitude <= birdMax || birdAltitude >= birdMin)
}

/**
 * Checks if the bird crosses the limit of the pipes frame
 *
 * @returns {boolean}
 */
function checkIfHitsThePipe(newColumnPosition, birdMax) {
    return newColumnPosition > possibleColisionRangeStart &&
        newColumnPosition < possibleColisionRangeEnd &&
        birdAltitude <= birdMax
}

/**
 * Resets the game by changing the variables
 * to their initials values
 */
function resetGame() {
    resetVariables()
    columnArray.forEach(() => columnPositionArray.push(columnStartingPosition))
    columnArray.forEach((column) => column.style.left = columnStartingPosition + 'px')
    columnArray.forEach((e, index) => definePipesHeight(index))

    document.removeEventListener('keypress', resetGame, false)
    document.addEventListener('keypress', verticalMovement, false)

    gameMotion = setInterval(performAnimation, 10)
}

/**
 * Stops the bird movement and resets the game.
 */
function gameOver() {
    clearInterval(gameMotion)
    document.removeEventListener('keypress', verticalMovement, false)
    document.addEventListener('keypress', resetGame, false)
}
