
///*** recueillir les données de l’url ***///
fetch("http://localhost:3000/api/products")
.then((response) => response.json()) 
.then((res) => ConteneurProduits(res))

function ConteneurProduits (produits){


    for (let i = 0; i < produits.length; i++) {
    
    
    const imageUrl = produits[i].imageUrl
    const id = produits [i]._id
    const altTxt = produits [i].altTxt
    const name = produits [i].name
    const image = addImg(imageUrl, altTxt)
    const description = produits [i].description

    const anchor =  Ancre (id)
    const article = addArticle()  ///*** appelle de l'article ***///
    const h3 = addH3(name)
    const p = addP (description)
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
    appendChildren(anchor, article) 
}  
}

///*** changement du href de ("a") ***///
function Ancre (id){
    const anchor = document.createElement("a")
    anchor.href= "./product.html?id=" + id
    return anchor
}
///*** insertion de l'ancre dans Items ***///
function appendChildren(anchor, article){
    const items = document.querySelector("#items")
    items.appendChild(anchor)
    anchor.appendChild(article)
}

///*** insertion de l'article ***///
function addArticle(){
  const article = document.createElement ("article")   ///*** création de l'article ***///
  return article
}

function addImg(imageUrl, altTxt){
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
    
}
function addH3(name){
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("nomProduit")
    return h3
}
function addP(description){
    const p = document.createElement("p")
    p .textContent = description
    p .classList.add("descrptionProduit")
    return p
}