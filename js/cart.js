///*** Récuperer les produits dans le local ***///
let panier = JSON.parse(localStorage.getItem("Panier"));

///*** Affichage des produits dans le panier et du prix ***///
panier.forEach((produitCanap) => {
	
    ///*** récuperer les infos dans l'API à partir de l'id ***///
	fetch("http://localhost:3000/api/products/" + `${produitCanap.id}`).then(response => response.json()).then(function(productDetail) {
		
    ///*** affichage des produits du panier ***///
		document.getElementById("cart__items").innerHTML += `
                <article class="cart__item" data-id="${produitCanap.id}" data-color="${produitCanap.color}">
                    <div class="cart__item__img">
                        <img src="${productDetail.imageUrl}" alt="${productDetail.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${productDetail.name}</h2>
                        <p>${produitCanap.color}</p>
                        <p id="priceProduct">${productDetail.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitCanap.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>`
		
                ///*** fonction suppression ***///
		emptyCart = (id, color) => {
			panier = panier.filter(produitCanap => {
				if (produitCanap.id == id && produitCanap.color == color) {
					return false;
				}
				return true;
			});
			localStorage.setItem("Panier", JSON.stringify(panier));
		};
		
        ///*** fonction quantité ***///
		newQuantity = (produitCanap, suppQuantity) => {
			produitCanap.quantity = suppQuantity;
			localStorage.setItem("Panier", JSON.stringify(panier));
		};
		
        ///*** bouton supprimer ***///
		document.querySelectorAll(".deleteItem").forEach(button => {
			
            // Pour chaque clique
			button.addEventListener("click", (element) => {
				let removeId = element.currentTarget.closest(".cart__item").dataset.id;
				let removeColor = element.currentTarget.closest(".cart__item").dataset.color;
				console.log(removeId);
				console.log(removeColor);
				///*** supprimer le produit ***///
				emptyCart(removeId, removeColor);
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
	for (let produitCanap of panier) {
		///*** quantité final***///
		let quantityLap = parseInt(produitCanap.quantity)
		totalProduct += quantityLap;
		document.getElementById("totalQuantity").innerHTML = totalProduct;
		///*** prix final***///
		fetch("http://localhost:3000/api/products/" + `${produitCanap.id}`).then(data => data.json()).then(function(productDetail) {
			let priceCalc = productDetail.price
			totalPrice += priceCalc * quantityLap
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

///*** déclaration des variables contenant les données du localStorage ***///
const dataLocalStorage = localStorage.getItem('contact');
const dataLocalStorageObjet = JSON.parse(dataLocalStorage);
///*** stockage des valeurs du localStorage dans le formulaire ***///
if (dataLocalStorageObjet == null) {} else {
	document.querySelector("#firstName").value = dataLocalStorageObjet.firstName;
	document.querySelector("#lastName").value = dataLocalStorageObjet.lastName;
	document.querySelector("#address").value = dataLocalStorageObjet.address;
	document.querySelector("#city").value = dataLocalStorageObjet.city;
	document.querySelector("#email").value = dataLocalStorageObjet.email;
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
	checkFirstName(contact);
	checkLastName(contact);
	checkAdress(contact);
	checkCity(contact);
	checkEmail(contact);
	if (checkFirstName(contact) && checkLastName(contact) && checkAdress(contact) && checkCity(contact) && checkEmail(contact)) {
		
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
	return /^([a-zA-Zàâäèêëïîôöùûüç' ]+){3,20}$/.test(value);
}

///*** fonction regEx adresse ***///
const regExAdress = (value) => {
	return /^[a-zA-Z0-9éè, -]+$/.test(value);
}

///*** fonction regEx email***///
const regExMail = (value) => {
	return /^[0-9\a-z\.]+@([0-9\a-z]+\.)+[\a-z]{2,4}$/.test(value);
}

///*** controle Email ***///
checkEmail = (contact) => {
	const theEmail = contact.email;
	if (regExMail(theEmail)) {
		document.querySelector('#emailErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#emailErrorMsg').textContent = "L'adresse mail n'est pas valide";
		return false;
	};
};

///*** controle Prénom ***///
checkFirstName = (contact) => {
	const theFirstName = contact.firstName;
	if (regExFirstNameLastNameCity(theFirstName)) {
		document.querySelector('#firstNameErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#firstNameErrorMsg').textContent = "Le prénom n'est pas valide";
		return false;
	};
};

///*** controle ville ***///
checkCity = (contact) => {
	const theCity = contact.city;
	if (regExFirstNameLastNameCity(theCity)) {
		document.querySelector('#cityErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#cityErrorMsg').textContent = "La ville n'est pas valide";
		return false;
	};
};

///*** controle Nom ***///
checkLastName = (contact) => {
	const theLastName = contact.lastName;
	if (regExFirstNameLastNameCity(theLastName)) {
		document.querySelector('#lastNameErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#lastNameErrorMsg').textContent = "Le nom n'est pas valide";
		return false;
	};
};

///*** controle adresse ***///
checkAdress = (contact) => {
	const theAdress = contact.address;
	if (regExAdress(theAdress)) {
		document.querySelector('#addressErrorMsg').textContent = "";
		return true;
	} else {
		document.querySelector('#addressErrorMsg').textContent = "L'adresse n'est pas valide";
		return false;
	};
};