const submitBtn = document.getElementById("submitBtn");
const edit = document.getElementById("edit").value.trim();
const validationSuccess = document.getElementById("validationSuccess");
const validationFail = document.getElementById("validationFail");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const productName = document.getElementById("productName").value.trim();
  const firmId = document.getElementById("firmId").value.trim();
  const description = document.getElementById("description").value.trim();
  const size = document.getElementById("size").value.trim();
  const color = document.getElementById("color").value.trim();
  const price = document.getElementById("price").value.trim();
  const stock = document.getElementById("stock").value.trim();
  const productId = document.getElementById("productId").value.trim();
  
  const route= edit==true ? "/editproduct":"/addproduct";
  console.log(edit)
    console.log(route)
  const data = {
    productName,
    firmId,
    description,
    color,
    size,
    price,
    stock,
    productId
  };
  fetch(route, {
    method: "Post",
    body: JSON.stringify(data),
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
        validationSuccess.textContent = `Done.`;
        validationSuccess.classList.remove("d-none");
        validationFail.classList.add("d-none");
        setTimeout(() => {
          location.replace('/viewproduct')
        }, 2000);
      }
    });
});
