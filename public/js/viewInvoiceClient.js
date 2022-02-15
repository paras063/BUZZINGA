const invoices=document.querySelectorAll("#invoices");

if(invoices){
for(const invoice of invoices){
const changeStatusBtn=invoice.querySelector("#changeStatus");
const selectStatus=invoice.querySelector("#selectStatus");
const mailInvoice=invoice.querySelector("#mailInvoice");
const invoiceId = invoice.querySelector("#invoiceId").innerHTML;


changeStatusBtn.addEventListener("click",()=>{
  const status = invoice.querySelector("#selectStatus").value;
  selectStatus.classList.toggle("d-none")
  if(status){
    const body={
      _id:invoiceId,
      status
  }
  fetch('/updateStatus',{
      method:'POST',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    }).then((res)=>res.json())
    .then((text)=>{
      location.reload();
    })
  }
})


//sending mail request
mailInvoice.addEventListener("click",()=>{
    const body={
        _id:invoiceId
    }
    fetch('/sendMail',{
        method:'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      }).then((res)=>res.json())
      .then((text)=>{
        console.log(text);
      })
})

}
}

