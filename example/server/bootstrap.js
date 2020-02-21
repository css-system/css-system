require("dotenv").config()

require("@babel/register")({
  ignore: [/(node_modules)/],
  presets: ["@babel/preset-env", "react-app"],
})

require("./index")
