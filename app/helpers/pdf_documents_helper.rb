module PdfDocumentsHelper
  def add_abs_path(html)
    r = /src="(.*?)"/
    abs_path = html.gsub(r) { |url| url.gsub(r, 'src=' + Rails.root.join('public').to_s + url.split('"')[1]) }
    raw(abs_path)
  end
end
