
let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("id");
document.getElementById("orderId").innerHTML = `${orderId}`;

///*** Actualisation données ***///

localStorage.clear();