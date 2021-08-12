import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
	documents: Ember.inject.service(),
	session: Ember.inject.service(),
	user_id: 0,
	getUserInfo: function() {
		let session_data = this.get('session.session.content.authenticated');
		this.set('user_id', session_data.user_id);
	}.on('init'),

	actions: {
		edit: bubble('onEdit')
	}
});