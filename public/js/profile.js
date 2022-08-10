const editBtn = document.getElementById("editProfile");
const validationSuccess = document.getElementById("validationSuccess");
const validationFail = document.getElementById("validationFail");

editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value.trim();
  const country = document.getElementById("country").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const address = document.getElementById("address").value.trim();
  fetch("/profile", {
    method: "Post",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      contact,
      city,
      state,
      country,
      pincode,
      address
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if(!data.success){
        validationFail.textContent = data.errorMessage;
        validationFail.classList.remove('d-none');
      }
      else if(data.success) {
        validationSuccess.textContent = `Profile Updated Succesfully.`;
        validationSuccess.classList.remove("d-none");
        validationFail.classList.add('d-none');
        setTimeout(()=>{
          location.reload();
        },3000)
      }
    });
});
