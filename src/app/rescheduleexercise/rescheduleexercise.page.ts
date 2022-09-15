import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Location } from "@angular/common";
@Component({
  selector: 'app-rescheduleexercise',
  templateUrl: './rescheduleexercise.page.html',
  styleUrls: ['./rescheduleexercise.page.scss'],
})
export class RescheduleexercisePage implements OnInit {
	
	response: any;
	response1: any;
	response2: any;
	id: any;
	cat_id: any;
	errors = config.errors;
	IMAGES_URL = config.IMAGES_URL;
	selected_date : any;
	split_date : any;
  	selected_ability: any;
  	
  	constructor(public modalCtrl: ModalController,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, private activatedRoute: ActivatedRoute, public location: Location ) { 

      this.id = activatedRoute.snapshot.paramMap.get('id');
      this.cat_id = activatedRoute.snapshot.paramMap.get('cat_id');
    }
  	
  	ngOnInit() {

  		this.getScheduledExercise();
  	}


  	getSubCategory(){
  		
  		this.apiService.post('/sub_category_list', {ref_id: this.cat_id}, '').subscribe((res) => {

			console.log(res);
			this.response1 = res;
			this.getScheduledExercise();
		});

  	}

  	getScheduledExercise(){

  		this.apiService.post('/schedule_exercise_detail', {_id: this.id}, '').subscribe((res) => {

			console.log(res);
			this.response = res;
			this.selected_date = this.response.data.selected_date;
			
			
		});

  	}

  	ReScheduleExercise(){
  		this.split_date = this.selected_date.split('T')[0];
      	this.apiService.post('/re_schedule_exercise', {selected_date: this.selected_date,split_date: this.split_date,cat_id: this.response.data.cat_id ,ability_id: this.response.data.ability_id, workout_id: this.response.data.workout_id, exercise_id:this.response.data.exercise_id , _id: this.id}, '').subscribe((res) => {

        	console.log(res);
        	this.response2 = res;
        	if(this.response2.status == 1){
        		this.apiService.presentToast(this.response2.error, 'success');
        	}else{
        		this.apiService.presentToast(this.response2.error, 'danger');
        	}
        	 this.events.publishSomeData({});
        	
        	this.location.back();
        	//this.detail = this.response2.data[0];
      	});

  	}

}
