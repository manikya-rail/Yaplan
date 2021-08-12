import Ember from 'ember';

export function fullName(name){
	return (name!="")?name:"Anonymous";
}

export default Ember.Helper.helper(fullName);