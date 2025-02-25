document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const filterCategory = document.getElementById('filter-category');
    const filterGrade = document.getElementById('filter-grade');
    const filterSection = document.getElementById('filter-section');
    const essayList = document.querySelector('.essay-list');
    const podiums = document.querySelectorAll('.podium');

    const allEssays = Array.from(document.querySelectorAll('.essay-item'));

    let currentIndex = 0;

    function filterEssays() {
        // Get the filter values from the DOM
        const query = searchBar.value.toLowerCase();
        const category = filterCategory.value.toLowerCase();
        const grade = filterGrade.value.toLowerCase();
        const section = filterSection.value.toLowerCase();

        // Clear the essay list except for the table header
        essayList.innerHTML = `<div class="header">
                <h3 class="essay-name">Participant Name</h3>
                <p class="essay-grade">Grade</p>
                <p class="essay-section">Section</p>
                <p class="essay-category">Category</p>
            </div>`;

        // Filter essays by looping through each individual essay
        allEssays.forEach(essay => {
            // Extract values from the essay text and compare with the filters
            const matchesQuery = (query === '') || (essay.children[0].textContent.toLowerCase().includes(query));
            const matchesGrade = (grade === '') || (grade === essay.children[1].textContent.toLowerCase());
            const matchesSection = (section === '') || (section === essay.children[2].textContent.toLowerCase());
            const matchesCategory = (category === '') || (category === essay.children[3].textContent.toLowerCase());

            // If it matches all filters, append it back to the list
            if (matchesQuery && matchesGrade && matchesSection && matchesCategory) {
                essayList.appendChild(essay);
            }
        });
    }

    function showNextPodium() {
        podiums[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % podiums.length;
        podiums[currentIndex].classList.add('active');
    }

    searchBar.addEventListener('input', filterEssays);
    filterCategory.addEventListener('change', filterEssays);
    filterGrade.addEventListener('change', filterEssays);
    filterSection.addEventListener('change', filterEssays);

    // Initial fetch
    //filterEssays();

    setInterval(showNextPodium, 5000); // Change podium every 5 seconds
});