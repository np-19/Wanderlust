const taxButton = document.querySelector('#tax-toggle');
let original = [];


if (taxButton) {
    taxButton.addEventListener('change', function() {    
    const price = document.querySelectorAll('.price');
  
     if (this.checked) {
        for (const el of price) {
        original.push(el.textContent);
        let num = Number(el.textContent.replace(/,/g, ''));
        num = Math.floor(num * 1.18);
        el.textContent = num.toLocaleString('en-IN');            
            
        }
    } else {
        let i = 0;                
        for (const el of price) {
        el.textContent = original[i];
        i++;       
        }
        original = [];
        
        
    }
    })
    
}




// search

const searchInput = document.querySelector('.search-input');
const autocompleteDiv = document.querySelector('.autocomplete');


function autocomplete(suggestions){
    autocompleteDiv.innerHTML = '';
                
                if (suggestions.length > 0) {
                    autocompleteDiv.style.display = 'block';
                    suggestions.forEach(suggestion => {
                        const div = document.createElement('div');
                        div.classList.add('autocomplete-item');
                        div.textContent = suggestion.title; // Or whatever field you want to show
                        div.addEventListener('click', () => {
                            searchInput.value = suggestion.title;
                            autocompleteDiv.style.display = 'none';
                        });
                        autocompleteDiv.appendChild(div);
                    });
                } else {
                    autocompleteDiv.style.display = 'none';
                }
}


async function fetchData(query){
    try {

    const response = await fetch(`/listings/results/search?search_query=${encodeURIComponent(query)}`);
    const suggestions = await response.json();
    return suggestions;

    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return [];    
    }
}




let timeout = null;

searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    clearTimeout(timeout);

    // Only make a request if the query is not empty
    if (query.length > 2) {
        timeout = setTimeout(async () => {
                let suggestions = await fetchData(query);
                autocomplete(suggestions);            
        }, 300); // Debounce the request by 300ms
    } else {
        autocompleteDiv.innerHTML = '';
        autocompleteDiv.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-div')) {
        autocompleteDiv.style.display = 'none';
    }
});

autocompleteDiv.addEventListener('click', async function(e) {
    e.stopPropagation();
    
    if(Array.from(this.children).includes(e.target)){
        const query = e.target.textContent;
        autocompleteDiv.style.display = 'none';
        window.location.href = `/listings/results?search_query=${encodeURIComponent(query)}`;
    }

})
