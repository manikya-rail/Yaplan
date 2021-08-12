import Ember from 'ember';

export function dollar(amount){
	return (amount*1 / 100).toFixed(2);
}

export default Ember.Helper.helper(dollar);