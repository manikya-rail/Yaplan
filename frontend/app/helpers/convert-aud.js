import Ember from 'ember';

function convertAud([amount, currency]){
	var conversion_rate = 1;

	if (currency != 'AUD')
		return amount / conversion_rate;
	else
		return amount;
}

export default Ember.Helper.helper(convertAud);