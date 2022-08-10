const generateOtp = document.getElementById("generateOtp");
const email = document.getElementById("email").value.trim();
const inputOtp = document.getElementById("inputOtp");
const btnOtp = document.getElementById("btnOtp");

generateOtp.addEventListener('click',(e)=>{
    inputOtp.classList.remove("d-none");
    btnOtp.classList.remove("d-none");

    const otp = document.getElementById("otp").value.trim();
    const submitOtp = document.getElementById("sumbitOtp");

})