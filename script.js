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