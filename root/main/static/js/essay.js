document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const filterCategory = document.getElementById('filter-category');
    const filterGrade = document.getElementById('filter-grade');
    const filterSection = document.getElementById('filter-section');
    const essayList = document.querySelector('.essay-list');
    const podiums = document.querySelectorAll('.podium');
    let currentIndex = 0;

    const allEssays = Array.from(document.querySelectorAll('.essay-item'));

    function filterEssays() {
        const query = searchBar.value.toLowerCase();
        const category = filterCategory.value.toLowerCase();
        const grade = filterGrade.value.toLowerCase();
        const section = filterSection.value.toLowerCase();
        //console.log(category == 'junior');
        //console.log(grade == '');
        //console.log(section == '');
        //console.log(query == '');

        // Clear the essay list
        essayList.innerHTML = `<div class="header">
                <h3 class="essay-name">Participant Name</h3>
                <p class="essay-grade">Grade</p>
                <p class="essay-section">Section</p>
                <p class="essay-category">Category</p>
            </div>`;

        // Filter essays
        allEssays.forEach(essay => {
            //const text = essay.textContent.toLowerCase();
            console.log(essay);
            console.log(essay.children[1].textContent.toLowerCase());
            console.log(grade);
            // Extract values from the essay text
            const matchesQuery = (query === '') || (essay.children[0].textContent.toLowerCase().includes(query));
            const matchesGrade = (grade === '') || (grade === essay.children[1].textContent.toLowerCase());
            const matchesSection = (section === '') || (section === essay.children[2].textContent.toLowerCase());
            const matchesCategory = (category === '') || (category === essay.children[3].textContent.toLowerCase());

            // If it matches all filters, append it back to the list
            console.log(matchesQuery);
            console.log(matchesGrade);
            console.log(matchesSection);
            console.log(matchesCategory);
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