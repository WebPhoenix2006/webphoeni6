import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class MainModule { }
