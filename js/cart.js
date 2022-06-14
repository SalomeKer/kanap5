///*** Récuperer les produits dans le local ***///
let panier = JSON.parse(localStorage.getItem("Panier"));

///*** Affichage des produits dans le panier et du prix ***///
panier.forEach((productData) => {
	
    ///*** récuperer les infos dans l'API à partir de l'id ***///
	fetch("http://localhost:3000/api/products/" + `${productData.id}`).then(response => response.json()).then(function(itemData) {
		
    ///*** affichage des produits du panier ***///
		document.getElementById("cart__items").innerHTML += `
                <article class="cart__item" data-id="${productData.id}" data-color="${productData.color}">
                    <div class="cart__item__img">
                        <img src="${itemData.imageUrl}" alt="${itemData.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${itemData.name}</h2>
                        <p>${productData.color}</p>
                        <p id="priceProduct">${itemData.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productData.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>`
		///*** fonction suppression ***///
		emptyCart = (id, color) => {
			panier = panier.filter(productData => {
				if (productData.id == id && productData.color == color) {
					return false;
				}
				return true;
			});
			localStorage.setItem("Panier", JSON.stringify(panier));
		};
		///*** fonction quantité ***///
		newQuantity = (productData, suppQuantity) => {
			productData.quantity = suppQuantity;
			localStorage.setItem("Panier", JSON.stringify(panier));
		};
		///*** bouton supprimer ***///
		document.querySelectorAll(".deleteItem").forEach(button => {
			// Pour chaque clique
			button.addEventListener("click", (element) => {
				let suppId = element.currentTarget.closest(".cart__item").dataset.id;
				let suppColor = element.currentTarget.closest(".cart__item").dataset.color;
				console.log(suppId);
				console.log(suppColor);
				///*** supprimer le produit ***///
				emptyCart(suppId, suppColor);
				console.log(panier);
				///*** Actualiser la page ***///
				window.location.reload();
			});
		});
		///*** modifier la quantité ***///
		document.querySelectorAll(".itemQuantity").forEach(inputQuantity => {
			inputQuantity.addEventListener("change", (element) => {
				let suppQuantity = element.currentTarget.closest(".itemQuantity").value;
				let id = element.currentTarget.closest(".cart__item").dataset.id;
				let color = element.currentTarget.closest(".cart__item").dataset.color;
				let myProduct = panier.find(element => (element.id === id) && (element.color === color));
				newQuantity(myProduct, suppQuantity);
				window.location.reload();
			});
		});
	});
});;
///*** calculer la somme total***///
if (panier !== null) {
	let totalProduct = 0;
	let totalPrice = 0;
	for (let productData of panier) {
		///*** quantité final***///
		let quantityCalc = parseInt(productData.quantity)
		totalProduct += quantityCalc;
		document.getElementById("totalQuantity").innerHTML = totalProduct;
		///*** prix final***///
		fetch("http://localhost:3000/api/products/" + `${productData.id}`).then(data => data.json()).then(function(itemData) {
			let priceCalc = itemData.price
			totalPrice += priceCalc * quantityCalc
			document.getElementById("totalPrice").innerHTML = totalPrice;
		});
	};
};
///*** fonction tableau des produit***///
let products = [];
if (panier !== null) {
	for (let product of panier) {
		let productId = product.id;
		products.push(productId);
	}
};
///*** FORMULAIRE ***///


///*** constantes stockant les données du formulaires***///
const stockageData = localStorage.getItem('contact');
const stockageDataForm = JSON.parse(stockageData);


///*** stockage des valeurs du localStorage dans le formulaire ***///
if (stockageDataForm == null) {} else {
	document.querySelector("#firstName").value = stockageDataForm.firstName;
	document.querySelector("#lastName").value = stockageDataForm.lastName;
	document.querySelector("#address").value = stockageDataForm.address;
	document.querySelector("#city").value = stockageDataForm.city;
	document.querySelector("#email").value = stockageDataForm.email;
}
///*** évenement au clic du bouton ***///
const buttonOrder = document.querySelector('#order');
buttonOrder.addEventListener('click', (element) => {
	element.preventDefault();
	if (panier.length === 0) alert("votre panier est vide")
	///*** Valeurs du formulaire pour le localStorage ***///
	const contact = {
		firstName: document.querySelector('#firstName').value,
		lastName: document.querySelector('#lastName').value,
		address: document.querySelector('#address').value,
		city: document.querySelector('#city').value,
		email: document.querySelector('#email').value
	}
	firstNameCheck(contact);
	lastNameCheck(contact);
	adressCheck(contact);
	cityCheck(contact);
	emailCheck(contact);
	if (firstNameCheck(contact) && lastNameCheck(contact) && adressCheck(contact) && cityCheck(contact) && emailCheck(contact)) {
		
        ///*** objet contact ---> localStorage ***///
		localStorage.setItem('contact', JSON.stringify(contact)) // stringify transforme l'objet en chaine de caractere
		
        ///*** les données du formulaire et produit sont stocké dans un objet envoyé vers le serveur ***///
		const dataServer = {
			products,
			contact
		}
		///*** Envoi des données (objet dataServer) vers le serveur ***///
		fetch("http://localhost:3000/api/products/order", {
			method: 'POST',
			body: JSON.stringify(dataServer),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
		}).then(response => response.json()).then(function(data) {
			window.location.href = "./confirmation.html?id=" + data.orderId;
		})
	} else {
		alert("Les champs du formulaire ne sont pas valides");
	};
});

///*** fonction regEx nom prénom ville***///
const regExFirstNameLastNameCity = (value) => {
	return /^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/.test(value);
}
///*** fonction regEx adresse ***///
const regExAdress = (value) => {
	return /^[a-zA-Z0-9-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/.test(value);
}
///*** fonction regEx email***///
const regExMail = (value) => {
	return /([\w\.]+@[\w\.]+\.{1}[\w]+)/.test(value);
}

///*** controle Email ***///
emailCheck = (contact) => {
	const theEmail = contact.email;
	if (regExMail(theEmail)) {
		document.querySelector('#emailErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#emailErrorMsg').textContent = "Veuillez renseigner une adresse email valide";
		return false;
	};
};
///*** controle Prénom ***///
firstNameCheck = (contact) => {
	const theFirstName = contact.firstName;
	if (regExFirstNameLastNameCity(theFirstName)) {
		document.querySelector('#firstNameErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#firstNameErrorMsg').textContent = "Veuillez renseigner un prénom valide";
		return false;
	};
};
///*** controle ville ***///
cityCheck = (contact) => {
	const theCity = contact.city;
	if (regExFirstNameLastNameCity(theCity)) {
		document.querySelector('#cityErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#cityErrorMsg').textContent = "Veuillez renseigner une ville valide";
		return false;
	};
};
///*** controle Nom ***///
lastNameCheck = (contact) => {
	const theLastName = contact.lastName;
	if (regExFirstNameLastNameCity(theLastName)) {
		document.querySelector('#lastNameErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#lastNameErrorMsg').textContent = "Veuillez renseigner un nom de valide";
		return false;
	};
};
///*** controle adresse ***///
adressCheck = (contact) => {
	const theAdress = contact.address;
	if (regExAdress(theAdress)) {
		document.querySelector('#addressErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#addressErrorMsg').textContent = "Veuillez renseigner une adresse valide";
		return false;
	};
};