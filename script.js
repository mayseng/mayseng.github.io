function setReps(count) {
  document.getElementById('reps').value = count;
}

function addSet() {
  const weight = document.getElementById('weight').value;
  const reps = document.getElementById('reps').value;

  if (weight && reps) {
    const history = document.getElementById('set-history');
    const entry = document.createElement('li');
    entry.textContent = `Weight: ${weight} lbs, Reps: ${reps}`;
    history.prepend(entry);

    document.getElementById('weight').value = '';
    document.getElementById('reps').value = '';
  } else {
    alert('Please enter both weight and reps.');
  }
}
