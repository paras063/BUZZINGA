const invoices=document.querySelectorAll("#invoices");

if(invoices){
for(const invoice of invoices){
const changeStatusBtn=invoice.querySelector("#changeStatus");
const mailInvoice=invoice.querySelector("#mailInvoice");
const invoiceId = invoice.querySelector("#invoiceId").innerHTML;
const printInvoiceBtn = invoice.querySelector("#printInvoice");

printInvoiceBtn.addEventListener("click",()=>{
  const invoiceID = invoiceId.trim()
   console.log(invoiceId);
  location.replace(`/printInvoice/${invoiceID}`);
  
})

changeStatusBtn.addEventListener("click",()=>{
  const status = invoice.querySelector("#selectStatus");
  status.classList.toggle("d-none")
  if(status.value){
    const body={
      _id:invoiceId.trim(),
      status:status.value
  }
  fetch('/updateStatus',{
      method:'Post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    }).then((res)=>res.json())
    .then((text)=>{
      location.reload();
    })
  }
})


//sending mail request
mailInvoice.addEventListener("click",(e)=>{

  e.preventDefault();
    const body={
        _id:invoiceId.trim()
    }
    fetch('/sendMail',{
        method:'Post',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      }).then((res)=>res.json())
      .then((text)=>{
        if(text.success){
          mailInvoice.textContent="Mailed";
          mailInvoice.disabled=true;
        }
      })
})
}
}

