/**
 * This file contains all JavaScript used by Pattern Friend on the
 * visitor's side of the website.
 * 
 * NOTE:
 * 1. Avoid jQuery and use vanilla JavaScript.
 */

function pf_hide(duration) {
    console.log(duration);
}

/**
 * Hide all the already hiddden elements when the DOM is ready.
 */
// Add an event listener to the document to run code when the DOM is ready.
document.addEventListener("DOMContentLoaded", function() {
    // Load the data from storage.
    let data = localStorage.getItem('pf_hidable') ? localStorage.getItem('pf_hidable') : '{}';
    // Convert data into a JavaScript object.
    data = JSON.parse(data);
    // Loop through each key in the data object.
    for (let key in data) {
        // Get the value of the key.
        let value = data[key];
        // Get the element with the ID of the key.
        let element = document.querySelector('[data-block-id="' + key + '"]');
        // If the element exists, hide it.
        if (element) {
            element.style.display = value ? 'none' : '';
        }
    }
});

