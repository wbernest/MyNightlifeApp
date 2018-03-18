const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';
import createHistory from 'history/createBrowserHistory';
const queryString = require('query-string');

export class MainController {
  $http;

  searchResults = [];
  search = '';
  history: any;
  parsed: any;
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.history = createHistory();
    this.parsed = queryString.parse(location.search);
    if(this.parsed.search!= undefined)
      this.search = this.parsed.search;
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
