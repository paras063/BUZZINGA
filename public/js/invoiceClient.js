
const addItemBtn = document.querySelector("#addItemBtn");
const subTotal = document.querySelector("#subtotal");
const mainForm = document.getElementById("invoice");
const items = []; // array of objects conating each item

let subtotal_price = 0; // total price of each items before tax

addItemBtn.addEventListener("click", () => {
  //get data from input fields
  const name = document.querySelector("#item_des");
  const quantity = document.querySelector("#item_qty");
  const unitPrice = document.querySelector("#item_price");

  let itemTotal = +unitPrice.value * +quantity.value; // total price for each item


  // item object for each item
  const item = {
    name:name.value,
    quantity: +quantity.value,
    unitPrice: +unitPrice.value,
    itemTotal: itemTotal,
  };
console.log(item);
  subtotal_price += itemTotal; // updating total price after adding each item
  items.push(item); // pushing each item into items array
  name.value = ''
  quantity.value = ''
  unitPrice.value = ''
  display(); 
});


// function for dynamically inserting items in the list
const display = () => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  items.forEach((item) => {
    tbody.innerHTML += `<tr>
        <td class="item">
            <div class="d-flex">
                <div class="pl-2"> ${item.name} <div
                        class="text-uppercase new">
                    </div>
        </td>
        <td>${item.quantity}</td>
        <td class="d-flex flex-column"><span class="red">${item.unitPrice}</span> </td>
        <td style="font-weight:bold;">${item.itemTotal}</td>
    </tr>`;
  });
  subTotal.innerHTML = subtotal_price;
};


// form submission
mainForm.addEventListener("submit", (e) => {
  //e.preventDefault();
  const invoiceDate = document.getElementById("invoiceDate").value;
  const dueDate = document.getElementById("dueDate").value;
  const PaymentTerms = document.getElementById("pTerms").value;
  const sellerAddress = document.getElementById("address").value;
  const sellerCity = document.getElementById("city").value;
  const sellerPincode = document.getElementById("pincode").value;
  const sellerCountry = document.getElementById("country").value;
  const customerName = document.getElementById("customerName").value;
  const customerEmail = document.getElementById("customerEmail").value;
  const customerAddress = document.getElementById("customerAddress").value;
  const customerCity = document.getElementById("customerCity").value;
  const customerPincode = document.getElementById("customerPincode").value;
  const customerCountry = document.getElementById("customerCountry").value;
  const note = document.getElementById("note").value;
  const tax = document.getElementById("tax").value;

  const invoiceObject = {
    invoiceDate,
    dueDate,
    PaymentTerms,
    sellerAddress:sellerAddress+","+sellerCity+"-"+sellerPincode+","+sellerCountry,
    customerName,
    customerEmail,
    customerAddress:customerAddress+","+customerCity+"-"+customerPincode+","+customerCountry,
    items,
    tax,
    totalAmt:subtotal_price-((subtotal_price*tax)/100),
    note
  };

  fetch('/',{
    method:'POST',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(invoiceObject),
  }).then((res)=>res.json())
  .then((text)=>{
    console.log(text);
  })
});

/* 
1. items : array Items
2. Total: after Tax
3. customer Details



if(invoicePaid){
  button Paid
}else{
  button UnPaid
}
*/