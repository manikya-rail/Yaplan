import Ember from 'ember';
import * as _ from 'lodash';
export function incompleteUserTasks(params/*, hash*/) {
  return params[0].filter(userTask => {
    switch (userTask.get('taskType')) {
      case 'assign':
        return userTask.get('task.state') === 'assigned';
      case 'approve':
        return userTask.get('task.state') === 'published';
      case 'decision':
        return userTask.get('task.state') === 'assigned';
    }
  });
}

export default Ember.Helper.helper(incompleteUserTasks);
