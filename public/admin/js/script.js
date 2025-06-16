// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");
if(listButtonStatus.length > 0) {
  let url = new URL(window.location.href);

  // Bắt sự kiện click
  listButtonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      
      if(status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
  
  // Thêm class active mặc định
  const statusCurrent = url.searchParams.get("status") || "";
  const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
  if(buttonCurrent) {
    buttonCurrent.classList.add("active");
  }
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target.elements.keyword.value);
    
    const keyword = e.target.elements.keyword.value;

    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
// End form search

// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0) {
  let url = new URL(window.location.href);
  
  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      
      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}
// End Pagination

// Button Change Status
// const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
// if(listButtonChangeStatus.length > 0) {
//   listButtonChangeStatus.forEach(button => {
//     button.addEventListener("click", () => {
//       const link = button.getAttribute("link");
//       fetch(link, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then(res => res.json())
//         .then(data => {
//           if(data.code == 200) {
//             window.location.reload();
//           }
//         })
//     });
//   });
// }
// End Button Change Status

// Check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () =>{
    if(inputCheckAll.checked){
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      });  
    };

    inputsId.forEach((input) => {
      input.addEventListener("click", () =>{
        const countChecked = checkboxMulti.querySelectorAll(
          "input[name='id']:checked"
        ).length;

        if(countChecked == inputsId.length){
          inputCheckAll.checked = true;
        } else {
          inputCheckAll.checked = false;
        }
      });
    })
  });
}
// End Check box muliti

// form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit",(e) =>{
    e.preventDefault();
    
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if(typeChange == "delete-all"){
      const isConfirm = confirm("Bạn có muốn xóa tất cả không?");

      if(!isConfirm){
        return;
      }
    }
     console.log(typeChange);

    if(inputsChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      
      inputsChecked.forEach(input =>{
        const id = input.value;

        if(typeChange == "change-position"){
          const position = input
          .closest("tr")
          .querySelector("input[name='position']").value;
        ids.push(`${id}-${position}`);
        }else{
          ids.push(id);
        }

      });
      inputIds.value = ids.join(", ")

      formChangeMulti.submit();
    } else {
      alert("vui lòng chọn một bản ghi");
    }
  });
}
// end form change multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    console.log(e);
    const file = e.target.files[0];
    if(file){
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Upload Image

const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");


  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    console.log(sortKey);
    console.log(sortValue);

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);


    window.location.href = url.href;
  });
}

// Xóa sắp xếp
sortClear.addEventListener("click", () => {
  url.searchParams.delete("sortKey");
  url.searchParams.delete("sortValue");

  window.location.href = url.href;
});
// Thêm selected cho option
const sortKey = url.searchParams.get("sortKey");
const sortValue = url.searchParams.get("sortValue");

if (sortKey && sortValue) {
  const stringSort = `${sortKey}-${sortValue}`;
  console.log(stringSort);
  const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
  optionSelected.selected = true;
}

