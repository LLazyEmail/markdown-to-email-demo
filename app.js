const express = require("express");
const path = require("path");
const {
  generateHtmlFullTemplateHackernoon,
  generateReactFullTemplateHackernoon,
  generateHtmlFullTemplateRecipes,
} = require("@lazyemail/markdown-to-email");
var multiparty = require("multiparty");

const app = express();

const port = 9000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate", function (req, res, next) {
  var form = new multiparty.Form();

  let generateTo = "";
  let template = "";

  const file = {
    filename: null,
    bufferArray: [],
    totalLength: 0,
  };

  form.on("error", next);
  form.on("close", function () {
    const templateMap = {
      hackernoon: {
        html: generateHtmlFullTemplateHackernoon,
        react: generateReactFullTemplateHackernoon,
      },
      recipes: {
        html: generateHtmlFullTemplateRecipes,
      },
    };

    bufferFile = Buffer.concat(file.bufferArray, file.totalLength);
    const generator = templateMap[template][generateTo];

    if (!generator) {
      res.status(400).send('Sorry, cant find that');
      return;
    }

    const content = generator(bufferFile.toString());

    const extentionMap = {
      html: {
        ext: "html",
        contentType: "text/html",
      },
      react: {
        ext: "js",
        contentType: "application/javascript",
      },
    };

    const extentionData = extentionMap[generateTo];

    const filenameResult = `${file.filename}.${extentionData.ext}`;
    res.setHeader("Content-Type", extentionData.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filenameResult}"`
    );
    res.setHeader("filename", file.filename);

    res.send(content);
  });

  form.on("field", function (name, val) {
    if (name === "generateTo") {
      generateTo = val;
      return;
    }

    if (name === "template") {
      template = val;
      return;
    }
  });

  form.on("part", function (part) {
    if (!part.filename) return;
    if (part.name !== "markdownFile") return part.resume();
    file.filename = part.filename.slice(0, part.filename.length - 3);

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
