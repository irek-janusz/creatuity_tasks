/**
 * PALINDROME
 */

const checkPalindrome = () => {
    let textToCheck = $('#palindromeTextArea').val()

    // Removes all white spaces and changes all characters to lower case, so that the palindrome check is case insensitive
    textToCheck = textToCheck.replace(/\s/g, '').toLowerCase()

    // If the length of the written text is zero, then show the warning to the user
    // Also, I assumed here that one letter/digit is not a palindrome
    if (textToCheck.length <= 1) {
        displayPalindromeResultMessage('Please, provide some text to check', 'alert-warning')
        return
    }

    // Creating a reverse text, by
    // 1. Changing the text into an array of separate characters (empty string is used as a value, so that each character is separate element)
    // 2. Reversing an order of an array (['a', 'b'] becomes ['b', 'a'])
    // 3. Mering an array back into string
    const reverseText = textToCheck.split('').reverse().join('')

    // Displays a result of palindrome check, based on the value
    // For simplicity, I chose to use one-line if-else statements
    if (textToCheck === reverseText) displayPalindromeResultMessage('The text is a palindrome', 'alert-success')
    else displayPalindromeResultMessage()
}

/**
 * Displays an alert to the user, informing if provided text was a palindrome
 * @param {String} message 
 * @param {String} alertStatus 
 */
const displayPalindromeResultMessage = (message = 'The text is not a palindrome', alertStatus = 'alert-danger') => {
    $('#palindromeAlert').removeClass('alert-success alert-danger alert-warning')
        .addClass(alertStatus)
        .text(message)
        .removeAttr('hidden')

    setTimeout(() => {
        $('#palindromeAlert').attr('hidden', true)
    }, 3000);
}

/**
 * When the value of textarea changes, this function would remove any displayed alerts (if any are being displayed)
 */
const palindromeTextAreaChange = () => {
    if (!$('#palindromeAlert').is(':hidden')) {
        $('#palindromeAlert').attr('hidden', true)
    }
}

/**
 * END OF PALINDROME
 */

 ////////////////////////////////////////////

