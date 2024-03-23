(function(){

    const loadingDiv = document.getElementById('loading');
    const repoDiv = document.getElementById('repo-div');

    const COLORS = ['#9e1c1c', '#7c75ca', '#c363b4', '#d88f39', '#5e8f4d']

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max-min + 1) + min)
    }

    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const myWork = document.querySelector('.my-work');

    let page = 1;

    function getRepos(page){

        var first = repoDiv.firstElementChild;
        while (first) {
            first.remove();
            first = repoDiv.firstElementChild;
        }

        fetch(`https://api.github.com/users/jdegand/repos?page=${page}&per_page=24&sort=updated`)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response failed')
        }
            return response.json()
        })
        .then(data => {
        loadingDiv.style.display = 'none';

        prevButton.disabled = page === 1 ? true : false;
        nextButton.disabled = page === 10 ? true : false;

        for (let {id, created_at, description, language, name, updated_at, html_url} of data) {
            
            const repoCard = document.createElement('div');
            repoCard.setAttribute('id', id);
            repoCard.classList.add('repo-card');
            
            const repoCardBackground = document.createElement('div');
            repoCardBackground.style.backgroundColor = COLORS[randomInt(0, COLORS.length - 1)];
            repoCardBackground.classList.add('repo-card-background');

            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noreferrer');
            link.setAttribute('href', html_url)
            link.innerText = name;

            const repoName = document.createElement('h3');

            repoName.append(link)

            const cardBody = document.createElement('div');

            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.innerText = description;
            descriptionParagraph.classList.add('playfair');
            descriptionParagraph.classList.add('bold');

            const languageParagraph = document.createElement('p')
            languageParagraph.innerText = language;

            const flexDiv = document.createElement('div')
            flexDiv.classList.add('flex-div')

            const span1 = document.createElement('span')
            span1.innerText = 'created ' + new Date(created_at).toLocaleDateString();

            const span2 = document.createElement('span')
            span2.innerText = 'updated ' + new Date(updated_at).toLocaleDateString();

            flexDiv.append(span1, span2)

            cardBody.append(descriptionParagraph, languageParagraph, flexDiv)

            repoCardBackground.append(repoName)
            
            repoCard.append(repoCardBackground, cardBody)
            repoDiv.append(repoCard)
        }
    })
        .catch(error => console.log(error))
    }

    getRepos(1);

    prevButton.addEventListener('click', ()=> {
        if(page === 1) return;
        page--;
        loadingDiv.style.display = 'flex';
        getRepos(page);
        myWork.scrollIntoView();
    })

    nextButton.addEventListener('click', ()=> {
        // 24 repos per page 
        if(page === 16) return;
        page++;
        loadingDiv.style.display = 'flex';
        getRepos(page);
        myWork.scrollIntoView();
    })

})()