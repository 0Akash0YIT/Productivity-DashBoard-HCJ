//This is for the sake of opening and closing the cards
let cards = document.querySelectorAll(".cards");
let elem = document.querySelectorAll(".elem");
let back = document.querySelectorAll(".back");

cards.forEach(function(dets){
    dets.addEventListener("click", function(){
        let index = Number(dets.id) - 1;
        elem[index].style.display = "block";
    });
});

back.forEach(function(dets){
    dets.addEventListener("click", function(e){
        elem.forEach(function(elemchunk){
            elemchunk.style.display = "none";
        })
    });
}); 


//This is form validation for to-do list

let form = document.querySelector("form");
let inp = document.querySelector("input");
let txt = document.querySelector("textarea");
let removeTaskSection = document.querySelector(".remove-task");
form.addEventListener("submit", function (dets) {
    dets.preventDefault();
    let taskTitle = inp.value;
    let taskDetails = txt.value;
    let added = document.createElement("section");
    added.classList.add("added");
    let h1 = document.createElement("h1");
    h1.textContent = taskTitle;
    h1.style.overflow="auto"
    let p = document.createElement("p");
    p.textContent = taskDetails;
    added.appendChild(h1);
    added.appendChild(p);
    removeTaskSection.appendChild(added);
    form.reset();
    let btn=document.createElement("button")
    btn.textContent="Delete Task";
    added.appendChild(btn);
    btn.addEventListener("click",function(dets){

    })
});
