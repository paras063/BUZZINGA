const btnCreateFirm = document.getElementById("createFirm");
const validationSuccess = document.getElementById("validationSuccess");
const validationFail = document.getElementById("validationFail");

btnCreateFirm.addEventListener('click',(e)=>{
    e.preventDefault();

    const name=document.getElementById('firmName').value.trim();
    const ownerId=document.getElementById('ownerId').value.trim();
    const email=document.getElementById('firmMail').value.trim();
    const address=document.getElementById('address').value.trim();
    const city=document.getElementById('city').value.trim();
    const state=document.getElementById('state').value.trim();
    const country=document.getElementById('country').value.trim();
    const pincode=document.getElementById('pincode').value.trim();
    const gstNo=document.getElementById('gstNo').value.trim();
    const contact=document.getElementById('firmContact').value.trim();
    const type=document.getElementById('type').value;
    console.log(ownerId);

    fetch("/firm", {
        method: "Post",
        body: JSON.stringify({
          name,
          ownerId,
          email,
          contact,
          city,
          state,
          country,
          pincode,
          address,
          type,
          gstNo
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
        .then((data) => {
          if(!data.success){
            validationFail.textContent = data.errorMessage;
            validationFail.classList.remove('d-none');
          }
          else if(data.success) {
            validationSuccess.textContent = `Firm Created Succesfully`;
            validationSuccess.classList.remove("d-none");
            validationFail.classList.add('d-none');
            setTimeout(()=>{
              location.reload();
            },2000)
          }
        });
})

