class V1::ImagesController < ApplicationController
  api :POST, 'v1/images', 'Add new image to document'
  param :image, Hash, desc: 'Base64 encoded file'
  def create
    @document = Document.find(image_params[:document_id])
    @image = @document.images.new(image_params)
    if @image.save
      render json: @image, status: :created, location: [:v1, @image]
    else
      render json: @image.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :GET, 'v1/images/:id', 'Returns image record'
  def show
    @image = Image.find(params[:id])
    render json: @image
  end

  api :DELETE, 'v1/images/:id', 'Permanently deletes record'
  def destroy
    @image = Image.find(params[:id])
    @image.destroy
    head :no_content
  end

  private

  def image_params
    params[:image].permit(:document_id, :image)
  end
end
