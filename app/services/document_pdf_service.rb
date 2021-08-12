class DocumentPdfService
  def initialize(doc_id)
    @doc = Document.find_by_id(doc_id)
  end

  def pdf
    left_footer = @doc.title.to_s
    pdf_file = WickedPdf.new.pdf_from_string(
      ApplicationController.new.render_to_string(
        template: 'pdf_documents/doc_temp.html.erb',
        layout: 'layouts/pdf_service.html.erb',
        locals: {
          :'@doc' => @doc
        }
      ),
      footer: {
        right: 'Page [page] of [topage]',
        center: (left_footer.size < 38) ? "@Grapple #{Time.now.year}" : '',
        left: left_footer
      }
    )
    dir = Rails.root.join('public/pdfs/project_' + remove_whitespace(@doc.project.title))
    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    save_path = dir.join(@doc.title + '.pdf')
    File.open(save_path, 'wb') do |file|
      file << pdf_file
      return save_path
    end
  end

  private

  def remove_whitespace(string)
    string.parameterize
  end
end
