var display = document.querySelector('#time');
var action = document.getElementById('btn-action');
var sessionDecrement = document.getElementById('session-decrement');
var sessionIncrement = document.getElementById('session-increment');
var breakDecrement = document.getElementById('break-decrement');
var breakIncrement = document.getElementById('break-increment');
var sessionLength = document.getElementById('session');
var breakLength = document.getElementById('break');
var clockTitle = document.getElementById('clock-title');
var time = document.getElementById('time');

var ONE_MINUTE = 60;

var defaultState = {
  session: 25 * 60,
  break: 5 * 60
};

var state = Object.assign({
  interval: null,
  running: false,
  status: 'session'
}, defaultState);

function displayTime (timer, dom) {
  var minutes;
  var seconds;

  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  dom.textContent = minutes + ':' + seconds;
}

function startCountDown (duration, display) {
  function resetInterval () {
    clearInterval(state.interval);

    state = Object.assign(state, {
      running: false
    }, defaultState);
  }

  // session
  function getTimerSession () {
    clockTitle.textContent = 'Session';
    displayTime(timer, display);
    timer = timer - step;
    state = Object.assign(state, {
      session: timer,
      status: 'session'
    });

    if (timer < 0) {
      resetInterval ();

      timer = state.break;
      startBreak();
    }
  }

  function getTimerBreak () {
    clockTitle.textContent = 'Break';
    displayTime(timer, display);
    timer = timer - step;
    state = Object.assign(state, {
      break: timer,
      status: 'break'
    });

    if (timer < 0) {
      resetInterval ();

      timer = state.session;
      startSession();
    }
  }

  function startSession (inmediately) {
    state = Object.assign(state, {
      interval: setInterval(getTimerSession, step * 1000),
      running: true
    });

    inmediately && getTimerSession();
  }

  //break
  function startBreak (inmediately) {
    state = Object.assign(state, {
      interval: setInterval(getTimerBreak, step * 1000),
      running: true
    });

    inmediately && getTimerBreak();
  }

  var timer = duration;
  var step = 1;

  if (state.status === 'session') {
    startSession(true);
  } else {
    startBreak(true);
  }
}

function stopTimer () {
  clearInterval(state.interval);

  state = Object.assign(state, {
    interval: null,
    running: false
  });
}

function getDuration () {
  var duration;
  if (state.status === 'session') {
    duration = state.session;
  } else {
    duration = state.break;
  }
  return duration;
}

action.addEventListener('click', function () {
  if (state.running) {
    action.classList.remove('is-clicked');
    stopTimer();
  } else {
    action.classList.add('is-clicked');
    startCountDown(getDuration(), display);
  }
});

function increment (what, value) {
  defaultState[what] += value;
  defaultState[what] = Math.min(defaultState[what], 30 * ONE_MINUTE);
  state = Object.assign(state, defaultState);
}

function decrement (what, value) {
  defaultState[what] -= value;
  defaultState[what] = Math.max(defaultState[what], 1 * ONE_MINUTE);
  state = Object.assign(state, defaultState);
}

sessionDecrement.addEventListener('click', function () {
  decrement('session', ONE_MINUTE);
  sessionLength.innerHTML = state.session / ONE_MINUTE;
  !state.running && displayTime(state.session, time);
});

sessionIncrement.addEventListener('click', function () {
  increment('session', ONE_MINUTE);
  sessionLength.innerHTML = state.session / ONE_MINUTE;
  !state.running && displayTime(state.session, time);
});

breakDecrement.addEventListener('click', function () {
  decrement('break', ONE_MINUTE);
  breakLength.innerHTML = state.break / ONE_MINUTE;
});

breakIncrement.addEventListener('click', function () {
  increment('break', ONE_MINUTE);
  breakLength.innerHTML = state.break / ONE_MINUTE;
});

displayTime(state.session, display);
breakLength.innerHTML = state.break / ONE_MINUTE;
sessionLength.innerHTML = state.session / ONE_MINUTE;
