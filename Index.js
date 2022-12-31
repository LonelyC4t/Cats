// генерация HTML элемента для вставки на страницу 
function generationCard (cat) {
    let ages = "";
    
    if(cat.age === 1){
        ages = "год"
    } else if (cat.age > 1 && cat.age < 5){
        ages = "года"
    } else {ages="лет"}

    return  `<div data-card_id ="${cat.id}" class="card">
          <div class = image-container>
              <img class = "imageCat" src="${cat.image}" alt="${cat.name}">
          </div>
          <div class="card-body">
              <h4 class="card-title">${cat.name}</h4>
              <p class="card-description">${cat.age} ${ages}</p>
          </div>
          <div class = "btn-card">
              <button class = "btn show" data-action ="show"> Show </button>
              <button class = "btn delete" data-action ="delete"> Delete </button>
          </div>    
    </div>` 
    
};
// нужно больше переменных
const $addButton = document.querySelector(".ad button");
const $modalContainer = document.querySelector(".modal-container");
const $closeButton = document.querySelector("[data-btnClose]");
const $ShowcloseButton = document.querySelector("[data-showClose]");
const $wraper = document.querySelector("[data-cat]");
const $modalErr = document.querySelector(".modalErr");
const $btnErr = document.querySelector(".modalErr button");
let $container = document.querySelector(".container")
const api = new Api("leo");


//получаем id карточки по клику в глобальную переменную
let catId;
$container.addEventListener("click", (event)=>{
  catId = event.target.closest(".card").dataset.card_id; 
});


//функция заполняющая html элемент с подробной информацией 
async function showCat(id){

    let currentData = await (await api.getCat(id)).json();
    
    document.querySelector(".current-image").setAttribute("src", currentData.image);
    document.querySelector("#currentName").innerHTML = currentData.name;

    let ages = "";

        if(currentData.age===1){
            ages = "год"
        } else if (currentData.age > 1 && currentData.age < 5){
            ages = "года"
        } else {ages="лет"}

    document.querySelector("#currentAge").innerHTML = `${currentData.age} ${ages}`;

    document.querySelector("#currentDesc").innerHTML = currentData.description;

    if(currentData.favorite === true) {
        document.querySelector("#LikeMilk").innerHTML = "Большой любитель молока.";
    } else {document.querySelector("#LikeMilk").innerHTML = "Не самый большой любитель молока."};
    
    document.querySelector("#currentFish").innerHTML = `Съедает ${currentData.rate} рыбов в день.`
}

//ивенты для кнопок show и del
$wraper.addEventListener("click", (event)=>{
    
    switch(event.target.dataset.action){
        case "delete":
           let $currentCard = event.target.closest(".card");
           let catId =  $currentCard.dataset.card_id;
           api.delCat(catId)
           $currentCard.remove()
        break;

        case "show":
            let currentCatId = event.target.closest(".card").dataset.card_id;
            showCat(currentCatId);
            document.querySelector(".modal-show").classList.remove("hidden");
        break;
    }
    
});

//ивент закрытия модального окна с подробной инфо
$ShowcloseButton.addEventListener("click", ()=> {
    document.querySelector(".modal-show").classList.add("hidden");
    $ShowcloseButton.removeEventListener("click", ()=> {document.querySelector(".modal-show").classList.add("hidden")});
});

//закрытие мод окна по нажатию на пространство вокруг
let $modalshow = document.querySelector(".modal-show");
$modalshow.addEventListener("click", (event) => {
    
    if (event.target == document.querySelector(".modal-show")){
        document.querySelector(".modal-show").classList.add("hidden");
    }
    removeEventListener("click", (event) => {
        if (event.target == document.querySelector(".modal-show")){
        document.querySelector(".modal-show").classList.add("hidden");
    }});
});

//получаем всех котов на страницу
let getAllCats = async function () {

    try {
        let data = await (await api.getCats()).json();
        data.forEach(element => {
        $wraper.insertAdjacentHTML("beforeend", generationCard(element));
        }); 
        
    } catch {
        $modalErr.classList.remove("hidden")
        console.error("Сервер приуныл");
    }
}
getAllCats()

//много ивентов с кнопками
$addButton.addEventListener("click", ()=> {
    $modalContainer.classList.remove("hidden")
});

$btnErr.addEventListener("click", ()=>{
    $modalErr.classList.add("hidden");
    $btnErr.removeEventListener("click",()=>{
    $modalErr.classList.add("hidden")});
});

$closeButton.addEventListener("click", ()=>{
    $modalContainer.classList.add("hidden");
    $closeButton.removeEventListener("click", ()=>{$modalContainer.classList.add("hidden")});
    document.forms.catsForm.reset();
});

$modalContainer.addEventListener("click", (event)=> {
    event.stopPropagation()
    if (event.target == $modalContainer) {
        $modalContainer.classList.add("hidden");
        document.forms.catsForm.reset();
        
    }
    removeEventListener("click", (event)=> {
        if (event.target == $modalContainer) {
            $modalContainer.classList.add("hidden");
            document.forms.catsForm.reset();
    }   });
    
});

let $editBatton = document.querySelector("[data-editBatton]");
let $closeEditBtn = document.querySelector("[data-edbtnclose]");


$editBatton.addEventListener("click", (event)=> {
    
    document.querySelector(".modal-Edit").classList.remove("hidden");
});

$closeEditBtn.addEventListener("click", (event)=>{
    event.preventDefault()
    document.querySelector(".modal-Edit").classList.add("hidden");
});

//обновляем инфо о карточках на странице
let secondUpdate = async function(data) {
    await (api.addCat(data));
    $wraper.replaceChildren();
    await getAllCats();
}

//localStorage
let allDataFromStorage;
let parseDataFromStorage;

allDataFromStorage = localStorage.getItem(document.forms.catsEditForm.name, document.forms.catsEditForm.value);
parseDataFromStorage = allDataFromStorage ? JSON.parse(allDataFromStorage) : null;

document.forms.catsEditForm.addEventListener("input", (event)=>{
    let allDataF = Object.fromEntries(new FormData(document.forms.catsEditForm).entries());
    
    localStorage.setItem(document.forms.catsEditForm.name, JSON.stringify(allDataF));
});

if (parseDataFromStorage) {
    Object.keys(parseDataFromStorage).forEach(el => {
        document.forms.catsEditForm[el].value = parseDataFromStorage[el]
    })
};
    
//ивент submit мод окне добавления кота
document.forms.catsForm.addEventListener("submit", async (event)=>{
    event.preventDefault();

    let data = Object.fromEntries(new FormData(event.target).entries());
    data.age = Number(data.age);
    data.id = Number(data.id);
    data.rate = Number(data.rate);
    data.favorite = data.favorite == "on";

    secondUpdate(data);
    
    $modalContainer.classList.add("hidden");
});

//обновляем инфо о коте
function editUpdate(body, id){
    api.updCat(body, id);
    showCat(catId);
};
 
//ивент модалки редактирования 
document.forms.catsEditForm.addEventListener("submit", async (event)=>{
    event.preventDefault();

    let data = Object.fromEntries(new FormData(event.target).entries());
    data.age = Number(data.age);
    data.rate = Number(data.rate);
    data.favorite = data.favorite == "on";

    secondUpdate(data);

    editUpdate(data, catId);

    showCat(catId);
    
   document.querySelector(".modal-Edit").classList.add("hidden");

   document.forms.catsEditForm.reset();
        
});



