let newSearch = document.querySelector(".h2"); 
let pageTitle = document.querySelector(".h1");
const contentBook = document.getElementById("content");
const container = document.getElementById("myBooks");
const maPochListe = document.getElementById("poch-list");




//fonction bouton "ajouter un livre"
function addBookButton() {
 

  let addButton = document.createElement("div");
  
  addButton.innerHTML = `<div class="addBook">
      <button onclick="addSearchForm()" type="button" class="addButton"> Ajouter un livre </button>
    </div>`;

  container.appendChild(addButton);
  newSearch.after(addButton);
 
  }
  


function cancelSearch() {
  const addBookDiv = document.querySelector(".cancelButton");
  addBookDiv.innerHTML = `
  <button type="button" onclick="addSearchForm()" id="cancelButton" class="cancelButton"</button>`;
  newSearch.after(cancelButton);
  window.location.reload(false)
  
}
addBookButton();

// Initialisation
const books = JSON.parse(sessionStorage.getItem('myPochList'));
if (!books) {
  sessionStorage.setItem('myPochList', JSON.stringify([]));
} else {
  books.map((b) => {
    addBookToPochList(b, false);
  });
}



function createAllEventListener() {

//le bouton rechercher est relié à la fonction searchbook et le bouton annulé relié à la fonction cancelsearch
  document.getElementById('searchButton').addEventListener('click', function() {
    searchBook();
     
  })
  document.getElementById('cancelButton').addEventListener('click', function() {
      cancelSearch();
      // affichage de la pochlist
  })

}

// mise en page 
function addSearchForm() {
  const addBookDiv = document.querySelector(".addBook");
  addBookDiv.innerHTML = `
  <form id="search-card" onsubmit="searchResults(); return false;">
    <div class="form-group">
      <label class="bookTitle" for="title"> Titre du Livre </label>
    
      <input class="row-s-8 form-control" type="text" name="title" id="title" placeholder="Titre" > </br>
    
      <label class="bookAuthor" for="author">Auteur</label>
  
      <input class="form-control" type="text" name="author" id="author" placeholder="Auteur" > 
    
      <div class="button2"><br>
        <button type="button" id="searchButton" class="searchButton"> Rechercher </button>
      </div><br>

      <div class="button3">
        <button type="button" id="cancelButton" class="cancelButton"> Annuler </button>
      </div><br>
    </div>
  </form>`;
  createAllEventListener();
  
}

function clearResults(){

  $("#shower").children().remove();

}


function searchBook() {

  var url = "https://www.googleapis.com/books/v1/volumes?q=";
  var title= document.getElementById('title').value;
  console.log(title);
  url=url+title;
  var author= document.getElementById('author').value;
  console.log(author);
  url=url+author;
  //si pas de titre ou auteur afficher l'alert
  if (!title || !author) {
    alert('Veuiller préciser titre et auteur');
    return;

  }

  fetch(url)
    .then((res) => res.json())
    .then((results) => {
      const container  = document.getElementById('card-container');
      if (container) {
        container.parentElement.removeChild(container);
      }
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';
      cardContainer.id = 'card-container';
      const search = results.items;
      search.map((book) => {
      

      const card = document.createElement('div');
      card.className = 'card';

      const idBookCard = document.createElement('h4');
      idBookCard.innerText = "Id : " + book.id;
      idBookCard.className = 'card-id';

      const titleBookCard = document.createElement('h4');
      titleBookCard.innerText = "Titre : " + book.volumeInfo.title;
      titleBookCard.className = 'card-title';

      const authorBookCard = document.createElement('p');
      authorBookCard.innerText = "Auteur : " + book.volumeInfo.authors;
      authorBookCard.className = 'card-author';
      if (book.volumeInfo.authors > 1) {
        book.volumeInfo.authors = book.volumeInfo.authors.slice(0, 2);
      }

        const descriptionBookCard = document.createElement('p');
        descriptionBookCard.innerText = "Description : " + book.volumeInfo.description;
        descriptionBookCard.className = 'card-description';
        if (descriptionBookCard === '' || descriptionBookCard === 'undefined') {
          descriptionBookCard.innerText = "Information manquante";
        } else if (descriptionBookCard.innerText.length > 200) {
          descriptionBookCard.innerText = descriptionBookCard.innerText.substring(0, 200) + '...';
        }
        const bookMarks = document.createElement('i');
      
        const headerCard = document.createElement('div');
        headerCard.className = 'card-header';
        headerCard.appendChild(titleBookCard);
        headerCard.appendChild(bookMarks);

        const addBookmarkButton = document.createElement('div');
        addBookmarkButton.innerHTML = `
        <button type="button" id="addBookmarkButton" class="addBookmarkButton"> Ajouter </button>`;
        
  
      
      
        addBookmarkButton.onclick = function() {
          addBookToPochList(book, true);}

        card.appendChild(addBookmarkButton);

        const imgCard = document.createElement('img');
        imgCard.className = 'card-img';

        if (book.volumeInfo.imageLinks === null || book.volumeInfo.imageLinks === undefined) {
          imgCard.src = 'logos/unavailable.png';
        } else {
          imgCard.src = book.volumeInfo.imageLinks.thumbnail;

          
        }

      

  



        cardContainer.appendChild(card);
        card.appendChild(headerCard);
        card.appendChild(idBookCard);
        card.appendChild(authorBookCard);
        card.appendChild(descriptionBookCard);
        card.appendChild(imgCard);

        

      

      });
      //création page des résultats
      const titlePochList = document.createElement('h2');
      titlePochList.id = 'titlePochList';
      titlePochList.className = 'h2';
      titlePochList.innerHTML = "Résultats de la recherche";
      titlePochList.style.marginTop = "40px";
      const cardWrapper = document.createElement('div');
      cardWrapper.appendChild(titlePochList);
      cardWrapper.appendChild(cardContainer);
      content.insertBefore(cardWrapper, content.childNodes[0]);
    });

}

