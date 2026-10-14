// This is for the sake of opening and closing the cards
let cards = document.querySelectorAll(".cards");
let elem = document.querySelectorAll(".elem");
let back = document.querySelectorAll(".back");

cards.forEach(function(dets){
    dets.addEventListener("click", function(){
        let index = Number(dets.id) - 1;
        if(elem[index]) elem[index].style.display = "block";
    });
});

back.forEach(function(dets){
    dets.addEventListener("click", function(e){
        elem.forEach(function(elemchunk){
            elemchunk.style.display = "none";
        });
    });
}); 


// This is form validation & LocalStorage for to-do list

let form = document.querySelector("form");
let inp = document.querySelector("input");
let txt = document.querySelector("textarea");
let markimp = document.querySelector(".markimp input");
let removeTaskSection = document.querySelector(".remove-task");

// Get array from localStorage (or start empty if first time)
let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to render a task section in the UI
function renderTask(taskObj) {
    let added = document.createElement("section");
    added.classList.add("added");
    added.style.display = "flex";
    added.style.flexDirection = "column";

    let h1 = document.createElement("h1");
    let h2 = document.createElement("h2");
    h1.textContent = taskObj.title;
    h1.style.overflow = "auto";
    h1.style.display = "inline";

    if (taskObj.isImp === true) {
        h2.textContent = "Imp";
        h2.style.backgroundColor = "red";
        h2.style.color = "white";
        h2.style.fontSize = "10px";
        h2.style.padding = "5px";
        h2.style.borderRadius = "5px";
        h2.style.display = "inline";
        h2.style.width = "30px";
    } else {
        h2.textContent = "";
    }

    let p = document.createElement("p");
    p.textContent = taskObj.details;

    added.appendChild(h2);
    added.appendChild(h1);
    added.appendChild(p);

    let btn = document.createElement("button");
    btn.textContent = "Mark Task Completed";
    btn.style.padding = "20px";
    btn.style.width = "240px";
    btn.style.textWrap = "nowrap";
    btn.style.fontSize = "20px";
    added.appendChild(btn);

    // Delete task from UI & update LocalStorage
    btn.addEventListener("click", function () {
        added.remove();
        
        // Remove task from array by matching unique id
        tasksArray = tasksArray.filter(function(item) {
            return item.id !== taskObj.id;
        });
        
        // Update LocalStorage after deletion
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
    });

    removeTaskSection.appendChild(added);
}

// 1. Render all existing tasks on page reload
tasksArray.forEach(function(taskObj) {
    renderTask(taskObj);
});

// 2. Add new task on form submit
form.addEventListener("submit", function (dets) {
    dets.preventDefault();

    let taskObj = {
        id: Date.now(), // Unique ID to find and delete this item later
        title: inp.value,
        details: txt.value,
        isImp: markimp.checked
    };

    // Save object to array and update LocalStorage
    tasksArray.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));

    // Show task on UI
    renderTask(taskObj);

    form.reset();
});


// This is For the Daily Planner
// 1. Define your 24-hour time slots array
let timeSlots = Array.from({ length: 24 }, (_, i) => {
  const startHour24 = i;
  const endHour24 = (i + 1) % 24;

  const format12Hour = (hour) => {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${h}:00${ampm}`;
  };

  const format24Hour = (hour) => String(hour).padStart(2, '0') + ":00";

  return {
    id: i + 1,
    time: `${format12Hour(startHour24)} -${format12Hour(endHour24)}`,
    start: format24Hour(startHour24),
    end: format24Hour(endHour24 === 0 ? 24 : endHour24)
  };
});

// 2. Handle New Day Reset Logic via localStorage
const todayString = new Date().toISOString().split('T')[0]; // Gets YYYY-MM-DD
const lastSavedDate = localStorage.getItem('lastActiveDate');

if (lastSavedDate !== todayString) {
  // It's a brand new day! Clear the input data storage
  localStorage.removeItem('timeSlotData');
  localStorage.setItem('lastActiveDate', todayString);
}

// 3. Inject CSS dynamically for the plan layout matching your theme
const styleElement = document.createElement('style');
styleElement.textContent = `
  .plan-container {
    height: 80%;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 10px;
    margin-top: 20px;
  }
  .plan-container::-webkit-scrollbar {
    display: none;
  }
  .plan {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    background-color: var(--sec);
    border-radius: 12px;
    border: 1px solid var(--ter);
    width: 100%;
  }
  .plan .time {
    font-size: 10px !important;
    font-weight: bold;
    color: var(--quat);
    text-transform: uppercase;
    margin: 0;
  }
  .plan input[type="text"] {
    padding: 8px 12px;
    font-size: 16px;
    background-color: var(--tri);
    color: white;
    border: none;
    border-radius: 8px;
    outline: none;
  }
  .plan input[type="text"]:focus {
    border: 1px solid var(--quat);
  }
`;
document.head.appendChild(styleElement);

// 4. Function to render elements inside .plan-container
function renderPlanFull() {
  const planContainer = document.querySelector('.plan-container');
  
  if (!planContainer) {
    console.warn("Element with class 'plan-container' not found in the DOM.");
    return;
  }

  // Clear inner content of container so removed items get deleted automatically
  planContainer.innerHTML = '';

  // Load any saved input values for the current day
  let savedData = JSON.parse(localStorage.getItem('timeSlotData')) || {};

  timeSlots.forEach(slot => {
    // Create the plan section element
    const planSection = document.createElement('section');
    planSection.className = 'plan';
    planSection.dataset.id = slot.id;

    // Create time paragraph (forced to 10px font size)
    const timeP = document.createElement('p');
    timeP.className = 'time';
    timeP.textContent = slot.time;

    // Create text input with NO placeholder
    const inputField = document.createElement('input');
    inputField.type = 'text';

    // Restore text if it was typed earlier today
    if (savedData[slot.id]) {
      inputField.value = savedData[slot.id];
    }

    // Save input values to localStorage as the user types
    inputField.addEventListener('input', (e) => {
      let currentData = JSON.parse(localStorage.getItem('timeSlotData')) || {};
      currentData[slot.id] = e.target.value;
      localStorage.setItem('timeSlotData', JSON.stringify(currentData));
    });
    
    planSection.appendChild(timeP);
    planSection.appendChild(inputField);
    planContainer.appendChild(planSection);
  });
}

// 5. Initialize render when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPlanFull);
} else {
  renderPlanFull();
}




//This is where the motivation starts
let quote = document.querySelector(".quotebox p")
let author = document.querySelector(".motout #author")
async function motivation() {
  try {
    let response = await fetch("https://dummyjson.com/quotes/random")
    let data = await response.json()
    author.textContent = data.author
    quote.textContent = data.quote
  } catch (error) {
    console.error("Failed to fetch quote:", error)
  }
}
motivation();