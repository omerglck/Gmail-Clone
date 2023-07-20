//! importlar (diğer js dosyasından gelen değişken ve fonksiyonlar)
import {months,categories} from "./constants.js"
import { renderMails, showModal, renderCategories} from "./ui.js";

// localstorage'dan veri alma
const strMailData = localStorage.getItem("data")
//gelen string veriyi obje ve dizilere çevirdik 
const mailData = JSON.parse(strMailData)

//!dark mode ile değicekler
const btn = document.getElementById("toggle")
const body = document.getElementById("body")


console.log(mainArea)


//! HTML'den getirdiklerimiz
const hamburgerMenu = document.querySelector(".hamburger-menu"); 
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create");
const closeMailBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const form = document.querySelector("#create-mail-form")
const categoryArea = document.querySelector(".nav-middle")
const searchButton = document.querySelector("#search-icon")
const searchInput = document.querySelector("#search-input")


//! Olay izleyicisi
hamburgerMenu.addEventListener("click" , hideMenu);
/* ekranın yüklenme anında çalışır ve 
   renderMails fonksiyonu ile ekranın 
   hangi alanına ne basacağımızı kararlaştırdık.
*/

document.addEventListener("DOMContentLoaded", () => {
    renderCategories(categoryArea, categories, "Gelen Kutusu");

    renderMails(mailsArea,mailData)
    if(window.innerWidth < 1100){
        navigation.classList.add("hide")
    }
})
//modal işlemleri
createMailBtn.addEventListener("click",()=> showModal(modal,true))
closeMailBtn.addEventListener("click", ()=> showModal(modal,false))
// pencerenin genişliğini izleme
window.addEventListener("resize",(e)=>{
    const width = e.target.innerWidth;
    if(width < 1100){
        navigation.classList.add("hide")
    }else{
        navigation.classList.remove("hide")
    }
})
form.addEventListener("submit",sendMail)

// mail alanında olan tıklamaları izleme
mailsArea.addEventListener("click",updateMail);


//sidebar alanındaki tıklamalar
categoryArea.addEventListener("click",watchCategory)

//searchButtona olay izleyicisi
searchButton.addEventListener("click",searchMails)

//! Fonksiyonlar
// Navigasyonu açıp kapamaya yarayacak fonksiyon
function hideMenu(){
    /*
    classList.toggle():
    * Ona paramete olarak verdiğimiz class'ı
    * yoksa ekler varsa çıkarır.
    */
    navigation.classList.toggle("hide");
}

//tarih oluşturmak için tanımladığımız fonksiyon 
function getDate(){
    const today = new Date()
    
    const day = today.getDate()
    const ay = today.getMonth() + 1
    const year = today.getFullYear()
    //tarihi oluşturma
    const date = day + '/' + ay + '/' + year
    //ayın sırasına karşılık gelen ismi tanımladık
    const updateMonths = months[ay-1]

    // return [day,updateMonths].join(' ') iki yöntemde doğrudur
    return day + ' ' + updateMonths
}

// maili gönderme,mailin içi boş olduğunda bildirim gönderme
function sendMail(e){
    e.preventDefault(); // sayfanın yenilenmesini engeller
    //formun içierisinde yer alan inputların değerlerine erişme
    const receiver = e.target[0].value
    const title = e.target[1].value
    const message = e.target[2].value
    
    if(!receiver || !title || !message){
        //bildirim oluşturma
        Toastify({
            text:"Formu doldurunuz!",
            close:true,
            gravity:"top",
            position: "right",
            duration: 3000,
            stopOnFocus:true,//mouseu üzerine götürdüğümüzde kaybolmaz 
            style: {
                background: "rgb(255,204,0)",
                color:"#FFFFFF",
                borderRadius:"10px"

              },
        }).showToast();
       
       
        //bunlardan herhangi birinin içi boşsa alttaki kodların çalışmasını engellemeliyiz
        return;
    }

    //yeni mail objesi oluşturma
    const newMail = {
        id:new Date().getTime(), //idler benzersiz olmak zorundadır bu yüzden date objesi oluşturarak benzersiz bir sayı ürettik
        sender:"Ömer",
        receiver, //receicer:receiver yapabilirdik ama js kendisi tanıyor sadece receiver yazarsak
        title,
        message,
        stared:false,
        date:getDate()
    }
    //oluşturduğumuz objeyi dizinin en başına ekleme
    mailData.unshift(newMail);

    //todo veritabanını(localStorage) güncelleme
    //localStorage verileri string veri türünde tutar bu yüzden JSON yapısını stringe çevirmeliyiz
    const strData = JSON.stringify(mailData)
    //storage'a gönderdik
    localStorage.setItem("data",strData) //!key value ilişkisi data:anahtar strData:değeridir verisidir

    //ekranı güncellememiz gerek
    renderMails(mailsArea,mailData)
    //modalı kapat
    showModal(modal,false);

    //modalı temizle
    e.target[0].value = " ";
    e.target[1].value = " ";
    e.target[2].value = " ";

     //bildirim oluşturma
     Toastify({
        text:"Mail başarıyla gönderildi.",
        close:true,
        gravity:"top",
        position: "right",
        duration: 3000,
        stopOnFocus:true,//mouseu üzerine götürdüğümüzde kaybolmaz 
        style: {
            background: "rgb(34,187,51)",
            color:"#FFFFFF",
            borderRadius:"10px"

          },
    }).showToast();
   
}

