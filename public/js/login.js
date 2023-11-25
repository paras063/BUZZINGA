
const btnSignIn=document.getElementById('btnSignIn');
const validationSuccess = document.getElementById("validationSuccess");
const validationFail = document.getElementById("validationFail");

//recaptcha
function onClick(e) {
  e.preventDefault();
  grecaptcha.ready(function() {
    grecaptcha.execute('reCAPTCHA_site_key', {action: 'click'}).then(function(token) {
        // Add your logic to submit to your backend server here.
    });
  });
}

btnSignIn.addEventListener('click',(e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    console.log(password);
    fetch("/login",{
        method:"Post",
        body: JSON.stringify({
            email:email,
            password:password,
        }),
        headers:{
            "Content-Type": "application/json",
        },
    })
    .then((res)=>res.json())
    .then((data) =>{
      console.log(data)
      if(!data.success){
        validationFail.textContent = data.errorMessage;
        validationFail.classList.remove('d-none');
      }
        else if(data.success) {
          validationSuccess.textContent = `Successfully Logged In.`;
          validationSuccess.classList.remove("d-none");
          validationFail.classList.add('d-none')
          setTimeout(() => {
            location.reload();
          }, 800);
        }
      });
})