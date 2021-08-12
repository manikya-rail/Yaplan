// @TODO Bring better organization to commands naming
import NewDocumentCommand from '../commands/new-document-command';
import NewDocumentFromTemplateCommand from '../commands/new-document-from-template-command';
import OpenDocumentCommand from '../commands/open-document-command';
import SaveasTeamplateCommand from '../commands/saveas-template-command';
import NewTemplateCommand from '../commands/new-template-command';

import {DOCUMENT_NEW, DOCUMENT_OPEN, DOCUMENT_NEW_FROM_TEMPLATE, DOCUMENT_SAVEAS_TEMPLATE, TEMPLATE_NEW} from '../services/command-registry';

export default {
  name: 'commands',

  /**
   * Registers commands into application
   * @param application
   */
  initialize: function(application){
    application.register('command:' + DOCUMENT_NEW, NewDocumentCommand);
    application.register('command:' + DOCUMENT_NEW_FROM_TEMPLATE, NewDocumentFromTemplateCommand);
    application.register('command:' + DOCUMENT_OPEN, OpenDocumentCommand);
    application.register('command:' + DOCUMENT_SAVEAS_TEMPLATE, SaveasTeamplateCommand);
    application.register('command:' + TEMPLATE_NEW, NewTemplateCommand);
  }
};
