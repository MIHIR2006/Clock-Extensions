'use strict';

var digits = [];

function getTime() {
  var now = new Date();

  // Get the current hour in 12-hour format
  var hours = now.getHours();
  var suffix = hours >= 12 ? 'PM' : 'AM';  // Determine AM or PM
  hours = hours % 12;  // Convert to 12-hour format
  if (hours === 0) hours = 12;  // 12:00 instead of 0:00
  
  // Get minutes, seconds, and single digit milliseconds (only the first digit)
  var minutes = String(now.getMinutes()).padStart(2, '0');  // Pad minutes to 2 digits
  var seconds = String(now.getSeconds()).padStart(2, '0');  // Pad seconds to 2 digits
  var milliseconds = String(now.getMilliseconds()).padStart(3, '0').charAt(0);  // Take only the first digit of milliseconds
  
  // Return the formatted time as: h:mm:ss.sAM/PM (with spacing between parts)
  return hours + ' ' + minutes + ' ' + seconds + ' ' + milliseconds + suffix;  // Format: h mm ss S AM/PM
}

function createDigit() {
  var digit = document.createElement('digit');
  digit.innerHTML = '\
  <flap-top>          <n></n>   </flap-top>\
  <flap-top-flip>     <n></n>   </flap-top-flip>\
  <flap-bottom>       <n></n>   </flap-bottom>\
  <flap-bottom-flip>  <n></n>   </flap-bottom-flip>';
  return digit;
}

function flipDigitTo(digit, currentVal, updatedVal) {
  var topFlapNum        = digit.querySelector('flap-top > n'),
      topFlapFlip       = digit.querySelector('flap-top-flip'),
      topFlapFlipNum    = topFlapFlip.querySelector('n'),
      bottomFlapNum     = digit.querySelector('flap-bottom > n'),
      bottomFlapFlip    = digit.querySelector('flap-bottom-flip'),
      bottomFlapFlipNum = bottomFlapFlip.querySelector('n');

  topFlapNum.innerHTML = updatedVal;
  bottomFlapNum.innerHTML = currentVal;

  topFlapFlipNum.innerHTML = currentVal;
  topFlapFlip.style.display = 'block';

  setTimeout(function() {
    topFlapFlip.style.display = 'none';
  }, 300);

  setTimeout(function() {
    bottomFlapFlipNum.innerHTML = updatedVal;
    bottomFlapFlip.style.display = 'block';
  }, 300);

  setTimeout(function() {
    bottomFlapNum.innerHTML = updatedVal;
    bottomFlapFlip.style.display = 'none';
  }, 450);

  digit.setAttribute('current-val', updatedVal);
}

function updateClock() {
  var time = getTime(),
      staggerDelay,
      currentVal,
      updatedVal,
      i;

  for (i = 0; i < time.length; i+=1) {
    if(i === time.length-1) {
      staggerDelay = 0;
    } else {
      staggerDelay = Math.random() * 400;
    }
    currentVal = digits[i].getAttribute('current-val');
    updatedVal = time[i];
    if(currentVal !== updatedVal) {
      setTimeout(flipDigitTo, staggerDelay, digits[i], currentVal, updatedVal);
    }
  }
}

function setupClock() {
  var time = getTime(),
      staggerDelay,
      digit,
      i;

  for (i = 0; i < time.length; i+=1) {
    // Skip spaces for visual gap
    if (time[i] === ' ') continue;

    digit = createDigit();
    staggerDelay = Math.random() * 1000;
    document.body.appendChild(digit);
    setTimeout(flipDigitTo, staggerDelay, digit, null, time[i]);
  }
  digits = document.querySelectorAll('digit');
}

setupClock();
setInterval(updateClock, 10);  // Update every 10ms to show milliseconds
