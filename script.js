// You can expand this later
document.querySelectorAll('.settings-btn')?.forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`${btn.textContent} clicked. (This feature can be implemented later)`);
  });
});

function goTo(page) {
  window.location.href = page;
}

function startWorkout(type) {
  localStorage.setItem('selectedWorkout', type);
  goTo('workout.html');
}

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('workout-title');
  const selectedWorkout = localStorage.getItem('selectedWorkout');
  if (title && selectedWorkout) {
    title.textContent = selectedWorkout + " Workout";
  }

  const startBtn = document.getElementById('startStopBtn');
  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');
  const statusLabel = document.getElementById('status-label');

  let timer;
  let running = false;
  let totalSeconds = 0;

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (running) {
        clearInterval(timer);
        startBtn.textContent = "Start Workout";
        statusLabel.textContent = "Paused";
      } else {
        timer = setInterval(() => {
          totalSeconds++;
          const mins = Math.floor(totalSeconds / 60);
          const secs = totalSeconds % 60;
          minutes.textContent = mins;
          seconds.textContent = secs.toString().padStart(2, '0');
          statusLabel.textContent = "Workout in progress...";
        }, 1000);
        startBtn.textContent = "Pause Workout";
      }
      running = !running;
    });
  }
});
