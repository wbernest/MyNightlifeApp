const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';
import createHistory from 'history/createBrowserHistory';
const queryString = require('query-string');
import * as _ from 'lodash';
import * as moment from 'moment';

export class MainController {
  $http: any;
  searchResults = [];
  search = '';
  history: any;
  parsed: any;
  Auth: any;
  user: string = '';
  isLoggedInAsync: Function;
  $state: any;
  /*@ngInject*/
  constructor($http, Auth, $state) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.history = createHistory();
    this.parsed = queryString.parse(location.search);
    this.isLoggedInAsync = Auth.isLoggedIn;
    if(this.parsed.search!= undefined)
      this.search = this.parsed.search;

    Auth.getCurrentUser().then( x => this.user = x.email);
  }

  $onInit(){
    if(this.search != '') this.searchYelp();

    document.getElementById('searchInput').addEventListener('keypress',(evt) =>{
      if (evt['keyCode'] == 13) {
        this.searchYelp();
      }
    });
  }

  accordionClick(index){
    var collection = document.getElementsByClassName('in');
    if(collection.length > 0 && collection[0].id == "collapse" + index) {
      collection[0].className = 'panel-collapse collapse'
    
    }
    else if(collection.length > 0){
      collection[0].className = 'panel-collapse collapse'
      document.getElementById('collapse' + index).className = 'panel-collapse collapse in';
    }
    else{
      document.getElementById('collapse' + index).className = 'panel-collapse collapse in';
    }
  }

  searchYelp() {

    if(this.parsed.search != this.search)
    {
      // If you prefer, use a single location-like object to specify both
      // the URL and state. This is equivalent to the example above.
      this.history.push({
        pathname: "/",
        search: "?search=" + this.search
      });

      this.parsed.search = this.search;
    }
    this.$http.get('/api/yelps/' + this.search).then(response => {
      this.searchResults = response.data.jsonBody.businesses;
      this.$http.get('/api/UserLocations').then(locations =>{
        _.each(this.searchResults, (sr, i) =>{
          sr.attending = locations.data.filter(x => x.locationId == sr.id && x.date == moment().format('MM/DD/YY')).length;
          sr.iamgoing = (locations.data.filter(x => x.locationId == sr.id && x.date == moment().format('MM/DD/YY') && x.userName == this.user).length > 0 )
        })
      })
    }).catch(error => console.log(error));
  }
  
  addUserToLocation(location){
    this.isLoggedInAsync(user => {
      if(user != "" && !location.iamgoing ){
        this.$http.post('/api/UserLocations',{
          userName: this.user,
          locationId: location.id,
          date: moment().format('MM/DD/YY')
        }).then(x => {
          location.attending++;
          location.iamgoing = true;
        });
      }
      else if(user != "" && location.iamgoing){
        this.$http.get('/api/UserLocations').then(results =>{
          var userLocation = results.data.filter(x => x.locationId == location.id && x.date == moment().format('MM/DD/YY') && x.userName == this.user)[0]
          this.$http.delete('/api/UserLocations/' + userLocation._id).then(x => {
            location.attending--;
            location.iamgoing = false;
          });
  
        });
      }
      else{
        this.$state.go('login', {url: '/login?search'});

      }
    });
  }
}

export default angular.module('myNightlifeAppApp.main', [
  uiRouter])
    .config(routing)
    .component('main', {
      template: require('./main.html'),
      controller: MainController
    })
    .name;
