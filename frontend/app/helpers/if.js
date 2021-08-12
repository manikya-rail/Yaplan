import Ember from 'ember';

function if_inline([condition, val1, val2]){
	return function(){
		if (condition)
			return val1;
		else
			return val2;
	}
}

export default Ember.Helper.helper(if_inline);