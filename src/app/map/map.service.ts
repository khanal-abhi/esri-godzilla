import { Injectable, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import { loadModules } from 'esri-loader';
import { EsriModules } from './map.data';
import * as mapData from './map.data';
import { lang } from 'dojo/_base/lang';
import * as on from 'dojo/on';
import * as gfx from 'dojox/gfx';
import * as domConstruct from 'dojo/dom-construct';
import * as query from 'dojo/query';
import * as domAttr from 'dojo/dom-attr';
import * as domStyle from 'dojo/dom-style';

export interface Basemap {
  title: string;
  url: any;
  attribution: string;
  image: string;
  maxZoom: number;
  maxNativeZoom: number;
  basemap: any;
}

@Injectable()
export class MapService {

  private _isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _esriModules: EsriModules = null;
  private _loadEsriModulesSubscription: Subscription;
  public mapView: __esri.MapView = null;

  constructor(private _zone: NgZone) {
    // load esri modules from arcgis js api
    this._loadEsriModulesSubscription = Observable.fromPromise(
      loadModules(mapData.esriLoaderStr, mapData.esriLoaderOptions)
        .catch((error) => {
          console.error(error);
        })).subscribe((loaderResponse: any) => {
          this._initEsriModules(loaderResponse);
        });
  }

  public whenLoaded(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this._isLoaded.value === true) {
        resolve(true);
      } else {
        const sub = this._isLoaded.subscribe(() => {
          if (this._isLoaded.value === true) {
            resolve(true);
            sub.unsubscribe();
          }
        });
      }
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

  public createMapView(rootEl: ElementRef): __esri.MapView {
    this.checkIsReady();
    let output: __esri.MapView;
    output = new this._esriModules.MapView({
      container: rootEl.nativeElement,
      center: [-29.88, 21.86133],
      zoom: 3,
      map: new this._esriModules.Map({
        basemap: 'streets',
      }
      )
    });
    return output;
  }

  private checkIsReady() {
    if (this._isLoaded.value === false) {
      throw new Error('attempted to call map.service before it has been initialized');
    }
  }

}
