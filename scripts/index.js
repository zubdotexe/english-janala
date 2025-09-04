const displayData = (lessons) => {
    // console.log('', lessons);
    const levelContainer = document.getElementById("level-container");
    
    for(const lesson of lessons) {
        
        btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Level ${lesson.level_no}</button>
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