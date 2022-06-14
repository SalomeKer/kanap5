///*** récupération URL actuelle ***///
let string = window.location.href;

///*** Renvoi ***///
let url = new URL(string);

///*** récupération de l'id du produit grace a l'URL actuelle ***///
let idProduit = url.searchParams.get("id");

///*** fusion de l'url et l'id ***///
let urlProduit = `http://localhost:3000/api/products/${idProduit}`;

///*** Insertion des produits dans la page ***///
fetch(urlProduit).then((response => response.json())).then(function(item) {
	
	///*** insertion de l'image ***///
	let img = document.createElement("img");
	document.querySelector(".item__img").appendChild(img);
	img.setAttribute("src", item.imageUrl);
	img.setAttribute("alt", item.altTxt);
	
	///*** insertion du titre ***///
	let name = document.querySelector("#title");
	name.textContent = item.name;
	
	///*** insertion du prix ***///
	let price = document.querySelector("#price");
	price.textContent = item.price;
	
	///*** insertion de la description ***///
	let description = document.querySelector("#description");
	description.textContent = item.description;
	
	///*** insertion des choix de couleurs + LOOP***///
	let colors = document.getElementById("colors");
	for (i = 0; i < item.colors.length; i++) {
		colors.innerHTML += `<option value="${item.colors[i]}">${item.colors[i]}</option>`;
	}
});
///*** LOCAL STORAGE ***///

///*** on déclare la fonction du bouton d'envoie***///
const button = document.querySelector("#addToCart");

///*** Écoute du bouton et envoie au panier***///
button.addEventListener('click', () => {
	
	///***  La couleur et la quantité choisis par l'utilisateur sont récupérés ***///
	let color = document.querySelector("#colors");
	let colorChoice = color.options[color.selectedIndex].text;
	let itemQuantity = document.querySelector("#quantity").value;
	
	///***  Alerte si champs non valides ***///
	if (color.selectedIndex == "" || itemQuantity == 0 || itemQuantity > 100) {
		alert("Veuillez sélectionner une couleur et une quantité entre 1 et 100 article")
	} else {
		window.location.href = "cart.html"
		
		///*** Fonction Stockage ***///
		saveCart = (panier) => {
			localStorage.setItem("Panier", JSON.stringify(panier));
		}
		
		///*** si le panier contient un item ***///
		getCart = () => {
			let panier = localStorage.getItem("Panier");
			
			///*** si le panier ne contient rien ***///
			if (panier == null) {
				return [];
			} else {
				return JSON.parse(panier);
			}
		}
		
		///*** Ajout des produits au panier ***///
		addCart = (product) => {
			let panier = getCart();
			
			///*** variable vérifiant si un produit à un id identique***///
			let foundProduct = panier.find(e => e.id == product.id);
			if (foundProduct != undefined) {
			
				///*** variable vérifiant si un produit à une couleur identique***///
				let foundColor = panier.find(e => e.color == product.color);
				if (foundColor != undefined) {
				
					///*** si le produit a une couleur et un id identique la quantité est modifiée ***///
					foundColor.quantity = foundColor.quantity + JSON.parse(itemQuantity);
				} else {
					product.quantity = JSON.parse(itemQuantity);
					panier.push(product);
				}
			
				///*** si ce n'est pas le cas, le produit est ajouté au panier***///  
			} else {
				product.quantity = JSON.parse(itemQuantity);
				panier.push(product);
			}
			saveCart(panier);
		}
		
		///*** lorsque l'utilisateur clique, les articles sont ajoutés ***/// 
		addCart({
			"id": idProduit,
			"quantity": itemQuantity,
			"color": colorChoice
		});
	}
});