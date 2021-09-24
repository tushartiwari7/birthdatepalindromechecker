
const inputEl = document.getElementById('date-input');
const btnEl = document.getElementById('submitbtn');
const formEl = document.getElementById('form');
const outputEl = document.getElementById('output-box');

let rawDate = {
    day: 5,
    month: 4,
    year: 2001
}

inputEl.addEventListener('change',e=> {
    let dateInput = e.target.value;
    deStructuredDate = dateInput.split('-');
    rawDate = {
        day: Number(deStructuredDate[2]),
        month: Number(deStructuredDate[1]),
        year: Number(deStructuredDate[0])
    }
    console.log(rawDate);
});  


const reverseStr = (str) => {
    return str.split('').reverse().join('');
}

const checkPalindrome = (str) => {
    return str === reverseStr(str);
}

const convertDateToStr = (date) => {

    return {
        day: date.day >9 ? '' + date.day : '0' + date.day,
        month:  date.month >9 ? '' + date.month : '0' + date.month,
        year: '' + date.year
    }
}

const getAllVariationsOfDate = (date) => {
    const dateInStr = convertDateToStr(date);
    return [
        dateInStr.day + dateInStr.month + dateInStr.year,  //ddmmyyyy
        dateInStr.month + dateInStr.day + dateInStr.year,  //mmddyyyy
        dateInStr.year + dateInStr.month + dateInStr.day,  //yyyymmdd
        dateInStr.day + dateInStr.month + dateInStr.year.slice(-2),  //ddmmyy
        dateInStr.month + dateInStr.day + dateInStr.year.slice(-2),  //mmddyy
        dateInStr.year.slice(-2) + dateInStr.month + dateInStr.day,  //yyyymmdd        
    ]
}

//  check palindromes for all date formats
const checkPalindromeforEachDateFormat = (date) => {
    const allFormats = getAllVariationsOfDate(date);
    
    let flag = false;
    allFormats.map((format)=> {
        return format === reverseStr(format);
    }).forEach(ispalindrome => ispalindrome ? flag = true : null)
    return flag;
}

const isLeapYear = (year) => {
    return year % 400 === 0 ? true : 
    year % 100 === 0 ? false :
    year % 4 === 0 ? true : false;
}

// input: date ,output: tomorrow's date
const getNextDate = ({day,month,year},bool = true) => {

    let daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];
    isLeapYear(year) ? daysInMonths[1] = 29 : null;
    
    if(bool) {   
        day++
        // if incremented date is equal to or greater than daysinMonth[currMonth] then set day to 1 and increment month by 1
        if(day > daysInMonths[month-1]) {
            month++
            day = 1
        }
        if(month > 12) {
            year++
            month = 1
        }
    }
    else {
        day--        
        if(day < 1 ) {
            if(month === 1) {
                day = daysInMonths[11];
                month = 12;
                year--;
            }
            else {
                day = daysInMonths[month-2];
                month--;
            }
        }
    }

    return {
        day,
        month,
        year
    };
}

const moveOn = (past,future) => {
    return checkPalindromeforEachDateFormat(future) ? false :
    checkPalindromeforEachDateFormat(past) ? false : true;
}
// this func is called if the birthdate is not a palindrome
const getNextPalindromeDate = (date) => {
    let counter = 0;
    let futureDate = date;
    let pastDate = date;

    while (moveOn(pastDate,futureDate)) {
        counter ++;
        futureDate = getNextDate(futureDate,true);
        pastDate = getNextDate(pastDate,false);
    }
    date = checkPalindromeforEachDateFormat(futureDate) ? futureDate : pastDate;
    return {counter, date};
}

formEl.addEventListener('submit',(e)=> {
    e.preventDefault();
    outputEl.style.display = 'block';
    outputEl.innerHTML="Processing..."
    // check if entered date is a palindrome
    setTimeout(() => {
        
        if(checkPalindromeforEachDateFormat(rawDate)) {
            outputEl.innerHTML = "Wowwww! Your Bithdate is a palindrome.";
        } 
        else {
            const nearestPalindromeDate = getNextPalindromeDate(rawDate);
            outputEl.innerHTML = `Oops! Your birthdate is not palindrome. Nearest palindrome date is ${nearestPalindromeDate.date.day}-${nearestPalindromeDate.date.month}-${nearestPalindromeDate.date.year}. You missed it by ${nearestPalindromeDate.counter} 
            ${nearestPalindromeDate.counter >1 ? 'days' : 'day'}.`;
        }
    }, 3000);
})
