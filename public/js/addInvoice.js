const validationFail=document.getElementById('validationFail');
const validationSuccess=document.getElementById('validationSuccess');

// get firmId to fetch products of the firm
const firmId = document.getElementById('firmId');

let items = []; // array of objects containing each item
let subtotal_price = 0; // total price of each items before tax

firmId.addEventListener('change',(e)=>{
  e.preventDefault();
  let listItem=[];
  items=[];
  subtotal_price=0;
  if(firmId.value)
  fetch(`/getItems/${firmId.value}`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if(!data.success){
      }
      else if(data.success) {

        listItem=data.items;

        const itemList = document.getElementById('itemList');
        itemList.innerHTML="";
        listItem.forEach((item)=>{
          itemList.innerHTML += `<option value="${item._id}">${item.name} | ${item.size} | ${item.color}</option>`
        })

        const addItemBtn = document.querySelector("#addItemBtn");
    
        addItemBtn.addEventListener("click", (e) => {
        e.preventDefault();
      //get data from input fields
      const itemId = document.querySelector("#itemId");
      const quantity = document.querySelector("#item_qty");

      const currentItem=listItem.find((item)=>{
        if(item._id==itemId.value.trim()) return item;
      })

      if(quantity.value.trim()>currentItem.stock){
        validationFail.classList.remove('d-none');
        validationFail.textContent=`Only ${currentItem.stock} items available in Stock.`;
        return;
      }
      if(quantity.value.trim()<1){
        validationFail.classList.remove('d-none');
        validationFail.textContent=`Choose Valid Quantity`;
        return;
      }
      validationFail.classList.add('d-none');


      let itemTotal = currentItem.price * quantity.value.trim(); // total price for each item
      const subTotal = document.getElementById('subTotal');

      // item object for each item
      const item = {
        itemId : currentItem._id,
        name:currentItem.name+' | '+currentItem.size+' | '+currentItem.color,
        quantity: quantity.value.trim(),
        unitPrice: currentItem.price,
        itemTotal: itemTotal,
      };
      subtotal_price += itemTotal; // updating total price after adding each item
      items.push(item); // pushing each item into items array
      display();
      subTotal.innerHTML = subtotal_price;
      itemId.value = '';
      quantity.value = '';
    });

    // function for dynamically inserting items in the list
    const display = () => {
      let S_No=1;
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      items.forEach((item) => {
        tbody.innerHTML += `<tr>
        <td>${S_No++}</td>
            <td class="item">
                <div class="d-flex">
                    <div class="justify-content-center"> ${item.name} <div
                            class="text-uppercase new">
                        </div>
            </td>
            <td>${item.quantity}</td>
            <td class="d-flex flex-column"><span class="red">${item.unitPrice}</span> </td>
            <td style="font-weight:bold;">${item.itemTotal}</td>
        </tr>`;
      });
    };
      }
    });

  });
  




const mainForm=document.getElementById('mainForm')
// form submission
mainForm.addEventListener("click", (e) => {
  e.preventDefault();
  const invoiceDate = document.getElementById("invoiceDate").value.trim();
  const dueDate = document.getElementById("dueDate").value.trim(); 
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const country = document.getElementById("country").value.trim();
  const note = document.getElementById("note").value.trim();
  const tax = document.getElementById("tax").value.trim();
  const discount = document.getElementById('discount').value.trim();

  const invoiceObject = {
    invoiceDate,
    dueDate,
    firmId:firmId.value,
    firstName,
    lastName,
    email,
    contact,
    address,
    city,
    state,
    country,
    pincode,
    items,
    tax,
    discount,
    totalAmt:subtotal_price+((subtotal_price*tax)/100)-((subtotal_price*discount)/100),
    note
  };
console.log(invoiceObject)
  fetch('/addInvoice', {
    method: "Post",
    body: JSON.stringify(invoiceObject),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        validationFail.textContent = data.errorMessage;
        validationFail.classList.remove("d-none");
      } else if (data.success) {
        validationSuccess.textContent = `Invoice Created Successfully.`;
        validationSuccess.classList.remove("d-none");
        validationFail.classList.add("d-none");
        setTimeout(() => {
          location.replace('/viewInvoice')
        }, 2000);
      }
    });
});
