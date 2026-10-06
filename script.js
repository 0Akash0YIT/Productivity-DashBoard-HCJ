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
let markimp = document.querySelector(".markimp input ");
let removeTaskSection = document.querySelector(".remove-task");
form.addEventListener("submit", function (dets) {
    dets.preventDefault();
    let taskTitle = inp.value;
    let taskDetails = txt.value;
    let added = document.createElement("section");
    added.classList.add("added");
    added.style.display="flex";
    added.style.flexDirection="column"
    let h1 = document.createElement("h1");
    let h2 = document.createElement("h2");
    h1.textContent = taskTitle;
    h1.style.overflow="auto"
    h1.style.display="inline"
    let check=markimp.checked
    if(check===true){
        h2.textContent = "Imp";
        h2.style.backgroundColor="red"
        h2.style.color="white"
        h2.style.fontSize="10px"
        h2.style.padding="5px"
        h2.style.borderRadius="5px"
        h2.style.display="inline"
        h2.style.width="30px"
    }
    else{
        h2.textContent="";
    }
    let p = document.createElement("p");
    p.textContent = taskDetails;
    added.appendChild(h2);
    added.appendChild(h1);
    added.appendChild(p);
    removeTaskSection.appendChild(added);
    form.reset();
    let btn=document.createElement("button")
    btn.textContent="Mark Task Completed";
    btn.style.padding="20px"
    btn.style.width="240px"
    btn.style.textWrap="nowrap"
    btn.style.fontSize="20px"
    added.appendChild(btn);
    btn.addEventListener("click",function(){
        added.remove();
    })
});
