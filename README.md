# TruckMgr

## Configuration

In `config.json`
```JSON
{
    "company_name": "[companyName]",
    "company_brand": "[companyBrandUrl]",
    "maps_apikey": "[apiKey]"
}
```
Note: `maps_apikey` is currently unused in `config.json` and must be hardcoded in `scripts/map.js`
```JavaScript
const loader = new google.maps.plugins.loader.Loader({
    apiKey: '[apiKey]',
    version: 'weekly',
    libraries: ['maps', 'places', 'routes']
});
```