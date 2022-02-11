import * as fs from "fs";
import { join } from "path";
import * as readline from "readline";
import { parse } from "csv-parse";
import * as lodash from "lodash";

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

          const csvObject = csvToObject(records[key], records[0]);
          const jsonObject = toJsonObject(csvObject);
          fs.writeFileSync(outputPath, JSON.stringify(jsonObject));
          console.log(`\t- Generated metadata at ${outputPath}`);
        }
      }
    );
  }
);

function csvToObject(record: object, headers: object): object {
  const headersValues = Object.values(headers);
  const recordValues = Object.values(record);

  const output: object = {};

  headersValues.forEach((value, key) => {
    lodash.set(output, value, recordValues[key]);
  });

  return output;
}

function toJsonObject(csvObject: object): object {
  return csvObject;
}
