 const categoriesEl = document.getElementById("categories");
    const plantsEl = document.getElementById("plants");

    // Load Categories
    async function loadCategories() {
      const res = await fetch("https://openapi.programming-hero.com/api/categories");
      const data = await res.json();
      console.log("Categories API:", data);

      displayCategories(data.data);
    }

    function displayCategories(categories) {
      categoriesEl.innerHTML = "";
      categories.forEach((cat, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <button onclick="loadCategory('${cat.category_id}')" 
            class="w-full text-left px-3 py-2 rounded-lg border hover:bg-green-100 ${i===0 ? 'bg-green-600 text-white' : ''}">
            ${cat.category_name}
          </button>`;
        categoriesEl.appendChild(li);

        // প্রথম category default লোড হবে
        if (i === 0) loadCategory(cat.category_id);
      });
    }

    // Load plants by category
    async function loadCategory(id) {
      const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
      const data = await res.json();
      console.log("Plants API:", data);

      displayPlants(data.data);
    }

    function displayPlants(plants) {
      plantsEl.innerHTML = "";
      plants.forEach((plant) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow";
        card.innerHTML = `
          <img src="${plant.image}" class="h-40 w-full object-cover rounded-lg mb-3" />
          <h3 class="font-bold text-lg">${plant.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${plant.description?.slice(0,60) || ''}...</p>
          <span class="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">${plant.category || ''}</span>
          <p class="mt-2 font-semibold">৳${plant.price}</p>
          <button class="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add to Cart</button>
        `;
        plantsEl.appendChild(card);
      });
    }

    loadCategories();