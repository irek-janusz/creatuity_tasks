const checkPalindrome = () => {
    let textToCheck = $('#palindromeTextArea').val()

    // First - removing whitespaces from the text, and ensuring it's in the lower case
    textToCheck = textToCheck.replace(/ /g, '').toLowerCase()

    // Creating a reverse text to the one provided
    // This chain of methods simply:
    // - splits the string into an array
    // - reverses an array 
    // - then joins back each element of the array into string
    // Empty string provided inside split and join functions so that we split/join every character
    const reverseText = textToCheck.split('').reverse().join('')

    displayPalindromeResult(textToCheck === reverseText)
}

const displayPalindromeResult = (result) => {
    let message = 'The text is not a palindrome'
    let alertStatus = 'alert-danger'
    if (result) {
        alertStatus = 'alert-success'
        message = 'The text is a palindrome'
    }
    
    $('#palindromeAlert').removeClass('alert-success alert-danger')
        .addClass(alertStatus)
        .text(message)
        .removeAttr('hidden')
}

const palindromeTextAreaChange = () => {
    const textareaValue = $('#palindromeTextArea').val()

    if (!$('#palindromeAlert').is(':hidden')) {
        $('#palindromeAlert').attr('hidden', true)
    }
}

/**
 * DECODER
 */

 const decoderTextAreaChange = () => {
     if ($('#decoderTextArea').val().length === 0 && !$('#decoderAlert').is(':hidden')) {
         $('#decoderAlert').attr('hidden', true)
     }
 }

 const textAreaChange = (textArea, alert) => {
    if ($(textArea).val().length === 0 && !$(alert).is(':hidden')) {
        $(alert).attr('hidden', true)
    }
 }

 const decodeMessage = () => {
     const message = $('#decoderTextArea').val().replace(/\s/g, ' ')
     if (message.length === 0) {
         displayMessage('alert-danger', 'Can\t decode an empty message')
     }
     
     const messageArray = message.split(' ')
     let decodedMessage = []

     messageArray.map(word => {
        word = word.split('')
        const sum = word.reduce((prev, cur) => parseInt(prev) + parseInt(cur))
        decodedMessage.push(String.fromCharCode(sum))
     })

     const alertMessage = `Your decoded message: ${decodedMessage.join('')}`
     displayMessage('#decoderAlert','alert-success', alertMessage)
 }

 const encodeMessage = () => {
    // Get a message to encode
    // And change whitespaces to dashes ('-')
    const messageToEncode = $('#encoderTextArea').val().replace(/\s/g, '-')

    // Split into array of characters
    let messageArray = messageToEncode.split('')

    // Change each digit to its ASCII value
    messageArray = messageArray.map(x => x.charCodeAt())

    // For each ASCII value, break it into a sum of integers
    // messageArray = messageArray.map(x => findSum(x, []))
    messageArray = messageArray.map(x => findSum(x, []))

    // Join encoded characters into string
    messageArray = messageArray.join(' ')

    const alertMessage = `Your encoded message: ${messageArray}`
    displayMessage('#encoderAlert', 'alert-warning', alertMessage)
 }

 const findSum = (number, arr) => {
     if (number === 0) {
         arr = arr.join('')
         return arr
     }

     var randomNumber = Math.floor(Math.random() * 9) + 1
     while (randomNumber > number) {
        randomNumber = Math.floor(Math.random() * 9) + 1
     }

     number -= randomNumber
     arr.push(randomNumber)
     return findSum(number, arr)
 }

 const displayMessage = (alert, type, message) => {
     $(alert)
        .removeClass('alert-success alert-warning alert-danger')
        .addClass(type)
        .text(message)
        .attr('hidden', false)
 }


/**
 * CALCULATOR
 */

