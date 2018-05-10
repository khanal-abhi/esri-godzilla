// ---- ESRI LOADER -------------------------------------------------------------------
export const esriLoaderStr = [
    'esri/Map',
    'esri/views/MapView',
    'esri/geometry/geometryEngine',
    'esri/geometry/Point',
    'esri/geometry/Circle',
    'esri/geometry/Multipoint',
    'esri/geometry/Polyline',
    'esri/geometry/support/webMercatorUtils',
    'esri/Graphic',
    'esri/Basemap',
    'esri/layers/WebTileLayer',
    'esri/layers/GraphicsLayer',
    'esri/tasks/RouteTask',
    'esri/tasks/support/RouteParameters',
    'esri/tasks/support/FeatureSet',
    'esri/Color',
    'esri/layers/VectorTileLayer',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/geometry/ScreenPoint'
];

export interface EsriModules {
    Map: any;
    MapView: any;
    geometryEngine: any;
    Point: any;
    Circle: any;
    Multipoint: any;
    Polyline: any;
    webMercatorUtils: any;
    Graphic: any;
    Basemap: any;
    WebTileLayer: any;
    GraphicsLayer: any;
    RouteTask: any;
    RouteParameters: any;
    FeatureSet: any;
    Color: any;
    VectorTileLayer: any;
    SimpleLineSymbol: any;
    SimpleMarkerSymbol: any;
    ScreenPoint: any;
}

// choose arcgis js api v4.x for 3d visualization feature
export const esriLoaderOptions = {
    css: 'https://js.arcgis.com/4.6/esri/css/view.css',
    url: 'https://js.arcgis.com/4.6/'
};
