document.getElementById('seatForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const girls = parseInt(document.getElementById('girls').value);
  const boys = parseInt(document.getElementById('boys').value);
  const rows = parseInt(document.getElementById('rows').value);
  const benches = parseInt(document.getElementById('benches').value);
  const perBench = parseInt(document.getElementById('perBench').value);

  const totalBenches = rows * benches;
  const totalSeats = totalBenches * perBench;

  if (girls + boys > totalSeats) {
    alert("Not enough benches for all students.");
    return;
  }

  if (perBench !== 2) {
    alert("Only 2 students per bench are supported.");
    return;
  }

  let girlRolls = Array.from({ length: girls }, (_, i) => i + 1);
  let boyRolls = Array.from({ length: boys }, (_, i) => i + 1 + girls);

// Always pair 32-33 together
const fixedPair = [32, 33];
boyRolls = boyRolls.filter(n => !fixedPair.includes(n));
shuffle(boyRolls);

// Create random pairs for remaining boys
const boyPairs = [];

for (let i = 0; i < boyRolls.length; i += 2) {
  if (i + 1 < boyRolls.length) {
    boyPairs.push([boyRolls[i], boyRolls[i + 1]]);
  } else {
    boyPairs.push([boyRolls[i]]);
  }
}

// Add 32-33 pair
boyPairs.push([32, 33]);

// Shuffle the entire pair list so 32-33 appear at random place
shuffle(boyPairs);

  shuffle(girlRolls);

  // Ensure roll no 1 is paired (not alone)
  if (girlRolls.length % 2 !== 0) {
    if (girlRolls[0] === 1) {
      [girlRolls[0], girlRolls[1]] = [girlRolls[1], girlRolls[0]];
    } else if (girlRolls[girlRolls.length - 1] === 1) {
      let last = girlRolls.length - 1;
      [girlRolls[last - 1], girlRolls[last]] = [girlRolls[last], girlRolls[last - 1]];
    }
  }

  const output = document.getElementById('output');
  output.innerHTML = '';

  let girlIndex = 0;
  let boyIndex = 0;
  let benchCounter = 0;

  for (let r = 1; r <= rows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (let b = 1; b <= benches; b++) {
      benchCounter++;
      const bench = document.createElement('div');
      bench.classList.add('bench');

      let label = '';

      if ((benchCounter % 3 === 1 || benchCounter % 3 === 2) && boyIndex < boyPairs.length) {
        label = boyPairs[boyIndex].join(' - ');
        bench.classList.add('boys');
        boyIndex++;
      } else if (girlIndex + 1 < girlRolls.length) {
        label = `${girlRolls[girlIndex]} - ${girlRolls[girlIndex + 1]}`;
        bench.classList.add('girls');
        girlIndex += 2;
      } else if (boyIndex < boyPairs.length) {
        label = boyPairs[boyIndex].join(' - ');
        bench.classList.add('boys');
        boyIndex++;
      } else if (girlIndex < girlRolls.length) {
        label = `${girlRolls[girlIndex]}`;
        bench.classList.add('girls');
        girlIndex++;
      } else {
        label = `Empty`;
        bench.classList.add('empty');
      }

      bench.textContent = label;
      rowDiv.appendChild(bench);
    }

    output.appendChild(rowDiv);
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
