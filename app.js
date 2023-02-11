const express = require("express");
const path = require("path");

var multiparty = require("multiparty");

const app = express();

const port = 9000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/", function (req, res, next) {
  var form = new multiparty.Form();

  let generateTo = "";
  const file = {
    filename: null,
    bufferArray: [],
    totalLength: 0,
  };

  form.on("error", next);
  form.on("close", function () {
    const filename = "generated.md";
    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("filename", filename);

    bufferFile = Buffer.concat(file.bufferArray, file.totalLength);

    res.send(bufferFile);
  });

  form.on("field", function (name, val) {
    if (name !== "generateTo") return;
    generateTo = val;
  });

  form.on("part", function (part) {
    if (!part.filename) return;
    if (part.name !== "markdownFile") return part.resume();
    file.filename = part.filename;

    part.on("data", function (buf) {
      file.bufferArray.push(buf);
      file.totalLength += buf.length;
    });
  });

  form.parse(req);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
