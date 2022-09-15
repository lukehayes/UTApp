import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';

@Component({
  selector: 'app-program-abilities',
  templateUrl: './program-abilities.page.html',
  styleUrls: ['./program-abilities.page.scss'],
})
export class ProgramAbilitiesPage implements OnInit {
	
	response: any;
	id: any;
	errors = config.errors;
	IMAGES_URL = config.IMAGES_URL;

   	constructor(public modalCtrl: ModalController,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, private activatedRoute: ActivatedRoute ) { 

      this.id = activatedRoute.snapshot.paramMap.get('id');
    }
  	
  	ngOnInit() {

  		this.getSubCategory();
  	}

  	getSubCategory(){

  		this.apiService.post('/sub_category_list', {ref_id: this.id}, '').subscribe((res) => {

			console.log(res);
			this.response = res;
		});

  	}

}
