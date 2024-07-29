const container = document.querySelector(".container");
const soundElement = document.getElementById("sort-sound");
const barCount = 30; // Using a more descriptive variable name
const array = []; // Descriptive name for the array
let isSorting = false; // Flag to track sorting progress

init();

// Set the audio to loop
soundElement.loop = true;

function init() {
  for (let i = 0; i < barCount; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function play() {
  const selectedSort = document.getElementById("sort-select").value;
  const copy = [...array];
  let moves;

  isSorting = true; // Set sorting flag to true

  switch (selectedSort) {
    case "bubble":
      moves = bubbleSort(copy);
      break;
    case "insertion":
      moves = insertionSort(copy);
      break;
    case "selection":
      moves = selectionSort(copy);
      break;
    case "merge":
      moves = mergeSort(copy);
      break;
    default:
      console.error("Invalid sort option");
  }

  soundElement.play(); // Play sound on start

  animate(moves);
}

function animate(moves) {
  if (moves.length === 0) {
    showBars();
    soundElement.pause();
    isSorting = false; // Reset sorting flag
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;

  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  // ... (omitted audio note code)

  showBars(move);
  setTimeout(() => animate(moves), 50); // Using arrow function for brevity
}

function bubbleSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < array.length - i - 1; j++) {
      moves.push({ indices: [j, j + 1], type: "comp" }); // Comparison
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        moves.push({ indices: [j, j + 1], type: "swap" }); // Swap
      }
    }
    if (!swapped) {
      break; // Already sorted
    }
  }
  return moves;
}

function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [minIndex, j], type: "comp" }); // Comparison
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      moves.push({ indices: [i, minIndex], type: "swap" }); // Swap
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return moves;
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    moves.push({ indices: [i, j], type: "comp" }); // Comparison for insertion

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      moves.push({ indices: [j + 1, j], type: "swap" }); // Swap during shifting
      j--;
      moves.push({ indices: [i, j], type: "comp" }); // Comparison for insertion
    }

    array[j + 1] = key;
  }
  return moves;
}


function quickSort(array) {
  const moves = [];
  function quickSortRecursive(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSortRecursive(arr, low, pi - 1);
      quickSortRecursive(arr, pi + 1, high);
    }
  }

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = (low - 1);

    for (let j = low; j < high; j++) {
      moves.push({ indices: [j, high], type: "comp" }); // Comparison
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        moves.push({ indices: [i, j], type: "swap" }); // Swap
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    moves.push({ indices: [i + 1, high], type: "swap" }); // Swap
    return i + 1;
  }

  quickSortRecursive(array, 0, array.length - 1);
  return moves;
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