$('document').ready(function() {
    let num1 = "", num2 = "", operation, consecutivePercentageClicked = 0, calcDisplay = "",
        operations = ['+', '-', '/', 'x'], digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    
    $('.column').click(function() {
        const clickedValue = $(this).text()

        // Digit
        if (digits.indexOf(clickedValue) > -1 || clickedValue === '.') {
            if (num2 && clickedValue === '.' && num2.indexOf('.') > -1) return
            else if (!num2 && num1 && clickedValue === '.' && num1.indexOf('.') > -1) return
            else {
                setNumbers(clickedValue)
                calcDisplay += clickedValue       
            }
        }

        // + - / x 
        // calc result
        if (operations.indexOf(clickedValue) > -1) {
            setOperation(clickedValue)
            if (operations.indexOf(calcDisplay[calcDisplay.length - 2]) > -1) {
                calcDisplay = calcDisplay.slice(0, -2) + clickedValue + ' '
            } else {
                calcDisplay += ' ' + clickedValue + ' '
            }
        }

        // %
        // divide number by 100
        if (clickedValue === '%') {
            const numToEdit = num2 ? num2 : num1
            calcDisplay = calcDisplay.slice(0, (-1 * numToEdit.length))
            const newNum = calcPercentage()
            calcDisplay += newNum
        }

        // C
        // clear last - change to AC
        if (clickedValue === 'C') {
            let sliceBoundry
            if (num2) {
                sliceBoundry = (-1 * num2.length)
            }
            else if (operation) {
                sliceBoundry = -2
            } else {
                sliceBoundry = (-1 * num1.length)
            }
            cleanLast()
            calcDisplay = calcDisplay.slice(0, sliceBoundry)
        }

        // AC
        // clean all
        if (clickedValue === 'AC') {
            cleanAll()
            calcDisplay = ""
            $('#calculatorResult').text("0")
        }

        // +/-
        // multiply by -1
        // setCalculatorResult(clickedValue)
        if (clickedValue === '+/-') {
            negateNumber()
        }

        // =
        if (clickedValue === '=')
            if (num1 && num2 && operation) {
                calculateResult(parseFloat(num1), parseFloat(num2), operation)
            }        
        $('#memoryDigits').text(calcDisplay)
        if (clickedValue !== 'C' && $('#cleanBtn').text() === 'AC') {
            $('#cleanBtn').text('C')
        }
    })

    const calcPercentage = () => {
        consecutivePercentageClicked += 1
        if (num2) {
            num2 = (num2 / 100).toFixed(consecutivePercentageClicked * 2)
            return num2
        } else {
            num1 = (num1 / 100).toFixed(consecutivePercentageClicked * 2)
            return num1
        }
    }

    const setNumbers = (clickedValue) => {
        if (consecutivePercentageClicked) consecutivePercentageClicked = 0
        if (!num1 || !operation) {
            num1 += clickedValue
        }
        else if(num1 && operation) {
            num2 += clickedValue
        }
    }

    const setOperation = (clickedOperation) => {
        if (consecutivePercentageClicked) consecutivePercentageClicked = 0
        if (num1 && num2) {
            calculateResult(parseFloat(num1), parseFloat(num2), operation)
            num1 = $('#calculatorResult').text()
            num2 = ""
        }
        operation = clickedOperation
    }

    const cleanLast = () => {
        if (num2) {
            num2 = ""
        } else if (operation && !num2) {
            operation = null
        } else {
            num1 = ""
        }
        $('#cleanBtn').text('AC')
    }

    const cleanAll = () => {
        num1 = num2 = operation = ""
        $('#cleanBtn').text('C')
    }

    const negateNumber = () => {
        let numToShow, prevNumber
        if (num2) {
            prevNumber = num2
            num2 *= (-1)
            numToShow = num2
        } else {
            prevNumber = num1
            num1 *= (-1)
            numToShow = num1
        }

        // Slice previous number
        if (prevNumber >= 0) {
            calcDisplay = calcDisplay.slice(0, (prevNumber.toString().length * (-1)))
        } else {
            console.log('problem here')
            calcDisplay = calcDisplay.slice(0, (prevNumber.toString().length * (-1) - 2))
        }
        // Modify number to show
        numToShow = numToShow < 0 ? `(${numToShow})` : numToShow
        // Add number to show
        calcDisplay += numToShow
    }

    const calculateResult = (num1, num2, operation) => {
        const result = {
            '+': (num1 + num2),
            '-': (num1 - num2),
            'x': (num1 * num2),
            '/': (num1 / num2)
        }[operation]
        $('#calculatorResult').text(result)
    }
})
