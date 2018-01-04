import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CollectionService {

	private baseUrl = 'https://suplo-app.herokuapp.com/haravan-mobile-app';

	constructor(private http: Http){}
	
	getData(resoucreUrl){
		var url = this.baseUrl + resoucreUrl;
		return this.http.get(url)
			.map((res: Response)=> res.json())
			.subscribe(data=>{
				console.log(data);
			})
	}

}