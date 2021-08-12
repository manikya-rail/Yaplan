/**
 * Main command registry allows to emit and subscribe command events within application
 *
 * @TODO: think of implementation - either commands contains only disable / enable behaviour - and this looks
 * as event bus, or commands contains logic?
 *
 * @TODO: move out from services to separated commands package
 *
 * @TODO Bring better organization to commands naming
 */
import Ember from 'ember';

//export let DOCUMENT_NEW = new Command('document:new');
export let DOCUMENT_NEW = 'document-new';
export let DOCUMENT_NEW_FROM_TEMPLATE = 'document-new-from-template';
export let DOCUMENT_OPEN = 'document-open';
export let DOCUMENT_SAVEAS_TEMPLATE = 'document-saveas-template';
export let TEMPLATE_NEW = 'template-new';

export default Ember.Service.extend(Ember.Evented, {
  commands: {},

  /**
   * Register commands within registry
   */
  registerCommands: function(){
    this.commands[DOCUMENT_NEW] = this.buildCommand(DOCUMENT_NEW);
    this.commands[DOCUMENT_NEW_FROM_TEMPLATE] = this.buildCommand(DOCUMENT_NEW_FROM_TEMPLATE);
    this.commands[DOCUMENT_OPEN] = this.buildCommand(DOCUMENT_OPEN);
    this.commands[DOCUMENT_SAVEAS_TEMPLATE] = this.buildCommand(DOCUMENT_SAVEAS_TEMPLATE);
    this.commands[TEMPLATE_NEW] = this.buildCommand(TEMPLATE_NEW);
  }.on('init'),

  /**
   * Builds command object by its name
   * @param name
   * @return {*}
   */
  buildCommand(name){
    return this.get('container').lookupFactory('command:' + name).create();
  },

  /**
   * Executes command by its name. Passes optional argments to command
   * @param name
   */
  execute(name/*, args?*/){
    let command = this.commands[name];
    if(command && !command.disabled) {
      let args = Array.prototype.slice.call(arguments);
      args.shift();

      command.execute.apply(command, args);
    }
  }
});
