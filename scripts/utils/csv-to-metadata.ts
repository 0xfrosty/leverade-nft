import * as fs from "fs";
import { join } from "path";
import * as readline from "readline";
import { parse } from "csv-parse";

// TODO: Make this path configurable by the user
const outputSubPath = join(".", "public", "rfen", "copa-reina-22");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// TODO: Be more clear about what the input path means (is it relative? Must it be inside a specific folder?)
// TODO: Assert input path exists
// TODO: Validate input path as valid CSV
rl.question(
  "Please, write the relative path of the CSV file: ",
  function (inputPath) {
    rl.close();

    if (!fs.existsSync(inputPath)) {
      console.error("The introduced file path does not exist. Exiting...");
      process.exitCode = 1;
      return;
    }

    const rawCsvInfo: string = fs.readFileSync(inputPath, "utf-8");
    parse(
      rawCsvInfo,
      {
        delimiter: ",",
      },
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }

        console.log("Assuring output folder exists...");
        if (!fs.existsSync(outputSubPath)) {
          fs.mkdirSync(outputSubPath, { recursive: true });
        }

        console.log("Building metadata JSON files...");
        for (const key in records) {
          if (key === "0") continue;
          console.log(`- Generating metadata JSON file for row ${key}...`);
          const outputPath = join(outputSubPath, key);

          const jsonObject = toJsonObject(records[key]);
          fs.writeFileSync(outputPath, JSON.stringify(jsonObject));
          console.log(`\t- Generated metadata at ${outputPath}`);
        }
      }
    );
  }
);

function toJsonObject(record: object): object {
  return {
    description:
      "Colección conmemorativa de las medallistas de la temporada 2021/2022 de la Copa de la Reina de Waterpolo de España, acuñada por la Real Federación Española de Natación.",
    name: "Copa de la Reina de Waterpolo 2021/2022 #1",
    image: "https://static.leverade.com/img/brand_logo.svg",
    animation_url: "https://static.leverade.com/img/brand_logo.gif",
    background_color: "ffcd00",
    external_url: "https://rfen.es/tournament/1136595/",
    attributes: [
      {
        trait_type: "Athlete",
        trait_value: "Nombre Apellidos",
      },
      {
        trait_type: "Club",
        trait_value: "C.N. Catalunya",
      },
      {
        trait_type: "Medal",
        trait_value: "Gold",
      },
      {
        trait_type: "Sponsor",
        trait_value: "Iberdrola",
      },
    ],
  };
}
