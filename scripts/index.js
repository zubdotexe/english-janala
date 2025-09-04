const displayLevelWord = (words) => {

    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    words.forEach(word => {
        console.log('', word);
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-md p-10 space-y-5 text-center whitespace-normal break-words h-full">
                <h2 class="font-bold text-2xl">${word.word}</h2>
                <p class="font-bold">Meaning/Pronunciation</p>
                <p class="font-bangla font-semibold text-2xl text-gray-700">"${word.meaning}/${word.pronunciation}"</p>
                <div class="flex flex-col gap-2 sm:flex-row justify-between items-center">
                    <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `

        wordContainer.append(card);
    })
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // console.log('', url);
    
    fetch(url)
    .then(res => res.json())
    .then(level => displayLevelWord(level.data));
}

const displayData = (lessons) => {
    // console.log('', lessons);
    const levelContainer = document.getElementById("level-container");
    
    for(const lesson of lessons) {
        
        btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Level ${lesson.level_no}</button>
        `

        levelContainer.append(btnDiv);
    }
}

const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    
    fetch(url)
    .then(res => res.json())
    .then(data => displayData(data.data))
}

loadLessons();