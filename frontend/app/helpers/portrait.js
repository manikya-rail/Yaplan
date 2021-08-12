import Ember from 'ember';

export function portrait([user_id, refresh]) {
  let url = "https://grapple-v2-testing.s3.amazonaws.com/uploads/portrait/" + user_id + "/profile.png";
  if (refresh)
  	url = url + "?rand=" + Date.now();

  return url;
}

export default Ember.Helper.helper(portrait);