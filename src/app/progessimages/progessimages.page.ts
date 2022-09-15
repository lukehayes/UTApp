import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progessimages',
  templateUrl: './progessimages.page.html',
  styleUrls: ['./progessimages.page.scss'],
})
export class ProgessimagesPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3.3,
    speed: 400,
    spaceBetween: 10,
  };
  
  constructor() { }

  ngOnInit() {
  }

}