//mail alanında bir tıklanma olduğunda çalışır
function updateMail(e) {
    //classList.contains
    if (e.target.classList.contains("bi-trash")) {
      //sileceğimiz mail elemanı belirledik
      const mail = e.target.parentElement.parentElement.parentElement;
      // id değerini bildiğimiz elemanı diziden çıkarma
      const mailId = mail.dataset.id;
      // id değerini bildiğimiz elemanı diziden çıkardık
      const filteredData = mailData.filter((i) => i.id != mailId);
  
      //diziyi localstorage tekrardan yüklemek için stringe çevirdik
      const strData = JSON.stringify(filteredData);
  
      //localstorage'dan veriyi kaldırdık
      localStorage.removeItem('data');
  
      //veriyi güncellenmiş haliyle localstorage'e yeniden kaydettik
      localStorage.setItem('data', strData);
      //! maili HTML'den kaldırdık
      mail.remove();
    }

    if(e.target.classList.contains("bi-star")){
        //güncellenecek maili belirledik
        const mail = e.target.parentElement.parentElement;
        
        //mailin dizideki verilerini bulmak için id sine erişme
        const mailId = mail.dataset.id;

        //id'sinden yola çıkarak mail objesini bulma
        const foundItem = mailData.find((i)=> i.id == mailId)
        
        //bulduğumuz elemanın stared değerini tersine çevirme
        const updatedItem = {...foundItem, stared: !foundItem.stared};
        
       //güncelleneck elemanın sırasını bulma
       const index = mailData.findIndex((i)=> i.id == mailId)
       
       //dizideki elemanı güncelleme
       mailData[index] = updatedItem;

       //güncel diziyi localstorage hazırlama
       //JSON.stringify(mailData)

       // local storage 'ı güncelleme
       localStorage.setItem("data", JSON.stringify(mailData))


       // HTML'i güncelleme
       renderMails(mailsArea,mailData);
      
    }
}

// kategorileri izleyip seçeceğimiz fonnksiyon
function watchCategory(e){
    const leftNav = e.target.parentElement
    const selectedCategory = leftNav.dataset.name

    // nav alanını update etme
    renderCategories(categoryArea, categories, selectedCategory)

    if(selectedCategory === "Yıldızlı"){
       // stared değeri true olanları seçme
        const filtred = mailData.filter((i)=>i.stared === true)
        //seçtiklerimizi ekrana basma
        renderMails(mailsArea,filtred)
        return;
    }
    // yıldızlı dışında bir kategoriye tıklanırsa hepsini gösterir
    renderMails(mailsArea,mailData)
}


//maili arama
function searchMails(){
    //arama terimini içeren mailleri alma
    const filtredArray = mailData.filter((i)=>i.message.toLowerCase().includes(searchInput.value.toLowerCase()))

    //mailleri ekrana basma
    renderMails(mailsArea,filtredArray)
}



//Dark mode


btn.addEventListener("click",darkMode)











//darkMode
function darkMode(){
    btn.classList.toggle('active')
    body.classList.toggle("darkMode");
}












    
/*
todo spread: Verdiğimiz objenin değerlerini başka bir objeye aktarabilir
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const mergedArray = [...arr1, ...arr2];
console.log(mergedArray); // [1, 2, 3, 4, 5, 6]

*/



