/**angular.io */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/**3rd package */
import { AngularCesiumModule, AcToolbarComponent, AcToolbarButtonComponent } from 'angular-cesium';
import { DragIconComponent } from 'angular-cesium/src/angular-cesium-widgets/components/toolbar/ac-toolbar/drag-icon.component';

/**costume */
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DragIconComponent,
    AcToolbarComponent,
    AcToolbarButtonComponent
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
