PluginsAPI.Map.willAddControls([
    'geoman/build/app.js',
    'geoman/build/app.css'
    ], function(args, App) {

    console.log("WebODM Geoman: main.js loaded");
    new App(args.map);
    console.log("WebODM Geoman: object created");
});

