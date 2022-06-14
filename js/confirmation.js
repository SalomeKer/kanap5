
let string = window.location.href;
let url = new URL(string);
let orderId = url.searchParams.get("id");
document.getElementById("orderId").innerHTML = `${orderId}`;

///*** Actualisation données ***///

localStorage.clear();