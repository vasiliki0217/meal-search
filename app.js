const button = document.getElementById('btn');
const results = document.querySelector('.results');
const mealContainer = document.querySelector('.meal-container');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.querySelector('.modal-content');

const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

button.addEventListener("click", async () => {
    const foodSearch = document.getElementById('foodSearch').value;

    if (!foodSearch) {
        alert('Please enter a value');
        return;
    }

    results.innerHTML = '';

    const resultsMessage = document.querySelector('.results-h3');
    resultsMessage.innerHTML = `These are the results for "${foodSearch}":`;


    try {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(foodSearch)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(JSON.stringify(data));
        if (!data.meals) {
            resultsMessage.textContent = `No meals found for "${foodSearch}"`;
            return;
        }

        data.meals.forEach(meal => {
            const mealContainer = document.createElement("div");
            mealContainer.classList.add("meal");

            const mealImage = document.createElement("img")
            mealImage.src = meal.strMealThumb;
            mealContainer.appendChild(mealImage);

            const mealTitle = document.createElement("p");
            mealTitle.innerHTML = meal.strMeal;
            mealContainer.appendChild(mealTitle);

            mealImage.onclick = function () {
                modal.style.display = "block";

                document.body.classList.add("modal-active");

                modalContent.innerHTML = '';

                const mealImage = document.createElement("img")
                mealImage.src = meal.strMealThumb;
                modalContent.appendChild(mealImage);

                const mealTitle = document.createElement("h3");
                mealTitle.innerHTML = meal.strMeal;
                modalContent.appendChild(mealTitle);

                const mealIngredientsList = document.createElement("ul");
                const ingredientKeys = Object.keys(meal).filter(key =>
                    key.startsWith("strIngredient") && meal[key] && meal[key].trim());

                for (let i = 0; i < ingredientKeys.length; i++) {
                    const ingredientKey = ingredientKeys[i];
                    const measureKey = `strMeasure${ingredientKey.replace("strIngredient", "")}`;

                    const ingredient = meal[ingredientKey];
                    const measure = meal[measureKey];

                    const listItem = document.createElement("li");
                    listItem.textContent = `${measure ? measure : ""} ${ingredient}`;
                    mealIngredientsList.appendChild(listItem);
                }
                modalContent.appendChild(mealIngredientsList);


                const mealInstructions = document.createElement("p");
                mealInstructions.innerHTML = meal.strInstructions;
                modalContent.appendChild(mealInstructions);
            }
            results.appendChild(mealContainer);

            closeModal.onclick = function () {
                modal.style.display = "none";
                document.body.classList.remove("modal-active");
            }

        });


    } catch (error) {
        console.error(error);
    }

});
