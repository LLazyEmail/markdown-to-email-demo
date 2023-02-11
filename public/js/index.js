function onSubmitForm(e) {
  e.preventDefault();
  console.log("e", e);

  const myform = document.getElementById("myform");
  const formdata = new FormData(myform);

//   for (const [key, value] of formdata) {
//     console.log(key, " --- ", value);
//     // output.textContent += `${key}: ${value}\n`;
//   }
  //   .blob()
  //   .then((blob) => {
  //     return {
  //       contentType: res.headers.get("Content-Type"),
  //       raw: blob,
  //     };
  //   })
  //   .then((result) => {
  //     console.log("result", result);
  //   })
  fetch(`${window.origin}/`, {
    method: "POST",
    headers: {
      // 'Content-Type': 'application/json'
      //   "Content-Type": "application/x-www-form-urlencoded",
      //   "Content-Type": "multipart/form-data",
    },
    body: formdata,
  }).then((res) => {
    console.log(res);
  });

  return false;
}
