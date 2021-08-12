import Ember from 'ember';
import bubble from '../../../utils/bubble';

export default Ember.Component.extend({
	actions: {
		onCancel : bubble('onCancel'),
		onConfirm: bubble('onConfirm')
	}
});