const createSynonym = (synonyms) => {
    const styledSyns = synonyms.map(syn => `<span class="btn">${syn}</span>`);
    return styledSyns.join(" ");
}

const displayWordDetails = (details) => {
    
    const modal = document.getElementById("my_modal_5");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="border-2 border-gray-100 p-3 rounded-lg break-words">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <h2 class="text-3xl font-bold">${details.word}</h2>
                    <h2 class="text-3xl font-bold">
                        (<span><i class="fa-solid fa-microphone-lines"></i></span>${details.pronunciation})
                    </h2>
                </div>
                <h2 class="font-bold mb-1">Meaning</h2>
                <p class="mb-4">${details.meaning ? details.meaning : "---"}</p>
                
                <h2 class="font-bold mb-1">Example</h2>
                <p class="mb-4">${details.sentence ? details.sentence : "---"}</p>

                <h2 class="font-semibold text-gray-600 mb-1">সমার্থক শব্দ গুলো</h2>
                <div class="flex flex-row flex-wrap gap-2">
                    ${createSynonym(details.synonyms)}
                </div>
            </div>
            
            <div class="modal-action justify-start">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-primary">Complete Learning</button>
            </form>
            </div>
        </div>
    `

    // modal.showModal();
}

const loadWordDetails = async (id) => {
    const modal = document.getElementById("my_modal_5");
    modal.innerHTML = `
        <div class="modal-box flex justify-center items-center h-2/4">
            <span class="loading loading-ring loading-xl"></span>
        </div>
    `
    modal.showModal();
    // manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/word/${id}`;    
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const heartify = (elem) => {
    // console.log('cl', elem);
    const favwordContainer = document.getElementById("favword-container");
    const card = document.createElement("div");
    const wordId = elem.parentElement.parentElement.id.split("-").pop();
    const word = elem.parentElement.querySelector("h2").innerText;
    
    if(elem.classList.contains("fa-regular")) {
        elem.classList.replace("fa-regular", "fa-solid");
        // console.log('word id', wordId);
        
        
        card.innerHTML = `
            <span id="fav-card-${wordId}" class="btn">${word}</span>
        `
        
        favwordContainer.classList.replace("hidden", "block");
        favwordContainer.querySelector("div").append(card);
        // console.log('', );
        
    }
    else if(elem.classList.contains("fa-solid")) {
        elem.classList.replace("fa-solid", "fa-regular");
        // console.log('fav container', favwordContainer);
        const favCards = favwordContainer.querySelector("div").querySelectorAll("div");
        // console.log('', favCards);
        
        favCards.forEach(ele => {
            console.log('iddd', ele);
            
            if(ele.firstElementChild.id.split("-").pop() === wordId) {
                // console.log('ele', ele);
                favwordContainer.querySelector("div").removeChild(ele)
            }
        })
    }
};

const displayLevelWord = (words) => {

    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0) {
        wordContainer.innerHTML = `
            <div class="col-span-3 text-center p-10 space-y-4">
                <img class="mx-auto" src="./assets/alert-error.png" alt="Alert error image">
                <p class="font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla text-4xl font-semibold">নেক্সট Lesson এ যান</h2>
            </div>
        `
        manageSpinner(false);
        return
    }

    words.forEach(word => {
        const card = document.createElement("div");
        // console.log('word', word);
        
        card.innerHTML = `
            <div id="card-id-${word.id}" class="bg-white rounded-md p-10 space-y-5 text-center whitespace-normal break-words h-full">
                <div class="relative flex flex-col sm:flex-row items-center justify-center">
                    <h2 class="font-bold text-2xl">${word.word}</h2>
                    <i class="btn-heart static sm:absolute right-0 cursor-pointer fa-regular fa-heart"></i>
                </div>
                <p class="font-bold">Meaning/Pronunciation</p>
                <p class="font-bangla font-semibold text-2xl text-gray-600">"${word.meaning ? word.meaning : "---"}/${word.pronunciation ? word.pronunciation : "---"}"</p>
                <div class="flex flex-col gap-2 sm:flex-row justify-between items-center">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `

        wordContainer.append(card);
    });

    manageSpinner(false);
}

const removeActive = () => {
    const activeBtns = document.querySelectorAll(".btn-lesson");

    activeBtns.forEach(btn => {
        btn.classList.remove("btn-active");
    })
}

const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    const wordContainer = document.getElementById("word-container");
    if(status) {
        spinner.classList.replace("hidden", "flex");
        wordContainer.classList.add("hidden");
    }
    else {
        spinner.classList.replace("flex", "hidden");
        wordContainer.classList.remove("hidden");
    }
}

const loadLevelWord = (id) => {
    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    
    fetch(url)
    .then(res => res.json())
    .then(level => {
        const clickBtn = document.getElementById(`btn-lesson-${id}`);
        removeActive();
        clickBtn.classList.add("btn-active");

        displayLevelWord(level.data);
    });
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    
    for(const lesson of lessons) {
        
        btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="btn-lesson-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary btn-lesson"><i class="fa-solid fa-book-open"></i>Level ${lesson.level_no}</button>
        `

        levelContainer.append(btnDiv);
    }
}

const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    
    fetch(url)
    .then(res => res.json())
    .then(data => displayLessons(data.data))
}

loadLessons();

document.querySelector("#btn-search-words").addEventListener("click", () => {
    removeActive();
    const query = document.querySelector("#input-search-words");
    const searchInput = query.value.trim().toLowerCase();
    
    manageSpinner(true);
    
    const url = "https://openapi.programming-hero.com/api/words/all";
    fetch(url)
    .then(res => res.json())
    .then(obj => {
        const words = obj.data;
        const filteredWords = words.filter(wordDetails => wordDetails.word.toLowerCase().includes(searchInput));
        
        const wordContainer = document.getElementById("word-container");
        wordContainer.innerHTML = "";

        if(searchInput === "" || filteredWords.length === 0) {
            wordContainer.innerHTML = `
                <div class="col-span-3 text-center p-10 space-y-4">
                    <img class="mx-auto" src="./assets/alert-error.png" alt="Alert error image">
                    <p class="font-bangla">এই Vocabulary এখনো যুক্ত করা হয়নি।</p>
                    <h2 class="font-bangla text-4xl font-semibold break-words">অন্য vocabulary search করুন</h2>
                </div>
            `
            manageSpinner(false);
            return;
        }
        
        displayLevelWord(filteredWords);
    })
});

document.getElementById("word-container").addEventListener("click", (e) => {
    
    if(e.target.closest("i")) {
        // console.log('clicked', e.target.parentElement.querySelector("h2"));
        
        heartify(e.target);
    }
})