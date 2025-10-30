// Minimal ambient type to silence TS for the 'leaflet' module when
// using dynamic import. If you later install '@types/leaflet', you can
// remove this file.
declare module "leaflet" {
  const L: any
  export default L
}


