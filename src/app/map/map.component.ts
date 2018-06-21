import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  AcNotification,
  ActionType,
  AcEntity,
  AcLayerComponent
} from "angular-cesium";
import { Planes } from "../planes";
import { GeoJsonFile } from "../geo-json-file";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  @ViewChild("layerRef") private layerRef: AcLayerComponent;

  public planes$: Observable<AcNotification>;
  colorBLue = Cesium.Color.LIGHTSKYBLUE;
  colorGreen = Cesium.Color.GREEN;
  convertedArr: AcNotification[];

  // isShown = false;
  /****************************************** */
  tmpJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          OBJECTID_1: "1",
          OBJECTID: "1",
          Name: "הנדסה אזרחית וסביבתית",
          Name_En: "Civil & Environmental Eng.",
          ELEVATION: "219.261"
        },
        geometry: {
          type: "Point",
          coordinates: [35.022285, 32.779062, 218.789993]
        }
      },
      {
        type: "Feature",
        properties: {
          OBJECTID_1: "2",
          OBJECTID: "3",
          Name: "בריכה חדר כושר ומגרשי ספור",
          Name_En: "Sports Facility",
          ELEVATION: "201.643"
        },
        geometry: {
          type: "Point",
          coordinates: [35.019047, 32.779394, 201.643005]
        }
      }
    ]
  };
  /****************************************** */

  planeA: AcNotification = {
    id: "1",
    entity: {
      name: 'שם ראשון',
      myField: 'just my field a',
      image: '/assets/smiley.jpg',
      position: Cesium.Cartesian3.fromRadians(
        0.575958653158129,
        0.610865238198015,
        0
      )
    },
    actionType: ActionType.ADD_UPDATE
  };

  planeB: AcNotification = {
    id: '0',
    entity: {
      name: 'sec name',
      myField: 'just my field b',
      image: '/assets/smiley.jpg',
      position: Cesium.Cartesian3.fromRadians(
        0.575958653158129,
        0.610865238198015,
        0
      )
    },
    actionType: ActionType.ADD_UPDATE
  };

  jsonA = {
    id: '0',
    entity: {
      name: '3rd name',
      myField: 'just my field ',
      position: Cesium.Cartesian3.fromRadians(
        0.575958653158129,
        0.610865238198015,
        0
      )
    },
    actionType: ActionType.ADD_UPDATE
  };

  dataArray: AcNotification[];
  dataArrayB: AcNotification[];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.dataArray = [this.planeA, this.planeB, this.jsonA];
    this.dataArrayB = [this.planeA];
    console.log(' this.planeB = ' + JSON.stringify(this.planeB));

    this.planes$ = Observable.from(this.dataArrayB);
    // this.planes$ = Observable.from(this.dataArrayB);
    // this.isShown = true;

    // this.getData();
    // this.getJsonFromService();
    this.getSimplexJsonFromService();
  }

  getData() {
    this.planes$ = Observable.from(this.dataArray);
    // this.isShown = true;
    console.log(' getData() res = ' + JSON.stringify(this.dataArray));
  }

  getJsonFromService() {
    this.http
      .get<Planes>('/assets/mockJsonA.json')
      // .map(item => {
      //   // item.actionType = ActionType.ADD_UPDATE;
      //   console.log(' item id = ' + JSON.stringify(item[0]));

      //   // item[0]['id'] = '33';
      //   // item.entity.position = Cesium.Cartesian3.fromRadians(item.entity.position);
      //   return item;
      // })
      .subscribe(
        res => {
          console.log(' res = ' + JSON.stringify(res));
          res.data.map(item => {
            /**work using  item.entity.position in spite of the compiler warnings!!!
             * no warnings on chrom browser
             */
            item.entity.position = Cesium.Cartesian3.fromRadians(
              item.entity.position[0],
              item.entity.position[1],
              item.entity.position[2]
            );

            item.actionType = ActionType.ADD_UPDATE;
            console.log(' res after = ' + JSON.stringify(res));

            return item;
          });
          this.planes$ = Observable.from(this.dataArray);
          console.log('after res = ' + JSON.stringify(res));
          // this.planes$ = res.data;
          // console.log(' res = ' + res[0]['id']);

          /*update successfully ac-layer using view child*/
          /**update mock hard coded */
          // this.planes$ = Observable.from(this.dataArray);
          // this.layerRef.refreshAll(this.dataArray);
          /**update mock json */
          this.layerRef.removeAll();
          this.layerRef.refreshAll(res.data);
        },
        err => {
          console.log(' err = ' + err);
        }
      );
  }
  /******************************** */

  getSimplexJsonFromService() {
    this.http.get<GeoJsonFile>('/assets/POI_wgs_dsm.geojson').subscribe(
      res => {
        this.convertedArr = res.features.map(item => {
          // console.log('before item.properties.name = ' + item.properties.Name);
          // console.log('before item.geometry.coordinates = ' + item.geometry.coordinates);
          // console.log('8888888888888888888888888888888888888888888 ' );
          item.geometry.coordinates = Cesium.Cartesian3.fromDegrees(
            item.geometry.coordinates[0],
            item.geometry.coordinates[1],
            item.geometry.coordinates[2]
          );
          // console.log('after item.properties.name = ' + JSON.stringify(item));

          /**translte to acNotification */
          const itemNote = new AcNotification();
          itemNote.id = item.properties.Name;
          itemNote.entity = new AcEntity({
            /**hebrew name */
            name: this.reverseString(item.properties.Name),
            position: item.geometry.coordinates
          });
          itemNote.actionType = ActionType.ADD_UPDATE;
          // console.log('after itemNote = ' + JSON.stringify(itemNote));
          return itemNote;
        });
        // console.log('after convertedArr = ' + JSON.stringify(this.convertedArr));
        // console.log(
        //   'after convertedArr[0].position = ' + res.features[0].
        // );
        console.log(
          'after  this.convertedArr[0].entity.name = ' +
            this.convertedArr[0].entity.name
        );
        console.log(
          'after  this.convertedArr[0] = ' +
            JSON.stringify(this.convertedArr[0])
        );
        console.log(
          'after  this.convertedArr = ' + JSON.stringify(this.convertedArr)
        );
        console.log(
          'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj'
        );
        console.log(
          'after  this.dataArray = ' + JSON.stringify(this.dataArray)
        );

        /**update mock json */
        // this.layerRef.removeAll();
        // this.planes$ = Observable.from(this.dataArray);
        /**update simplex json */
        this.layerRef.removeAll();
        this.planes$ = Observable.from(this.convertedArr);
        this.layerRef.refreshAll(this.convertedArr);
        // this.layerRef.refreshAll(res.features);
      },
      err => {
        console.log(' err = ' + err);
      }
    );
  }

  reverseString(str: string) {
    return str.split('').reverse().join('');
  }
}
