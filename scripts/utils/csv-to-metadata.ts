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
        // TODO: Validate that CSV has at least 2 rows
        const headersMap = buildHeadersMap(records[0], records[1]);

        for (const key in records) {
          if (key === "0") continue;
          console.log(`- Generating metadata JSON file for row ${key}...`);
          const outputPath = join(outputSubPath, key);

          const jsonObject = toJsonObject(records[key], headersMap);
          fs.writeFileSync(outputPath, JSON.stringify(jsonObject));
          console.log(`\t- Generated metadata at ${outputPath}`);
        }
      }
    );
  }
);

function buildHeadersMap(
  headers: object,
  firstRow: object
): Map<string, number> {
  const map = new Map();
  const headerEntries = Object.entries(headers);
  const firstRowEntries = Object.entries(firstRow);

  const mapSpecific = function (columnName: string): void {
    const nameEntry = headerEntries.find((e) => e[1] === columnName);
    if (nameEntry !== undefined) {
      map.set(columnName, parseInt(nameEntry[0]));
    }
  };

  const mapTrait = function (columnName: string): void {
    const nameEntry = firstRowEntries.find((e) => e[1] === columnName);
    if (nameEntry !== undefined) {
      map.set(columnName, parseInt(nameEntry[0]) + 1);
    }
  };

  mapSpecific("name");
  mapSpecific("description");
  mapSpecific("image");
  mapSpecific("animation_url");
  mapSpecific("background_color");
  mapSpecific("external_url");
  mapTrait("Athlete");
  mapTrait("Club");
  mapTrait("Medal");
  mapTrait("Sponsor");

  return map;
}

function toJsonObject(record: object, headersMap: Map<string, number>): object {
  const recordValues = Object.values(record);

  return {
    description: recordValues[headersMap.get("description") ?? "-1"],
    name: recordValues[headersMap.get("name") ?? "-1"],
    image: recordValues[headersMap.get("image") ?? "-1"],
    animation_url: recordValues[headersMap.get("animation_url") ?? "-1"],
    background_color: recordValues[headersMap.get("background_color") ?? "-1"],
    external_url: recordValues[headersMap.get("external_url") ?? "-1"],
    attributes: [
      {
        trait_type: "Athlete",
        value: recordValues[headersMap.get("Athlete") ?? "-1"],
      },
      {
        trait_type: "Club",
        value: recordValues[headersMap.get("Club") ?? "-1"],
      },
      {
        trait_type: "Medal",
        value: recordValues[headersMap.get("Medal") ?? "-1"],
      },
      {
        trait_type: "Sponsor",
        value: recordValues[headersMap.get("Sponsor") ?? "-1"],
      },
    ],
  };
}
