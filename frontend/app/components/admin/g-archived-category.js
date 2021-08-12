import Ember from 'ember';

export default Ember.Component.extend({

router: Ember.inject.service('-routing'),

store: Ember.inject.service(),
archivedCategories: null,
count : 0,  


initFormFields: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
    	let self = this;
			var store = this.get('store');
			self.set('count', 0);
			if(self.get('count') == 0){
				self.set('categories',null);
				self.set('archivedCategories', store.query('category', {archived: true}, {reload: true}));
				self.set('count', 1);
			}
    });
}.on('didReceiveAttrs'),

actions: {
	restoreCategory(category){
		let self = this;
	    $.ajax({
	        type: "PUT",
	        url: "v1/categories/" + category.id + "/unarchive",
	    }).done(function(data, statusText, xhr) {
	        var status = xhr.status;
	        if (status == '200') {
	          self.get('router').transitionTo('app.admin.category');
	        }
	    });
	}
}
});
