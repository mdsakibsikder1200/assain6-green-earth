let addToCart = [];

// Load categories
const loadCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayShow(data.categories));
};

// Display categories
const displayShow = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = `
    <li id="all" class="text-center md:text-left bg-[#15803d] text-white hover:bg-[#15803d]">All Trees</li>
  `;

  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
      <li id="${cat.category_id}" class="text-center md:text-left hover:bg-[#15803d]">${cat.category_name}</li>
    `;
  });

  // handle click
  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("#category-container li");
    allLi.forEach((li) => li.classList.remove("bg-[#15803d]", "text-white"));

    if (e.target.localName === "li") {
      e.target.classList.add("bg-[#15803d]", "text-white");
      if (e.target.id === "all") {
        loadAllPlant();
      } else {
        loadPlantCategory(e.target.id);
      }
    }
  });
};

// Load all plants
const loadAllPlant = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => AllPlantShow(data.plants));
};

// Show all plants
const AllPlantShow = (plants) => {
  const allPlantContainer = document.getElementById("all-plant-container");
  allPlantContainer.innerHTML = "";
  plants.forEach((plant) => {
    allPlantContainer.innerHTML += `
      <div id="${plant.id}" class="card bg-white p-2">
        <img src="${plant.image}" class="w-full md:w-[300px] h-[185px]" />
        <h1 onclick="loadModalDetail('${plant.id}')" class="font-bold">${plant.name}</h1>
        <p class="text-gray-700 text-[12px]">${plant.description.slice(0,100)}...</p>
        <div class="flex justify-between m-2">
          <button class="bg-[#86ecab] rounded-2xl">${plant.category}</button>
          <p><span>${plant.price}</span><i class="fa-solid fa-bangladeshi-taka-sign"></i></p>
        </div>
        <button class="bg-[#15803d] text-white w-full rounded-full p-1">Add to Cart</button>
      </div>`;
  });
  manageSpinner(false);
};

// Load plants category
const loadPlantCategory = (categoryId) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => displayPlant(data.plants));
};

// Display category plants
const displayPlant = (plants) => {
  const allPlantContainer = document.getElementById("all-plant-container");
  allPlantContainer.innerHTML = "";
  const plantContainer = document.getElementById("plant-container");
  plantContainer.innerHTML = "";

  plants.forEach((plant) => {
    plantContainer.innerHTML += `
      <div id="${plant.id}" class="card bg-white p-2">
        <img src="${plant.image}" class="w-full md:w-[300px] h-[185px]" />
        <h1 onclick="loadModalDetail('${plant.id}')" class="font-bold">${plant.name}</h1>
        <p class="text-gray-700 text-[12px]">${plant.description.slice(0,110)}...</p>
        <div class="flex justify-between m-2">
          <button class="bg-[#86ecab] rounded-2xl">${plant.category}</button>
          <p><span>${plant.price}</span><i class="fa-solid fa-bangladeshi-taka-sign"></i></p>
        </div>
        <button class="bg-[#15803d] text-white w-full rounded-full p-1">Add to Cart</button>
      </div>`;
  });
  manageSpinner(false);
};

// spinner
const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("plant-container").classList.add("hidden");
  } else {
    document.getElementById("plant-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// Add to Cart all plants
document.getElementById("all-plant-container").addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") addToCartHandle(e);
});

// Add to Cart category plants
document.getElementById("plant-container").addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") addToCartHandle(e);
});

// cart handle
const addToCartHandle = (e) => {
  const card = e.target.parentNode;
  const title = card.children[1].innerText;
  const price = card.children[3].children[1].children[0].innerText;
  const id = card.id;

  addToCart.push({ id, title, price });
  showAddToCart(addToCart);
};

// Show cart items and update total price
const showAddToCart = (addToCart) => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  let total = 0;
  for (const cart of addToCart) {
    total += parseFloat(cart.price);
    cartContainer.innerHTML += `
      <div class="bg-[#f0fdf4] p-1 mb-2 flex justify-between items-center">
        <div>
          <h1 class="font-bold">${cart.title}</h1>
          <p class="text-gray-700">
            <i class="fa-solid fa-bangladeshi-taka-sign"></i>
            <span>${cart.price}</span>
          </p>
        </div>
        <div>
          <button onclick="removeHandle('${cart.id}')"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>`;
  }

  // Update total price
  const totalSpan = document.querySelector("#add-to-cart > div.flex p span");
  if (totalSpan) totalSpan.innerText = total;
};

// Remove cart
const removeHandle = (cartId) => {
  addToCart = addToCart.filter((cart) => cart.id !== cartId);
  showAddToCart(addToCart);
};

// modal functionality
const loadModalDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  modalDetailShow(details.plant);
};

// modal show
const modalDetailShow = (modal) => {
  const modalBox = document.getElementById("modal-container");
  modalBox.innerHTML = `
    <div class="bg-white space-y-2">
      <h1 class="font-bold text-2xl">${modal.name}</h1>
      <img src="${modal.image}" class="w-full h-[200px]" />
      <h1><span class="font-bold">Category:</span> ${modal.category}</h1>
      <p class="text-gray-700 text-[12px]"><span class="font-bold">Price:</span> ${modal.price}</p>
      <p class="text-gray-700 text-[12px]"><span class="font-bold">Description: </span> ${modal.description}</p>
    </div>`;
  document.getElementById("my_modal_5").showModal();
};

// initial load
loadCategory();
loadAllPlant();
