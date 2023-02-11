function downloadBlob(blob, name = "file.txt") {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  document.body.removeChild(link);
}

function onSubmitForm(e) {
  e.preventDefault();
  console.log("e", e);

  const myform = document.getElementById("myform");
  const formdata = new FormData(myform);

  fetch(`${window.origin}/`, {
    method: "POST",
    body: formdata,
  }).then((res) => {
    res
      .blob()
      .then((blob) => ({
        filename: res.headers.get("filename"),
        raw: blob,
      }))
      .then((result) => {
        downloadBlob(result.raw, result.filename);
      });
  });

  return false;
}
