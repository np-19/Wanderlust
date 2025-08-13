function updateListing(listings) {
  listingsDiv.innerHTML = "";
  let htmlString = "";
  for (const listing of listings) {
    htmlString += `<a href="/listings/${listing._id}">
              <div class="card listing-card" >
                  <img src="${listing.image.url}" style="aspect-ratio: 1 / 1;" class="card-img-top" alt="...">
                  <div class="card-img-overlay"></div>
                  <div class="card-body">
                      <p class="card-text">
                          <b>${listing.title}</b>
                          <br>
                          <i class="fa-solid fa-indian-rupee-sign"></i> <span class="price">
             ${listing.price.toLocaleString('en-IN')}
          </span>  / night
                      </p>
                  </div>
              </div>
          </a>`;
  }
  listingsDiv.innerHTML = htmlString;
}

async function fetchAndRenderListings(category) {
  try {
    const response = await fetch(`/listings/results/filter?categories=${encodeURIComponent(category)}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const listings = await response.json();

    updateListing(listings);

    const allFilters = document.querySelectorAll(".filter");
    allFilters.forEach((f) => f.classList.remove("filter-active"));
    if (category) {
      const activeFilter = document.querySelector(`.filter[data-value="${category}"]`);
      if (activeFilter) {
        activeFilter.classList.add("filter-active");
      }
    }
  } catch (error) {
    console.error("Error fetching listings:", error.message);
  }
}

const filtersDiv = document.querySelector("#filters");
const listingsDiv = document.querySelector("#listings");

filtersDiv.addEventListener("click", async function (event) {
  if (event.target !== event.currentTarget) {
    const filterDiv = event.target.closest(".filter");
    const isActive = filterDiv.classList.contains("filter-active");

    let category = "";
    if (!isActive) {
      category = filterDiv.dataset.value;
    }

    fetchAndRenderListings(category);

    const newUrl = `/listings?categories=${category}`;
    history.pushState({ category: category }, "", newUrl);
  }
});

window.addEventListener("popstate", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("categories") || "";
  fetchAndRenderListings(category);
});


const urlParams = new URLSearchParams(window.location.search);
const initialCategory = urlParams.get("categories");

if (initialCategory && initialCategory.trim() !== "") {
  fetchAndRenderListings(initialCategory);
} 
