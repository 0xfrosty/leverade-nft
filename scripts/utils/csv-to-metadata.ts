import * as fs from "fs";
import { join } from "path";
import * as readline from "readline";

// TODO: Make this path configurable by the user
const outputSubPath = join(".", "public");
const outputPath = join(outputSubPath, "csv-to-metadata-output.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// TODO: Be more clear about what the input path means (is it relative? Must it be inside a specific folder?)
rl.question(
  "Please, write the relative path of the CSV file: ",
  function (inputPath) {
    rl.close();
    // rl.on("close", function () {
    //   console.log("\nBYE BYE !!!");
    //   process.exit(0);
    // });

    console.log(`The introduced file is ${inputPath}`);
    console.log(`The output file will be ${outputPath}`);

    if (!fs.existsSync(outputSubPath)) {
      fs.mkdirSync(outputSubPath, { recursive: true });
    }
    fs.writeFileSync(outputPath, "Hey there!");
  }
);

// const expected = {
//   description:
//     "Colección conmemorativa de las medallistas de la temporada 2021/2022 de la Copa de la Reina de Waterpolo de España, acuñada por la Real Federación Española de Natación.",
//   name: "Copa de la Reina de Waterpolo 2021/2022 #1",
//   image: "https://static.leverade.com/img/brand_logo.svg",
//   animation_url: "https://static.leverade.com/img/brand_logo.gif",
//   background_color: "ffcd00",
//   external_url: "https://rfen.es/tournament/1136595/",
//   attributes: [
//     {
//       trait_type: "Athlete",
//       trait_value: "Nombre Apellidos",
//     },
//     {
//       trait_type: "Club",
//       trait_value: "C.N. Catalunya",
//     },
//     {
//       trait_type: "Medal",
//       trait_value: "Gold",
//     },
//     {
//       trait_type: "Sponsor",
//       trait_value: "Iberdrola",
//     },
//   ],
// };
