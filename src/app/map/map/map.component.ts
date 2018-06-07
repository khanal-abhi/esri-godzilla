import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { MapService } from '../map.service';
import { AppService, eClickEvents } from '../../app.service';
import * as mapData from '../map.data';
import { loadModules } from 'esri-loader';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { EsriModules } from '../map.data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  _esriModules: any;
  _esriLoaderOptions: {
    css: 'https://js.arcgis.com/4.6/esri/css/view.css',
    url: 'https://js.arcgis.com/4.6/'
  };
  _esriLoaderStr: [
    'esri/Map',
    'esri/views/MapView',
    'esri/geometry/geometryEngine',
    'esri/geometry/Point',
    'esri/geometry/Circle',
    'esri/geometry/Multipoint',
    'esri/geometry/Polyline',
    'esri/geometry/ScreenPoint',
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
    'esri/widgets/BasemapToggle'
  ];
  _loadEsriModulesSubscription: Subscription;
  public left = 0;
  public top = 0;
  private _mapView: __esri.MapView;
  private _clickEventSubscription: Subscription;
  private _isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  @ViewChild('mapView') mapElement: ElementRef;
  @ViewChild('newMapView') newMapElement: ElementRef;

  constructor(private _mapService: MapService, private _appService: AppService) {
    this._loadEsriModulesSubscription = Observable.fromPromise(
      loadModules(mapData.esriLoaderStr, mapData.esriLoaderOptions)
        .catch((error) => {
          console.error(error);
        })).subscribe((loaderResponse: any) => {
          this._initEsriModules(loaderResponse);
        });
  }

  private _initEsriModules(loaderResponse: any) {
    this._esriModules = this._createEsriModules(loaderResponse);
    this._isLoaded.next(true);
  }

  private _createEsriModules(loaderResponse: any): EsriModules {
    return {
      Map: loaderResponse.shift(),
      MapView: loaderResponse.shift(),
      geometryEngine: loaderResponse.shift(),
      Point: loaderResponse.shift(),
      Circle: loaderResponse.shift(),
      Multipoint: loaderResponse.shift(),
      Polyline: loaderResponse.shift(),
      webMercatorUtils: loaderResponse.shift(),
      Graphic: loaderResponse.shift(),
      Basemap: loaderResponse.shift(),
      WebTileLayer: loaderResponse.shift(),
      GraphicsLayer: loaderResponse.shift(),
      RouteTask: loaderResponse.shift(),
      RouteParameters: loaderResponse.shift(),
      FeatureSet: loaderResponse.shift(),
      Color: loaderResponse.shift(),
      VectorTileLayer: loaderResponse.shift(),
      SimpleLineSymbol: loaderResponse.shift(),
      SimpleMarkerSymbol: loaderResponse.shift(),
      ScreenPoint: loaderResponse.shift()
    };
  }

  ngOnInit() {
    this._clickEventSubscription = this._appService.clickEvent.subscribe(async event => {
      console.log(event);
      switch (event) {
        case eClickEvents.InfiniteMemoryLoop:
          const _ = await this.getNewMapView();
          console.log(_);
          break;
        case eClickEvents.NonLoadedTiles:
          alert('To try out this scenario, please test this on a mobile device - phone/tablet' +
            ' or a desktop/laptop with touch input. Just do the rotate or zoom out gesture fast ' +
            'and wait till the momentum based movement comes to a halt.');
          break;
        case eClickEvents.Reset:
          window.location.assign(`${window.location.protocol}`);
          break;
        case eClickEvents.WhiteBlankScreen:
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this._mapService.whenLoaded().then((isLoaded) => {
      console.log('map service inited: ' + isLoaded);
      this._mapView = this._mapService.createMapView(this.mapElement);
      this._mapService.mapView = this._mapView;

      /**
       * Uncommenting the following lines fixes the non loaded tiles. However,
       * this disables the animation from the map so momentum based scrolling, zooming and rotating is lost
       */
      // this._mapView.watch('animation', (animation, oldVal, prop, obj) => {
      //   if (animation) {
      //     animation.stop();
      //     try {
      //       (<__esri.MapView>obj).scale = animation.target.scale;
      //       (<__esri.MapView>obj).rotation = animation.target.rotation;
      //     } catch (ex) {

      //     }
      //   }
      // });
      this._mapView.watch('center', (e => {
        const x = e.x; // % 360;
        const y = e.y; // % 360;

        const pointGeometry: __esri.Point = new this._esriModules.Point({
          latitude: y,
          longitude: x
        });
        const data = this._esriModules.webMercatorUtils.webMercatorToGeographic(pointGeometry);
        data.x %= 180;
        data.y %= 90;
        console.log(data.x, data.y);
        const screenPoint: __esri.ScreenPoint = this._mapView.toScreen(data);
        this.left = screenPoint.y;
        this.top = screenPoint.x;
      }));
    });
  }

  async getNewMapView(): Promise<__esri.MapView> {
    return new Promise<__esri.MapView>(async resolve => {
      await this._mapView.when();
      const result = this._mapService.createMapView(this.newMapElement);
    });
  }

  ngOnDestroy() {
    if (this._clickEventSubscription) {
      this._clickEventSubscription.unsubscribe();
    }
    if (this._loadEsriModulesSubscription) {
      this._loadEsriModulesSubscription.unsubscribe();
    }
  }

}
