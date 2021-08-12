import Command from './command';

export default class extends Command{

  /**
   * Default constructor
   */
  constructor(){
    super('ordered-list');
  }

  /**
   * Makes text selected in the editor bold
   */
  execute(){
    if(this.editor.isTextSelected()){
      this.editor.execCommand('insertOrderedList');
    }
  }
}
