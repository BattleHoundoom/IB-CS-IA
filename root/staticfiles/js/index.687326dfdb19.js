document.addEventListener('DOMContentLoaded', () => {
    const interval = 5000;  // 5 seconds
    const container = document.querySelector('.b-articles');
    

    async function fetchNewArticles() {
        const response = await fetch('/get_random_articles/');
        const data = await response.json();
        return data.articles;
    }

    async function fadeOutCards(cards) {
        for (const card of cards) {
            card.classList.add('fade-out');
            await new Promise(resolve => setTimeout(resolve, 750));  // wait for the fade-out animation
        }
    }

    async function fadeInCards(cards, newArticles) {
        for (let i = 0; i < cards.length; i++) {
            cards[i].querySelector('img').src = `${newArticles[i].photo}`;
            cards[i].parentElement.href = newArticles[i].link;
            cards[i].querySelector('h2').textContent = newArticles[i].title;
            cards[i].classList.remove('fade-out');
            cards[i].classList.add('fade-in');
            await new Promise(resolve => setTimeout(resolve, 750));  // wait for the fade-in animation
            cards[i].classList.remove('fade-in');
        }
    }

    async function swapArticles() {
        const articles = await fetchNewArticles();
        const cards = container.querySelectorAll('.altar');

        await fadeOutCards(cards);
        await fadeInCards(cards, articles);
        setTimeout(swapArticles, interval);
    }

    setTimeout(swapArticles, interval);
});