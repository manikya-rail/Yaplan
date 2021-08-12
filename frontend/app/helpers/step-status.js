import Ember from 'ember';

export function stepStatus(params/*, hash*/) {
  const step = params[0];
  let style = '';
  let status = '';
  switch (step.get('nodeType')) {
    case 'decision':
      if (step.get('task.state') === 'assigned') {
        style = `background-color: #DB8D3B; border: 2px solid #DB8D3B;`;
        status = 'Awaiting Approval';
      } else if (step.get('task.state') === 'approved') {
        style = `background-color: #87AA5C; border: 2px solid #87AA5C;`;
        status = 'Complete';
      } else if (step.get('task.state') === 'rejected') {
        style = `background-color: #B74138; border: 2px solid #B74138;`;
        status = 'Rejected';
      } else {
        if (
          step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
            step.get('description')
        ) {
          style = `background-color: #747474; border: 2px solid #747474;`;
          status = 'Fully Configured';
        } else {
          style = `border: 2px solid #747474;`;
          status = 'Created';
        }
      }
      break;
    case 'document':
    case 'action':
      if (step.get('task.state') === 'approved') {
        style = `background-color: #87AA5C; border: 2px solid #87AA5C;`;
        status = 'Complete';
      } else if (step.get('task.state') === 'rejected') {
        style = `background-color: #B74138; border: 2px solid #B74138;`;
        status = 'Rejected';
      } else if (step.get('state') === 'working') {
        style = `background-color: #2E353A; border: 2px solid #2E353A;`;
        status = 'Current task';
      } else {
        if (
          step.get('task') && step.get('task').belongsTo('assignedTo').id() &&
            step.get('description') &&
            step.get('task').belongsTo('approver').id()
        ) {
          status = 'Fully Configured';
          style = `background-color: #747474; border: 2px solid #747474;`;
        } else {
          status = 'Created';
          style = `border: 2px solid #747474;`;
        }
      }
      break;
    case 'communication':
      if (step.get('state') === 'completed') {
        status = 'Complete';
        style = `background-color: #87AA5C; border: 2px solid #87AA5C;`;
      } else {
        if (
          step.get('communications.firstObject') &&
            step.get('communications.firstObject.subject') &&
            step.get('communications.firstObject.message') &&
            step.get('communications.firstObject.communicationMode') &&
            step.get('communications.firstObject.recepientEmails.length')
        ) {
          status = 'Fully Configured';
          style = `background-color: #747474; border: 2px solid #747474;`;
        } else {
          status = 'Created';
          style = `border: 2px solid #747474;`;
        }
      }
      break;
  }
  return {
    style: new Ember.Handlebars.SafeString(`${style} float: left;`),
    status: status,
  };
}

export default Ember.Helper.helper(stepStatus);
