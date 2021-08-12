import Command from "./command";
import $ from "jquery";

export default class extends Command{
 $option
  /**
   * Default constructor
   */
  constructor(){
    super("table", true);
  }

  /**
   * Makes text selected in the editor bold
   */
  execute(rows, cols){
    var html = "<table>";
    var w = (this.editor.doc.body.clientWidth - cols - 1) / cols;

    for(let i = 0; i < rows; i++){
      html += "<tr>";

      for(let k = 0; k < cols; k++){
        html += `<td style="width:${w}px"><div class="avoid-break"><br/></div></td>`;
      }

      html += "</tr>";
    }

    html += "</table><p><br/></p>";
    this.editor.insert(html);

    this.editor.checkChange();
    this.editor.updateHeight();
  }

  register(editor){
    super.register(editor);
    let currRow = null, currCol = null, currentTable = null;
    editor.$editable.on("contextmenu", (evt) => {
      // secondary click
      evt.preventDefault()
      if ($(evt.target).parents("table").length > 0) {
        currRow = $(editor.getSelection().getRangeAt(0).startContainer).closest("tr");
        currCol = $(editor.getSelection().getRangeAt(0).startContainer).closest("td");
        currentTable = currRow.parent().children();

        $(this.editor.doc.body).find(".table-popup").show()
        $(this.editor.doc.body).find(".table-popup").css({ top: Math.abs(evt.pageY - 150), left: evt.pageX })
      }
    })
    
    this.$option = $(`<div class="table-popup hide" style="width: 160px;
          position: absolute;
          z-index: 999;
          background: #ffffff;
          height: 93px;
          overflow: scroll;
          text-align: left;
          border: 1px solid #eee;
          box-shadow: 0 0 18px 0 #d1d1d1;
          display:none;
          min-height: 135px"
        >
        <ul class="list" style="list-style: none;padding: 0;margin: 0;">
          <li class="list-option add-row" style="padding: 7px;cursor: pointer;">Add Row</li>
          <li class="list-option add-column" style="padding: 7px;cursor: pointer;">Add Column</li>
          <li class="list-option remove-row" style="padding: 7px;cursor: pointer;">Delete Row</li>
          <li class="list-option remove-column" style="padding: 7px;cursor: pointer;">Delete Column</li>
        </ul>  
      </div>`)
      .prependTo(editor.doc.body);

    this.$option.on("click", "li", (evt) => {
      // click on li event for options
      $(this.editor.doc.body).find(".table-popup").toggleClass("hide")
      const className = evt.target.className
      $(this.editor.doc.body).find(".table-popup").hide()

      if (evt.target.className.indexOf("add-row") > 0) {
        const no_Of_td = currRow[0].cells.length
        var rowIndex  = currRow[0].rowIndex
        let add =("<tr>")
        for (let i=0; i < no_Of_td; i++) {
          add += ("<td style='width:10px'><div class='avoid-break'><br/></div></td>")
        }
        add += ("</tr>")
        
        $(currRow.parent().children()[rowIndex]).after(add)
      }

      if (evt.target.className.indexOf("add-column") > 0) {
        const index = currCol[0].cellIndex
        const no_of_rows = currCol.parent().parent().children().length
        const add = ("<td style='width:100px'><div class='avoid-break'><br/></div></td>")
          for(let j=0; j<no_of_rows; j++) {
            $($(currentTable[j]).children()[index]).after(add)
          }
      }

      if (evt.target.className.indexOf("remove-row") > 0) {
        var cellIndex  = currRow[0].rowIndex
        if(currentTable.length == 1){
          currRow.parent().parent().remove()
        } else {
          currentTable[cellIndex].remove()
        }
      }

      if (evt.target.className.indexOf("remove-column") > 0) {
        var cellIndex  = currCol[0].cellIndex
        var no_of_rows = currCol.parent().parent().children().length
        if (currRow[0].children.length === 1){
          currCol.parent().parent().parent().remove()  
        } else {
          for(var j=0;j<no_of_rows;j++) {
            currentTable[j].childNodes[cellIndex].remove()
          }
        }
      }
      this.editor.checkChange();
    })

    editor.$editable.on("click", (evt) => {
      $(this.editor.doc.body).find(".table-popup").hide()
    })

    editor.$editable.on("keydown", (evt) => {
      // tab key
      if(evt.keyCode == 9){
        evt.preventDefault();

        let curr = $(editor.getSelection().getRangeAt(0).endContainer).closest("td");
        let td;

        if(evt.shiftKey){
          td = curr.prev("td");
          if(!td.length){
            td = curr.closest("tr").prev("tr").children("td").last();
          }

        }else{
          td = curr.next("td");
          if(!td.length){
            td = curr.closest("tr").next("tr").children("td").first();
          }
        }

        if(td.length){
          let node = td[0];
          let sel = editor.getSelection();
          let range = editor.doc.createRange();

          range.selectNodeContents(node);
          range.collapse(false);

          sel.removeAllRanges();
          sel.addRange(range);

          editor.$editable.focus();
        }
      } else {

      }

    })

  }
}
