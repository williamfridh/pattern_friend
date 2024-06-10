/**
 * This file contains all JavaScript used by Pattern Friend on the
 * visitor's side of the website.
 * 
 * NOTE:
 * 1. Avoid jQuery and use vanilla JavaScript.
 */

class PatternFriend {

    constructor() {
        this.hidable = this.get_storage();
        this.clear_storage();
    }

    /**
     * Clear storage of expired elements.
     */
    clear_storage() {
        // Get the current time.
        const currentTime = new Date().getTime();
        // Loop through the hidable object.
        for (const blockId in this.hidable) {
            // Check if the hide time is less than the current time.
            if (this.hidable[blockId] <= currentTime) {
                // Remove the element from the hidable object.
                delete this.hidable[blockId];
            }
        }
        // Save the storage object.
        this.save_storage();
    }

    /**
     * Get storage object.
     */
    get_storage() {
        const data = localStorage.getItem('pf_hidable') ? localStorage.getItem('pf_hidable') : '{}';
        return JSON.parse(data);
    }

    /**
     * Save storage object.
     */
    save_storage() {
        localStorage.setItem('pf_hidable', JSON.stringify(this.hidable));
    }

    /**
     * Hide all the already hiddden elements.
     */
    hide_groups() {
        // Loop through the hidable object.
        for (const blockId in this.hidable) {
            // Get the current time.
            const currentTime = new Date().getTime();
            // Check if the hide time is greater than the current time.
            if (this.hidable[blockId] > currentTime) {
                // Get the group element with the data-block-id attribute.
                const groupElement = document.querySelectorAll(`.pf-hidable[data-block-id="${blockId}"]`);
                // For each found element.
                groupElement.forEach((element) => {
                    // Hide the element.
                    element.style.display = 'none';
                });
            }
        }
    }

    /**
     * Hide parent group element for a ser duration of hours.
     */
    hide(element, duration) {
        // Get parent group element with the data-block-id attribute.
        const groupElement = element.closest('.pf-hidable[data-block-id]');
        // Check if the group element exists.
        if (!groupElement) return;
        // Get the data-block-id attribute value.
        const blockId = groupElement.getAttribute('data-block-id');
        // Get the current time.
        const currentTime = new Date().getTime();
        // Set the time to hide the element.
        const hideTime = currentTime + (duration * 60 * 60 * 1000);
        // Update the storage object.
        this.hidable[blockId] = hideTime;
        // Save the storage object.
        this.save_storage();
        // Hide elements.
        this.hide_groups();
    }

}

const patternFriend = new PatternFriend();

/**
 * Add an event listener to the document to run code when the DOM is ready.
 */
document.addEventListener("DOMContentLoaded", function() {
    patternFriend.hide_groups();
});

