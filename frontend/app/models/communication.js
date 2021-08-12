import DS from 'ember-data';

export default DS.Model.extend({
  message: DS.attr('string'),
  subject: DS.attr('string'),
  projectWorkflowStep: DS.belongsTo('project-workflow-step', { async: true }),
  communicationMode: DS.attr('string', { defaultValue() { return 'approved'; } }),
  recepientEmails: DS.attr('', { defaultValue() { return []; } }),
  attachments: DS.hasMany('attachments'),
});
