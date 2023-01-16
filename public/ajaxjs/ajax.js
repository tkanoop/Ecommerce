function changeQuantity(cartId, productId, count) {
  let quantity = parseInt(document.getElementById(productId).value);
  count = parseInt(count);
  console.log('change quantity api called');
  $.ajax({
    url: '/changeQuantity',
    data:{
      cart: cartId,
      product: productId,
      count: count,
      quantity: quantity,
    },
    method: 'post',
    success:(response)=>{
      if (response.status) {
        location.reload()
      }
      if (response.stock) {
        Swal.fire({
          title: "Out of stock!",
          icon: "error",
          confirmButtonText: "continue",
        });
      }
    }
  })
}

function addToCart(proId) {
  const value = "sorry !!! currently out of stock";
  $.ajax({
    url: "/addToCart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cartCount").html();
        count = parseInt(count) + 1;
        
        $("#cartCount").html(count);
        Swal.fire({
          title: "Added to cart!",
          icon: "success",
          confirmButtonText: "continue",
        }).then(function () {
          location.reload()
        });
        
      }
      if (response.productExist) {
        Swal.fire({
          title: "Product exist in cart!",
          icon: "error",
          confirmButtonText: "continue",
        }).then(function () {
          location.reload()
        });
      }if(response.stock){
        Swal.fire({
          title: "Sorry!!! product out of stock .",
          icon: "error",
          confirmButtonText: "continue",
        }).then(function () {
          location.reload();
        });
      }
    },
  });
}


function removeProduct(cartId, productId) {
  $.ajax({
    url: "/removeProduct",
    data: {
      cart: cartId,
      product: productId,
    },
    method: "post",
    success: (response) => {
      Swal.fire({
        // title: "Product removed from cart!",
        // icon: "success",
        // confirmButtonText: "continue",
        title: 'Are you sure?',
        text: "Remove item from the cart",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      }).then(function (result) {
        console.log(result)
        location.reload();
      });
    },
  });
}

function addToWishlist(proId) {
  $.ajax({
    url: "/addToWishlist/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#wishCount").html();
        count = parseInt(count) + 1;
        $("#wishCount").html(count);
        Swal.fire({
          title: "Added to wishlist!",
          icon: "success",
          confirmButtonText: "continue",
        }).then(()=>{
          location.reload()
        });
      }
      if (response.productExist) {
        // Swal(resposnse.message);
        Swal.fire({
          title: "Alredy Exist in wishlist",
          icon: "error",
          confirmButtonText: "continue",
        }).then(()=>{
          location.reload()
        });
        // document.getElementById(proId).innerHTML="product already in wishlist";
        //  location.href = "/cart";
      }
      if (response.cart) {
        //  document.getElementById(proId).innerHTML =
        //    "product already in cart";
        Swal.fire({
          title: "Already Exist cart!",
          text: "Please visit cart",
          icon: "error",
          confirmButtonText: "continue",
        }).then(()=>{
          location.reload()
        });
      }
    },
  });
}

function addToCartWish(proId) {
  const value = "sorry !!! currently out of stock";
  $.ajax({
    url: "/addToCart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cartCount").html();
        count = parseInt(count) + 1;
        $("#cartCount").html(count);
        Swal.fire({
          title: "Product added to cart!",
          icon: "success",
          confirmButtonText: "continue",
        }).then(function () {
          location.reload();
        });
      }

  
    },
  });
}
function removeWishlistProduct(wishlistId, productId) {
  $.ajax({
    url: "/removewishlistProduct",
    method: "post",
    data: {
      wishlistId,
      productId,
    },
    success: () => {
      Swal.fire({
        title: "Product removed from wishlist!",
        icon: "success",
        confirmButtonText: "continue",
      }).then(function () {
        location.reload();
      });
    },
  });
}





function validateAddCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponError").innerHTML =
      "please enter product name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountError").innerHTML =
      "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxError").innerHTML = "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("exdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}
function validateEditCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponNameError").innerHTML =
      "please enter coupon name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountsError").innerHTML =
      "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxlError").innerHTML = "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("expdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}





function validateAddCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponError").innerHTML =
      "please enter product name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountError").innerHTML =
      "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxError").innerHTML = "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("exdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}
function validateEditCoupon(form) {
  let coupon = document.getElementById("coupon");
  let discount = document.getElementById("discount");
  let max = document.getElementById("max");
  let exdate = document.getElementById("exdate");
  if (coupon.value == "") {
    document.getElementById("couponNameError").innerHTML =
      "please enter coupon name";
    coupon.focus();
    return false;
  }
  if (discount.value == "") {
    document.getElementById("discountsError").innerHTML =
      "please enter your discount";
    discount.focus();
    return false;
  }
  if (discount.value < 0) {
    document.getElementById("discountError").innerHTML =
      "discount must be a positive value";
    discount.focus();
    return false;
  }
  if (max.value == "") {
    document.getElementById("maxlError").innerHTML = "please enter your max";
    max.focus();
    return false;
  }
  if (max.value < 0) {
    document.getElementById("maxError").innerHTML =
      "max must be a positive value";
    max.focus();
    return false;
  }
  if (exdate.value == "") {
    document.getElementById("expdateError").innerHTML = "please enter exdate";
    exdate.focus();
    return false;
  }
  if (exdate.value < 0) {
    document.getElementById("exdateError").innerHTML =
      "exdate must be a positive value";
    exdate.focus();
    return false;
  }
  return true;
}




// to generate pdf file

$('#menu-btn').click(() => {
  $('#menu').toggleClass('active');
});
$(document).ready(() => {
  $('#today-table').DataTable();
});
$(document).ready(() => {
  $('#month-table').DataTable();
});
$(document).ready(() => {
  $('#year-table').DataTable();
});

function CreatePDFfromHTML(id) {
  const HTML_Width = $(`#${id}`).width();
  const HTML_Height = $(`#${id}`).height();
  const top_left_margin = 15;
  const PDF_Width = HTML_Width + top_left_margin * 2;
  const PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  const canvas_image_width = HTML_Width;
  const canvas_image_height = HTML_Height;
  const totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
  html2canvas($(`#${id}`)[0]).then((canvas) => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      'JPG',
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height,
    );
    for (let i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        'JPG',
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height,
      );
    }
    pdf.save(
      'Sales_Report.pdf',
    );
  });
}

function sepDate(value) {
  $.ajax({
    url: '/admin/salesreport/customdate',
    data: {
      date: value,
    },
    method: 'post',
    success: (res) => {
      // document.getElementById('quantity').innerText = Number(qty) + Number(count);
      this.reload();
      // $('#quantity').load(`${document.URL} #quantity`);
    },
  });
}
