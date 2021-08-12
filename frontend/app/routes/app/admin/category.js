import Ember from 'ember';

export default Ember.Route.extend({

	model() {
    return Ember.RSVP.hash({
      categories: this.store.query('category', { reload: true, page: 1 }),
    })
  },

  actions:{

  	refreshPage(){
  		this.refresh();
  	}

  }

});
