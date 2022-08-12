const path = require("path");
const fs = require("fs");

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.error(error);
    console.log("No local canister_ids.json found");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const localMap = localCanisters
    ? Object.entries(localCanisters).reduce((prev, current) => {
        const [canisterName, canisterDetails] = current;
        prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
          canisterDetails[network];
        return prev;
      }, {})
    : undefined;
  const prodMap = prodCanisters
    ? Object.entries(prodCanisters).reduce((prev, current) => {
        const [canisterName, canisterDetails] = current;
        prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
          canisterDetails[network];
        return prev;
      }, {})
    : undefined;
  return [localMap, prodMap];
}
const [localCanisters, prodCanisters] = initCanisterEnv();

if (process.env.NODE_ENV === "production") {
  if (prodCanisters) {
    const prodTemplate = Object.entries(prodCanisters).reduce((start, next) => {
      const [key, val] = next;
      if (!start) return `${key}=${val}`;
      return `${start ?? ""}
      ${key}=${val}`;
    }, ``);
    fs.writeFileSync(".env", prodTemplate);
  }
} else {
  if (localCanisters) {
    const localTemplate = Object.entries(localCanisters).reduce(
      (start, next) => {
        const [key, val] = next;
        if (!start) return `${key}=${val}`;
        return `${start ?? ""}
            ${key}=${val}`;
      },
      ``
    );
    fs.writeFileSync(".env", localTemplate);
  }
}
