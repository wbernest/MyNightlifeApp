const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;

  searchResults = [];
  search = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;

  }

  $onInit(){
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
    this.$http.get('/api/yelps/' + this.search).then(response => {
      this.searchResults = response.data.jsonBody.businesses;
    }).catch(error => console.log(error));
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
