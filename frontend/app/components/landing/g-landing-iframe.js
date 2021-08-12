import Ember from 'ember';

export default Ember.Component.extend({
	load_count: 0,

	actions: {
		loaded: function() {
			let load_count = this.get('load_count');
			load_count ++;

			this.set('load_count', load_count);

			if (load_count == 2){
				//Actually submitted the email
				this.sendAction("subscribeDone");
			}
		}
	}
});