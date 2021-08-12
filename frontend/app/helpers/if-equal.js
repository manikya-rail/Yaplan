import Ember from 'ember';

function ifEqual([arg1, arg2, val1, val2]){
	if (arg1 == arg2)
			return val1;
		else
			return val2;
}
export default Ember.Helper.helper(ifEqual);