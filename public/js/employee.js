const register = document.getElementById("register");
const validationSuccess = document.getElementById("validationSuccess");
const validationFail = document.getElementById("validationFail");

register.addEventListener("click", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const firmId = document.getElementById("firmId").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const address = document.getElementById("address").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  fetch("/addEmployee", {
    method: "Post",
    body: JSON.stringify({
      firstName,
      lastName,
      firmId,
      email,
      contact,
      city,
      state,
      country,
      pincode,
      address,
      password,
      confirmPassword
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(!data.success){
        validationFail.textContent = data.errorMessage;
        validationFail.classList.remove('d-none');
      }
      else if(data.success) {
        validationSuccess.textContent = `Employee has been created successfully.`;
        validationSuccess.classList.remove("d-none");
        validationFail.classList.add('d-none');
        setTimeout(()=>{
          location.replace('/viewUsers');
        },2000)
      }
    });
});
