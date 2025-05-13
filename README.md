# WebODM Geoman Plugin

This plugin integrates [Geoman.io](https://geoman.io/) (formerly Leaflet-Geoman) into WebODM, providing powerful shape editing capabilities to the map interface. It allows you to create, edit, and manipulate geometric shapes (polygons, rectangles, markers, etc.) directly on your WebODM 2D maps.

## Features

- Full Geoman.io integration with WebODM maps
- Draw various shapes: rectangles, polygons, markers, lines
- Edit existing shapes: move, resize, rotate
- Delete shapes
- Includes Turf.js for precise geometric calculations

## Building

1. Clone this repository
2. Run the build script:
   ```bash
   ./build.sh
   ```
3. This will create a `webodm-plugin-geoman.zip` file ready for upload

## Installation

1. Download the latest release zip file or build it using the provided build script
2. Navigate to your WebODM instance's plugin page: `http://localhost:8000/admin/app/plugin/`
3. Click "Add plugin" and upload the zip file
4. Restart your WebODM docker project:
   ```bash
   ./webodm.sh restart
   ```
5. The Geoman toolbar should now appear on your WebODM 2D maps

## Advanced Usage

### Developer Functions

The plugin provides some useful functions for developers:

- `window.map` - Direct access to the Leaflet map instance for debugging
- `window.createPreciseRectangle(width, height, [center])` - Create a rectangle with precise dimensions in meters
  ```javascript
  // Create an 8x6 meter rectangle at the current map center
  window.createPreciseRectangle(8, 6);
  
  // Create a 10x5 meter rectangle at a specific location
  window.createPreciseRectangle(10, 5, L.latLng(42.123, -71.456));
  ```

### Dependencies

This plugin includes:
- Geoman.io (formerly Leaflet-Geoman) for shape editing
- Turf.js for geometric calculations and precise shape creation

## Technical Notes

- The plugin handles conflicts between Geoman's interactive tools and WebODM's native popup system
- Contains extensive console logging for debugging (which can be removed for production)

## Compatibility

This plugin has been tested with:
- WebODM 2.8.1
- Modern browsers (Chrome, Firefox, Edge)

## License

[MIT License](LICENSE)
