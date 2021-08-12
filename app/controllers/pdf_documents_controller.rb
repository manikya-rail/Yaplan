class PdfDocumentsController < ApplicationController
  before_action :set_document

  def generate
    pdf = DocumentPdfService.new(@document.id).pdf
    project = @document.project
    url = "/pdfs/project_#{remove_whitespace(project.title)}/#{remove_whitespace(@document.title)}.pdf"
    redirect_to url
  end

  def show
    respond_to do |format|
      format.pdf do
        render pdf: 'sample', layout: 'pdf_service.html',
                  header: { html: {  template: 'pdf_documents/header.html.erb',         # use :template OR  :url
                              locals:   { header_content: @document.header }
                            }
                          },
                  footer: { html: {
                            template: 'pdf_documents/footer.html.erb',
                            locals:   { footer_content: @document.footer }
                         }
                  },
                  margin:   {
                              top:               16,                     # default 10 (mm)
                              bottom:            12,
                              left:              20,
                              right:             20 
                            },
                  show_as_html: params[:d].present?
      end
    end
  end

  private

  def remove_whitespace(string)
    string.parameterize
  end

  def set_document
    @document = Document.includes(:section_texts).order("section_containers.position").find_by_id(params[:id])
  end
end
