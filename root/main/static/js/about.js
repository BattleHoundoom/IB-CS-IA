function changeCard(direction, sect) {
    var cards = document.querySelectorAll(sect + ' .card');
    var currentActiveIndex = Array.from(cards).findIndex(card => card.classList.contains('active'));
    
    cards[currentActiveIndex].classList.remove('active');
    cards[currentActiveIndex].classList.remove('show-active');
    cards[currentActiveIndex].classList.add('show');

    
    var nextIndex = (currentActiveIndex + direction + cards.length) % cards.length;

    cards[nextIndex].classList.remove('show');
    cards[nextIndex].classList.add('active');
    cards[nextIndex].classList.add('show-active');
}

function setActiveCard(index, sect) {
    var cards = document.querySelectorAll(sect + ' .card');

    
    cards.forEach(card => {
        if (card.classList.contains("active")) {
            card.classList.remove('active');
            card.classList.remove('show-active');
            card.classList.add('show');
        }
        
    });

    cards[index].classList.remove('show');
    cards[index].classList.add('active');
    cards[index].classList.add('show-active');


}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            if (entry.target.classList.contains("active")) {
                entry.target.classList.add("show-active");
            } else {
                entry.target.classList.add("show");
            }
        } else {
            entry.target.classList.remove("show");
            entry.target.classList.remove("show-active");
        }
    });
});

const hiddenElements = document.querySelectorAll(".card");
hiddenElements.forEach((card) => observer.observe(card));

