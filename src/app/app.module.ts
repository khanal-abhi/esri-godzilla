import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapService } from './map/map.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MapModule
  ],
  providers: [
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