//fonction d'ajout de livre dans la pochlist
function addBookToPochList(book, bookToAdd) {
  const books = JSON.parse(sessionStorage.getItem('myPochList'));
  const found = books.find(e => e.id==book.id);
 
  if (found && bookToAdd ){
  
    alert('ce livre existe déjà dans votre pochlist');
    return;
}

  if(bookToAdd){
    books.push(book);
    sessionStorage.setItem('myPochList', JSON.stringify(books));
    
  }

  const pochList = document.getElementById('poch-container');
  
  const card = document.createElement('div');
  card.id = 'poch-' + book.id;
  card.className = 'card';
  const idBookCard = document.createElement('h4');
  idBookCard.innerText = "Id : " + book.id;
  idBookCard.className = 'card-id';

  const titleBookCard = document.createElement('h4');
  titleBookCard.innerText = "Titre : " + book.volumeInfo.title;
  titleBookCard.className = 'card-title';

  const authorBookCard = document.createElement('p');
  authorBookCard.innerText = "Auteur : " + book.volumeInfo.authors;
  authorBookCard.className = 'card-author';
  if (book.volumeInfo.authors > 1) {
    book.volumeInfo.authors = book.volumeInfo.authors.slice(0, 2);
  }

  const descriptionBookCard = document.createElement('p');
  descriptionBookCard.innerText = "Description : " + book.volumeInfo.description;
  descriptionBookCard.className = 'card-description';
  if (descriptionBookCard === '' || descriptionBookCard === 'undefined') {
    descriptionBookCard.innerText = "Information manquante";
  } else if (descriptionBookCard.innerText.length > 200) {
    descriptionBookCard.innerText = descriptionBookCard.innerText.substring(0, 200) + '...';
  }
      
  const headerCard = document.createElement('div');
  headerCard.className = 'card-header';
  headerCard.appendChild(titleBookCard);



  const removeButton = document.createElement('div');
  removeButton.innerHTML = `
  <button type="button" id="removeButton" class="removeButton"> Supprimer </button>`;

  removeButton.onclick = function() {
    const cardToDelete = document.getElementById('poch-'+book.id);
    cardToDelete.parentElement.removeChild(cardToDelete);

    let books = JSON.parse(sessionStorage.getItem('myPochList'));
    books = books.filter((b) => b.id != book.id);
    sessionStorage.setItem('myPochList', JSON.stringify(books));
  }

  card.appendChild(removeButton);

  const imgCard = document.createElement('img');
  imgCard.className = 'card-img';

  if (book.volumeInfo.imageLinks === null || book.volumeInfo.imageLinks === undefined) {
    imgCard.src = 'logos/unavailable.png';
  } else {
    imgCard.src = book.volumeInfo.imageLinks.thumbnail;
  }
  
  pochList.appendChild(card);
  card.appendChild(headerCard);
  card.appendChild(idBookCard);
  card.appendChild(authorBookCard);
  card.appendChild(descriptionBookCard);
  card.appendChild(imgCard);
}
