import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Location } from "@angular/common";
@Component({
  selector: 'app-scheduleexercise',
  templateUrl: './scheduleexercise.page.html',
  styleUrls: ['./scheduleexercise.page.scss'],
})
export class ScheduleexercisePage implements OnInit {
	
	response: any;
	response1: any;
	response2: any;
	id: any;
	detail: any;
  	cat_id: any;
  	ability_id: any;
  	errors = config.errors;
  	IMAGES_URL = config.IMAGES_URL;
  	selected_date: any;
  	selected_ability: any;
  	split_date: any;
  	workout_id: any;


  	constructor(public modalController: ModalController,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, private activatedRoute: ActivatedRoute, public location: Location) { 
      this.id = activatedRoute.snapshot.paramMap.get('id');
  	}

  	goBack() {
        
        this.location.back();
    }

  	ngOnInit() {

  		//this.getWorkoutCategory();
      this.getSubCategoryWorkoutExerciseDetail();
  	}

  	//workout selection method
  	getWorkoutCategory(){

  		this.apiService.post('/category_list', {}, '').subscribe((res) => {

			console.log(res);
			this.response = res;
		});

  	}

  	getSubCategory(){

  		this.apiService.post('/sub_category_list', {ref_id: this.cat_id}, '').subscribe((res) => {

			console.log(res);
			this.response = res;
			this.getSubCategoryWorkoutExerciseDetail();
		});

  	}


  	getSubCategoryWorkoutExerciseDetail(){

      	this.apiService.post('/sub_category_workout_exercise_detail', {_id: this.id}, '').subscribe((res) => {

        	console.log(res);
        	this.response1 = res;
        	this.detail = this.response1.data;
      	});

  	}


  	ScheduleExercise(){
  		this.split_date = this.selected_date.split('T')[0];
      	this.apiService.post('/add_schedule_exercise', {selected_date: this.selected_date,split_date: this.split_date,cat_id: this.cat_id ,ability_id: this.ability_id, workout_id: this.workout_id, exercise_id:this.detail._id }, '').subscribe((res) => {

        	console.log(res);
        	this.response2 = res;
        	if(this.response2.status == 1){
        		this.apiService.presentToast(this.response2.error, 'success');
        	}else{
        		this.apiService.presentToast(this.response2.error, 'danger');
        	}
        	this.location.back();
        	//this.detail = this.response2.data[0];
      	});

  	}



  	

}
