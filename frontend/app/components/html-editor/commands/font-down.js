import Command from './command';

export default class extends Command{

  /**
   * Default constructor
   */
  constructor(){
    super('font-down');
  }

  /**
   * Makes text selected in the editor bold
   */
  execute(){
    if(this.editor.isTextSelected()){
      this.editor.execCommand('decreaseFontSize');
    }
  }
}
