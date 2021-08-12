import Ember from 'ember';

export function stateStr([state_code, inline_mode, approver]){
	if (inline_mode)
		switch (state_code){
			case 0:
				return "Draft";
			case 1:
				return "Waiting for approval"
			case 2:
				return "Approved"
			default:
				return "Unknown"
		}
	else
		switch (state_code){
			case 0:
				return "Draft";
			case 1:
				return "Issued for approval"
			case 2:
				let approver_name = (approver.full_name!="")?approver.full_name:"Anonymous";
				return "Approved by " + approver_name
			default:
				return "Unknown"
		}

	return "Unknown";
}

export default Ember.Helper.helper(stateStr);