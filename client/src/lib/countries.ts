import rawCountries from "world-countries"

export const formattedCountries = rawCountries.map((country) => ({
  code: country.cca2, // ISO code like "US", "MX"
  name: country.name.common, // "United States"
}))


//* Resulting formattedCountries will look like:
// [
//   { code: "US", name: "United States" },
//   { code: "MX", name: "Mexico" },
//   { code: "CA", name: "Canada" },
//   ...
// ]