/**
 * DECODER
 */

 /**
  * Hides an alert with a decoded/encoded message, when the text inside the <textarea> is deleted
  * @param {String} textArea - ID of a <textarea> to observe for changes
  * @param {String} alert - ID of an alert to hide
  */
 const textAreaChange = (textArea, alert) => {
    if ($(textArea).val().length === 0 && !$(alert).is(':hidden')) {
        $(alert).attr('hidden', true)
    }
 }

 const decodeMessage = () => {
     // Changes all whitespaces into 'standard' spaces between words
     // This eliminates an error I was getting when copying a text directly from PDF
     // Also ensure that the secret message can be written as 'one-letter-per-line'
     const message = $('#decoderTextArea').val().replace(/\s/g, ' ')
     if (message.length === 0) {
         displayMessage('#decoderAlert', 'alert-danger', 'Can\'t decode an empty message')
         return
     }
     
     // Inserts separate strings of numbers into an array
     const messageArray = message.split(' ')
     let decodedMessage = []

     // Iterating over an array of 'strings of numbers' and for each one of the strings:
     // - splits every string into an array of numbers
     // - using .reduce function, calculates the sum of all digits within the string
     // - inserts the ASCII value of calculated sum into 'decodedMessage' array
     messageArray.map(word => {
        word = word.split('')
        const sum = word.reduce((prev, cur) => parseInt(prev) + parseInt(cur))
        decodedMessage.push(String.fromCharCode(sum))
     })

     // Lastly - merges all letters/characters into a string and displays the message
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
    messageArray = messageArray.map(x => findSum(x, []))

    // Join encoded characters into string
    messageArray = messageArray.join(' ')

    const alertMessage = `Your encoded message: ${messageArray}`
    displayMessage('#encoderAlert', 'alert-warning', alertMessage)
 }

 /**
  * This function receives a number (ASCII value of a character) and an empty array
  * Its purpose is to return an array of digits, which summed up together will give us an initial number
  * This function is my 'encoding algorithm' for generating a string of digits for characters within the message
  * 
  * The function finds a random number between 1 and 9
  * Subtract this number from 'number'
  * And adds the number into an array
  * Function runs until 'number' is equal to 0
  * @param {Number} number - ASCII number of a character for encoding
  * @param {Array} arr - Array of numbers 
  */
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

 /**
  * 
  * @param {String} alert ID of alert to show
  * @param {String} type Type (success, warning, danger, etc.) of an alert
  * @param {String} message Message to display
  */
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

 // Probably a bit of an overkill for a simple calculator
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
        if (clickedValue === '+/-') {
            if ((!num2 && operation || !num1)) return
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

    /**
     * I observed that when I was trying to calculate percentage a multiple times,
     * JS would calculate weird results, e.g. 45 into % would be 0.45
     * Then 0.45 into % would result in 0.00004500000005
     * To ensure this doesn't happen, I keep a track of how many times the '%' was clicked
     * And I round the number to 'Num of Clicks' * 2 digits after the ','
     */
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

    /**
     * Appends a digit into an active number - either the first value or the second value
     * @param {String} clickedValue 
     */
    const setNumbers = (clickedValue) => {
        if (consecutivePercentageClicked) consecutivePercentageClicked = 0
        if (!num1 || !operation) {
            num1 += clickedValue
        }
        else if(num1 && operation) {
            num2 += clickedValue
        }
    }

    /**
     * Sets the most current operation for the calculator
     * Also, when two digits are present, and an operation button is clicked - it will calculate the result
     * @param {String} clickedOperation 
     */
    const setOperation = (clickedOperation) => {
        if (consecutivePercentageClicked) consecutivePercentageClicked = 0
        if (num1 && num2) {
            calculateResult(parseFloat(num1), parseFloat(num2), operation)
            num1 = $('#calculatorResult').text()
            num2 = ""
        }
        operation = clickedOperation
    }

    /**
     * Cleans a lastly selected operation or number
     */
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

    /**
     * Cleans everything
     */
    const cleanAll = () => {
        num1 = num2 = operation = ""
        $('#cleanBtn').text('C')
    }

    /**
     * Negates a most current number
     * For better visualisation - adds brackets around negated number
     * Additional calculations are required to ensure that these brackets are removed from the display
     */
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
            calcDisplay = calcDisplay.slice(0, (prevNumber.toString().length * (-1) - 2))
        }
        // Modify number to show
        numToShow = numToShow < 0 ? `(${numToShow})` : numToShow
        // Add number to show
        calcDisplay += numToShow
    }

    /**
     * Simply calculates a result of chosen operation
     * Since the function is protected by if statements before calling,
     * no extra protection inserted inside the function
     * @param {Number} num1 
     * @param {Number} num2 
     * @param {String} operation 
     */
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

/////////////////////////////////////////// END OF CALCULATOR




/////////////////////////////////////////// CRUD
$('document').ready(function() {
    const buttons = (id) => '<div class="buttons d-flex justify-content-between max-150"> \
        <button id="view'+id+'" onclick="handleClick(this.id)" role="button" class="btn btn-sm btn-outline-success">View</button> \
        <button id="delete'+id+'" onclick="handleClick(this.id)" role="button" class="btn btn-sm btn-outline-danger">Delete</button> \
        </div>'
    $.get('http://dummy.restapiexample.com/api/v1/employees', function(data) {
        if (data.status === 'success') {
            // This is only left here to demonstrate how I was populating the table before using datatables library
            // DataTables were used mainly for its pagination
            // Additionally, out of the box, we have searching and filtering functions
            // These codes can be swapped and everything will still work (except the pagination)

            // let trHtml = ''
            // $.each(data.data, function(i, item) {
            //     trHtml += '<tr><td>' + item.id + 
            //     '</td><td>' + item.employee_name + 
            //     '</td><td>' + (new Intl.NumberFormat().format(item.employee_salary)) + ' zł' +
            //     '</td><td>' + item.employee_age + '</td>' +
            //     '<td>' + buttons(item.id) + '</td>';
            // })
            // $('table tbody').append(trHtml)
            $('table').dataTable({
                fixedColumns: true,
                fixedHeader: true,
                data: data.data,
                columns: [
                    {data: 'id'},
                    {data: 'employee_name'},
                    {data: 'employee_salary'},
                    {data: 'employee_age'},
                    {data: 'id',
                    render: function(data) {
                        return buttons(data)
                    }}
                ]
            })

        }
    })

})

