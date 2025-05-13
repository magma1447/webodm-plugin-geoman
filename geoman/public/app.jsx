import L from 'leaflet';
import './app.scss';
import Utils from 'webodm/classes/Utils';
import ReactDOM from 'ReactDOM';
import React from 'React';
import $ from 'jquery';
import { _, get_format } from 'webodm/classes/gettext';
import { unitSystem } from 'webodm/classes/Units';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as turf from '@turf/turf';

export default class App{
    constructor(map){
        console.log('geoman constructor called');
        this.map = map;

        if (L && L.PM) {
            console.log('GeoMan: Initializing PM on map');
            map.pm = new L.PM.Map(map); // Not needed?

            // Prevent WebODM tooltip popups when we are using GeoMan.
            this.setupCustomPopupHandling(map);

            window.map = map;	// debug

            // Increase max zoom so that we can measure properly.
            map.options.maxZoom = 26;

            console.log('GeoMan: Adding controls');
            map.pm.addControls({
              position: 'topleft',
              drawRectangle: true,
              drawPolygon: true,
              editMode: true,
              dragMode: true,
              rotateMode: true,
              cutPolygon: false,
              removalMode: true
            });

            this.addPreciseRectangleMethod(map, turf);
        }
        else {
            console.error('GeoMan: L.PM not available');
        }
    }









// Prevent standard popups while Geoman is active.
setupCustomPopupHandling(map) {
    // Store original popup method
    const originalOpenPopup = map.openPopup;
    
    // Simple override to check Geoman state
    map.openPopup = function(...args) {
        // Check if any Geoman tool is active
        if (map.pm.globalDrawModeEnabled() || 
            map.pm.globalEditModeEnabled() || 
            map.pm.globalDragModeEnabled() || 
            map.pm.globalRotateModeEnabled() || 
            map.pm.globalRemovalModeEnabled()) {
            console.log('Prevented popup while Geoman is active');
            return this;
        }
        return originalOpenPopup.apply(this, args);
    };
    
    // Handle popups after shape removal
    map.on('pm:remove', () => {
        // Block popups for a short period after removal
        const tempOpenPopup = map.openPopup;
        map.openPopup = function() {
            console.log('Prevented popup after shape removal');
            return this;
        };
        
        // Restore after a short delay
        setTimeout(() => {
            map.openPopup = tempOpenPopup;
        }, 500);
    });
}










    // Adds a rectangle with given width and height.
    addPreciseRectangleMethod(map, turf) {
        window.createPreciseRectangle = function(width, height, center = null) {
            // If no center is provided, use the map center
            if (!center) {
                center = map.getCenter();
            }
            
            // Create a point for the center
            const centerPoint = turf.point([center.lng, center.lat]);
            
            // Calculate each corner in a single step
            // North is 0 degrees, East is 90 degrees, South is 180, West is 270
            const northEastPoint = turf.destination(
                turf.destination(centerPoint, height/2, 0, {units: 'meters'}),
                width/2, 90, {units: 'meters'}
            );
            
            const northWestPoint = turf.destination(
                turf.destination(centerPoint, height/2, 0, {units: 'meters'}),
                width/2, 270, {units: 'meters'}
            );
            
            const southEastPoint = turf.destination(
                turf.destination(centerPoint, height/2, 180, {units: 'meters'}),
                width/2, 90, {units: 'meters'}
            );
            
            const southWestPoint = turf.destination(
                turf.destination(centerPoint, height/2, 180, {units: 'meters'}),
                width/2, 270, {units: 'meters'}
            );
            
            // Convert to Leaflet LatLng objects
            const neLatLng = L.latLng(northEastPoint.geometry.coordinates[1], northEastPoint.geometry.coordinates[0]);
            const nwLatLng = L.latLng(northWestPoint.geometry.coordinates[1], northWestPoint.geometry.coordinates[0]);
            const seLatLng = L.latLng(southEastPoint.geometry.coordinates[1], southEastPoint.geometry.coordinates[0]);
            const swLatLng = L.latLng(southWestPoint.geometry.coordinates[1], southWestPoint.geometry.coordinates[0]);
            
            // Create a polygon with the precise corners
            const polygon = L.polygon([swLatLng, nwLatLng, neLatLng, seLatLng], {
                color: "#ff7800",
                weight: 2,
                fillOpacity: 0.2
            }).addTo(map);
            
            // Make it editable with Geoman
            if (map.pm) {
                polygon.pm.enable();
            }
            
            // Verify the dimensions
            const actualWidth = map.distance(swLatLng, seLatLng);
            const actualHeight = map.distance(swLatLng, nwLatLng);
            
            console.log(`Rectangle created: ${actualWidth.toFixed(2)}m x ${actualHeight.toFixed(2)}m`);
            
            return polygon;
        };
    }
}

