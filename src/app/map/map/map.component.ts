import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {

  private _mapView: __esri.MapView;

  @ViewChild('mapView') mapElement: ElementRef;

  constructor(private _mapService: MapService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this._mapService.whenLoaded().then((isLoaded) => {
      console.log('map service inited: ' + isLoaded);
      this._mapView = this._mapService.createMapView(this.mapElement);
      
    });
  }

  ngOnDestroy() {

  }

}