/**
 * Performs an action, based on the clicked button
 * @param {String} id ID of clicked button
 */
function handleClick(id) {
    if (id.includes('view')) {
        const employeeId = id.replace('view', '')
        viewEmployee(employeeId)
    } else {
        const employeeId = id.replace('delete', '')
        deleteEmployee(employeeId)
    }
}

/**
 * Opens a modal with employee's data
 * I know I could use data-target for triggering modals, but by using the method I wrote
 * I can populate the content of a modal dynamically
 * Normally, in React for instance, this would be some separate component which would get the data via props
 * @param {ID} id ID of an employee
 */
const viewEmployee = (id) => {
    $('#employeeModalBtn').text('Update')
    $('#employeeModalBtn').attr('onclick', "updateEmployee()")
    $.get('http://dummy.restapiexample.com/api/v1/employee/'+id, function(data) {
        const updateUrl = `http://dummy.restapiexample.com/api/v1/update/${id}`
        $('#updateEmployeeForm').attr('action', updateUrl) 
        $('#employeeName').val(data.data.employee_name)
        $('#employeeSalary').val(data.data.employee_salary)
        $('#employeeAge').val(data.data.employee_age)
        $('#viewModal').modal('show')
    })
}

/**
 * Opens a modal to create a user
 */
const openCreateModal = () => {
    cleanUp()
    $('#employeeModalBtn').text('Create')
    $('#updateEmployeeForm').attr('action', 'http://dummy.restapiexample.com/api/v1/create')
    $('#employeeModalBtn').attr('onclick', "createEmployee()")
    $('#viewModal').modal('show')
}

/**
 * Sends a request to create a new user
 */
const createEmployee = () => {
    const name = $('#employeeName').val()
    const salary = $('#employeeSalary').val()
    const age = $('#employeeAge').val()

    if (name && salary && age) {
        try {
            $.post($('#updateEmployeeForm').attr('action'), {name, salary, age}, function(data) {
                showAlertMessage('alert-success', `Employee ${name} successfully created`)
            })
        } catch (err) {
            showAlertMessage('alert-warning', 'Something went wrong')
        }
    }

    $('#viewModal').modal('hide')
}

/**
 * Sends a request to update an employee
 */
const updateEmployee = () => {    
    $.ajax({
        url: $('#updateEmployeeForm').attr('action'),
        type: 'PUT',
        data: {
            'name': $('#employeeName').val(),
            'salary': $('#employeeSalary').val(),
            'age': $('#employeeAge').val()
        },
        success: function() {
            showAlertMessage('alert-success', `Employee ${$('#employeeName').val()} has been updated`)
        },
        fail: function() {
            showAlertMessage('alert-danger', 'Server is currently unavailable. Please try again later')
        }
    })
    $('#viewModal').modal('hide')
}

/**
 * Opens a modal to confirm with a user if they want to remove an employee
 * @param {String} id ID of an Employee to remove
 */
const deleteEmployee = (id) => {
    $('#deleteBtn').attr('data-id', id)
    $('#deleteModal').modal('show')
}

/**
 * Sends a request to remove an employee from the database
 */
const removeEmployee = () => {
    $.ajax({
        url: `http://dummy.restapiexample.com/api/v1/delete/${$('#deleteBtn').attr('data-id')}`,
        type: 'DELETE',
        success: function(data) {
            showAlertMessage('alert-success', `Employee with ID ${$('#deleteBtn').attr('data-id')} has been removed`)
        },
        fail: function(data) {
            showAlertMessage('alert-danger', 'Server is currently unavailable. Please try again later')
        }
    })
    $('#deleteModal').modal('hide')
}

/**
 * @param {String} alert Type (success, warning, danger, etc.) of an alert
 * @param {String} message Message to display
 */
const showAlertMessage = (alert, message) => {
    $('#crudAlert')
        .attr('hidden', false)
        .removeClass('alert-warning alert-success alert-danger')
        .addClass(alert)
        .text(message)

    setTimeout(() => {
        if (!$('#crudAlert').is(':hidden')) {
            $('#crudAlert').attr('hidden', true)
        }
    }, 3000);
}

/**
 * Clears all input fields
 */
const cleanUp = () => {
    $('#employeeName').val('')
    $('#employeeSalary').val('')
    $('#employeeAge').val('')
}