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

// Opens the modal to display the picture and description of the person
function OpenModal(pic_id, title, name) {
    // Promise to handle Async fetch operation of the text file of the person
    return new Promise(function(resolve) {

        // Dynamically Create the modal components
        const modal = document.createElement('dialog');
        modal.classList.add('modal');
    
        const card = document.createElement('div');
        card.classList.add('card-modal');
    
        const closebtn = document.createElement('button');
        closebtn.classList.add('circle');
        
        const pfp = document.createElement('div');
        pfp.classList.add('pfp');
        pfp.id = pic_id;
    
        const titleName = document.createElement('div');
        titleName.classList.add("title-name");
        titleName.textContent = title;
    
        const desc = document.createElement('div');
        desc.classList.add('desc');
    
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name');
        const nameHeading = document.createElement('h3');
        nameHeading.textContent = name;
        nameDiv.appendChild(nameHeading);
    
        const para = document.createElement("div");
        para.classList.add('para');

        // Fetch the text file of the person from static files storage
        fetch(`/static/text/${pic_id}.txt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                para.textContent = text;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        
        // Add components to DOM
        desc.appendChild(titleName);
        desc.appendChild(nameDiv);
        desc.appendChild(para);
        card.appendChild(pfp);
        card.appendChild(desc);
        card.appendChild(closebtn);
        modal.appendChild(card);
        
        document.body.appendChild(modal); // Append modal to the body
        modal.showModal();
        document.body.style.overflow = "hidden";
    
        resolve();    
    });

}

function closeDialog() {
    const modal = document.querySelector("dialog");
    console.log("we r in");
    console.log(modal);
    const btn = document.querySelector(".circle");
    btn.addEventListener("click", modalbtnhandler);
    
    //document.removeEventListener('click', handleClickOutside);
    //document.getElementById("overlay").style.display = "none";
}

function modalbtnhandler() {
    const btn = document.querySelector(".circle");
    btn.removeEventListener("click", modalbtnhandler);
    const modal = document.querySelector("dialog");
    console.log(modal);
    
    modal.close();
    modal.remove();
    console.log("closed");
    
    document.body.style.overflow = "visible";
    reset();
    
}

/*function handleClickOutside(event) {
    var dialog = document.querySelector('dialog');
    if (!dialog.contains(event.target)) {
        closeDialog();
    }
}*/

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

/*const modal = document.querySelector(".modal");
const modal_pfp = modal.querySelector(".pfp");
const modal_desc = modal.querySelector(".desc");
const modal_title = modal_pfp.querySelector(".title-name");
const modal_name_pro = modal_desc.querySelector(".name");
const modal_name = modal_name_pro.querySelector("h3");*/
function reset() {
    console.log("back here??");
    const openModalButtons = document.querySelectorAll(".openModal");

    openModalButtons.forEach((b) => {
        b.addEventListener('click', modalClickHandler);
    });
}



function modalClickHandler(event) {
    event.target.removeEventListener('click', modalClickHandler);
    //console.log("loding");
        //console.log(b.parentNode.querySelector(".name").querySelector("h3").textContent);
    OpenModal(event.target.parentNode.parentNode.querySelector(".pfp").id, event.target.parentNode.parentNode.querySelector(".pfp").querySelector(".title-name").textContent, event.target.parentNode.querySelector(".name").querySelector("h3").textContent).then(function() {
        closeDialog();
    });
           
        
        //circlebutton.addEventListener("click", closeDialog());
}


reset();