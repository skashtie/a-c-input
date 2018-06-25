import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent implements OnInit {
  constructor() {}

  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
          label: 'File',
          // items: [{
          //         label: 'New',
          //         icon: 'fa fa-fw fa-plus',
          //         items: [
          //             {label: 'Project'},
          //             {label: 'Other'},
          //         ]
          //     },
          //     {label: 'Open'},
          //     {label: 'Quit'}
          // ]
      },
      {
          label: 'Edit',
          icon: 'fa fa-fw fa-edit',
          // items: [
          //     {label: 'Undo', icon: 'fa fa-fw fa-undo'},
          //     {label: 'Redo', icon: 'fa fa-fw fa-reply'}
          // ]
      }
  ];
  }
}
