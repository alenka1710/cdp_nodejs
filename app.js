require("babel-core")
  .transformFile("./index.js", function (err, result) {
    eval(result.code);
  });
