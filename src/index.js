let addToy = false;
const toysUrl = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", loadFunctions)
document.addEventListener("load", likeToy)

function loadFunctions(){
  fetchToys();
  submitToy();
}

function fetchToys() {
  fetch(toysUrl)
  .then(resp => resp.json())
  .then(toys => {
    for(let toy of toys) {
      const collection = document.querySelector('#toy-collection');
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
      <h2>${toy["name"]}</h2>
      <img class="toy-avatar" src=${toy["image"]}>
      <p>${toy["likes"]}</p>
      <button class="like-btn" id=${toy["id"]}>like</button>
      `
      collection.append(card);
    }
  })
  .then(likeToy)
};

function submitToy() {
  const toyForm = document.querySelector('form');
  toyForm.addEventListener('submit', postToy)
}

function postToy(e){
  e.preventDefault();
  let toyName = e.target.children[1].value;
  let toyImageUrl = e.target.children[3].value;
  fetch(toysUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      "name": toyName,
      "image": toyImageUrl,
      "likes": 0,
    })
  })  
}

function likeToy(){
  let likeBtns = document.getElementsByClassName('like-btn');
  for(let btn of likeBtns) {
    btn.addEventListener('click', updateLikes)
  }
}

function updateLikes(e){
  let likeId = e.target["id"];
  let totalLikes = e.target.previousElementSibling;
  newLikes = (parseInt(totalLikes.textContent, 10) + 1).toString();
  newLikes = newLikes.toString();
  console.log(newLikes)
  fetch(`${toysUrl}/${likeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(() => totalLikes.textContent = newLikes)
}