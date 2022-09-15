import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../services/apiservice.service';
import { GlobalFooService } from '../services/globalFooService.service';
import { config } from '../services/config';
import { EventsService } from '../services/events/events.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-scheduleallexercises',
  templateUrl: './scheduleallexercises.page.html',
  styleUrls: ['./scheduleallexercises.page.scss'],
})
export class ScheduleallexercisesPage implements OnInit {
	
	is_submit = false;	
	cat_id: any;
	ability_id: any;
	workout_id: any;
	exercise_id: any;
	response: any;
	response1: any;
	response2: any;
	response3: any;
	result: any;
	id: any;
	detail: any;
  	errors = config.errors;
  	IMAGES_URL = config.IMAGES_URL;
  	selected_exercises = [];
  	selected_date: any = new Date().toISOString();
  	split_date: any;

  	constructor(public modalController: ModalController,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, private activatedRoute: ActivatedRoute, public location: Location) {  }

  	ngOnInit() {

  		this.getWorkoutCategory();
  	}

  	//workout selection method
  	getWorkoutCategory(){

  		this.apiService.post('/category_list', {}, '').subscribe((res) => {

			console.log(res);
			this.response = res;
			if(this.response.data.length > 0){

				this.cat_id = this.response.data[0]._id;
				this.getSubCategory(this.response.data[0]._id);
			}else{
				this.cat_id = null;
			}
			
		});

  	}

  	getSubCategory(id){

  		this.apiService.post('/sub_category_list', {ref_id: id}, '').subscribe((res) => {

			console.log(res);
			this.response1 = res;
			if(this.response1.data.length > 0){

				this.ability_id = this.response1.data[0]._id;
				this.getSubCategoryWorkout(this.response1.data[0]._id);
			}else{
				this.ability_id = null;
			}
			
			
		});

  	}


  	getSubCategoryWorkout(id){

		  this.apiService.post('/sub_category_workout_list', {ref_id: id}, '').subscribe((res) => {

			   console.log(res);
			   this.response2 = res;
			   if(this.response2.data.length > 0){

			   		this.workout_id = this.response2.data[0]._id;
			   		this.getSubCategoryWorkoutExercise(this.response2.data[0]._id);
		  	 	}else{
					this.workout_id = null;
				}
				
		  });

  	}

  	getSubCategoryWorkoutExercise(id){

	    this.apiService.post('/sub_category_workout_exercise_list', {ref_id: id, userId : localStorage.getItem('userId'), selected_cats: JSON.parse(localStorage.getItem('selected_cats'))}, '').subscribe((res) => {

	      console.log(res);
	      this.response3 = res;
	    });

  	}


  	onSelectWorkout(event){

  		console.log(event)
  		this.getSubCategory(event.detail.value);
  	}

  	onSelectAbility(event){
  		
  		this.getSubCategoryWorkout(event.detail.value);
  	}

  	onSelectAllWorkout(event){
  		
  		this.getSubCategoryWorkoutExercise(event.detail.value);
  	}


  	selectExercise(doc, i){
		console.log(doc._id, i)
		const index = this.selected_exercises.findIndex( (element) => element === doc._id);
  		if(index == -1){
  			this.selected_exercises.push(doc._id);
  		}else{
  			this.selected_exercises.splice(index, 1)
  		}
  		console.log(this.selected_exercises);
  	}

  	ScheduleExercise(){
  		var counter = 0, self = this;
  		this.is_submit = true;
  		if(this.errors.indexOf(self.selected_date) >= 0){
  		return;
  		}

		  if(this.selected_exercises.length == 0){
			  this.apiService.presentToast('Please select atleast one exercise to schedule.', 'danger')
			  return;
		  }
  		this.selected_exercises.forEach(function(item){

  			self.split_date = self.selected_date.split('T')[0];
	      	self.apiService.post('/add_schedule_exercise', {selected_date: self.selected_date,split_date: self.split_date,cat_id: self.cat_id ,ability_id: self.ability_id, workout_id: self.workout_id, exercise_id:item }, '').subscribe((res) => {

	        	console.log(res);
	        	self.result = res;
	        	
	        	counter = counter + 1;
	        	if(counter == self.selected_exercises.length){
	        		if(self.result.status == 1){
		        		self.apiService.presentToast(self.response2.error, 'success');
		        	}else{
		        		self.apiService.presentToast(self.response2.error, 'danger');
		        	}
		        	self.location.back();
	        	}
	        	
	        	//this.detail = this.response2.data[0];
	      	});
  		})
  	}



}
