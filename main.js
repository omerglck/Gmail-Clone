// HTML'den getirdiklerimiz
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navigation = document.querySelector("nav");


// Olay izleyicisi
hamburgerMenu.addEventListener("click" , hideMenu);


// Navigasyonu açıp kapamaya yarayacak fonksiyon
function hideMenu(){
    /*
    classList.toggle():
    * Ona paramete olarak verdiğimiz class'ı
    * yoksa ekler varsa çıkarır.
    */
    navigation.classList.toggle("hide");
}

