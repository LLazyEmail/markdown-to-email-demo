function downloadBlob(blob, name = "file.txt") {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function onSubmitForm(e) {
  e.preventDefault();

  const errElement = document.getElementById("err");
  if (errElement.innerHTML) {
    errElement.innerHTML = "";
    errElement.removeAttribute("class");
  }

  const myform = document.getElementById("myform");
  const formdata = new FormData(myform);

  if (!formdata.get("markdownFile").name) {
    errElement.innerHTML = "Chose a file";
    errElement.setAttribute("class", "error");
    return;
  }

  fetch(`${window.origin}/generate`, {
    method: "POST",
    body: formdata,
  })
    .then((res) => {
      console.log("res", res);
      if (res.status === 400) {
        throw new Error("Error");
      }

      return res
        .blob()
        .then((blob) => ({
          filename: res.headers.get("filename"),
          raw: blob,
        }))
        .then((result) => {
          downloadBlob(result.raw, result.filename);
        });
    })
    .catch(() => {
      const errElement = document.getElementById("err");
      errElement.innerHTML = "Error";
      errElement.setAttribute("class", "error");
    });

  return false;
}
