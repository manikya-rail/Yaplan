export default class {
  /**
   * Reference to the editor this command related to
   * @type {Editor}
   */
  editor;

  /**
   * Unique name of the command - will be used to lookup command in the editor
   * @Param : name - type string
   * @Param : non_text - type boolean
   */
  name;

  constructor(name, non_text){
    this.name = name;
    if (non_text) 
      this.text_command = false;
    else 
      this.text_command = true;
  }

  /**
   * Registers command to the editor
   * @param {Editor} editor
   */
  register(editor){
    this.editor = editor;
  }

  /**
   * Executes this command. Could take different arguments, depends on the implementation
   */
  execute(){
  }
}
