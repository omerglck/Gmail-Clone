//! importlar (diğer js dosyasından gelen değişken ve fonksiyonlar)
import {months} from "./constants.js"
import { renderMails, showModal } from "./ui.js";

// localstorage'dan veri alma
const strMailData = localStorage.getItem("data")
//gelen string veriyi obje ve dizilere çevirdik
const mailData = JSON.parse(strMailData)

//! HTML'den getirdiklerimiz
const hamburgerMenu = document.querySelector(".hamburger-menu"); 
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create");
const closeMailBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const form = document.querySelector("#create-mail-form")

//! Olay izleyicisi
hamburgerMenu.addEventListener("click" , hideMenu);
/* ekranın yüklenme anında çalışır ve 
   renderMails fonksiyonu ile ekranın 
   hangi alanına ne basacağımızı kararlaştırdık.
*/

document.addEventListener("DOMContentLoaded", () => renderMails(mailsArea,mailData))
//modal işlemleri
createMailBtn.addEventListener("click",()=> showModal(modal,true))
closeMailBtn.addEventListener("click", ()=> showModal(modal,false))

form.addEventListener("submit",sendMail)
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

function sendMail(e){
    e.preventDefault(); // sayfanın yenilenmesini engeller
    //formun içierisinde yer alan inputların değerlerine erişme
    const receiver = e.target[0].value
    const title = e.target[1].value
    const message = e.target[2].value
    
    //yeni mail objesi oluşturma
    const newMail = {
        id:new Date().getTime(), //idler benzersiz olmak zorundadır bu yüzden date objesi oluşturarak benzersiz bir sayı ürettik
        sender:"Ömer",
        receiver, //receicer:receiver yapabilirdik ama js kendisi tanıyor sadece receiver yazarsak
        title,
        message,
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
}




