class V1::CategoriesController < ApplicationController
  # before_action :authenticate_user!
  # load_and_authorize_resource

  api :GET, 'v1/categories', 'Get all category'
  def index
    total_pages = 0
    @categories = params[:archived] ? Category.archived : Category.active
    if params[:q]
      @categories = @categories.search(params[:q])
    end
      if params[:page].present?
        total_pages = @categories.count
        @categories = @categories.page(params[:page]).per(15)
      end
    render json: @categories.recent, include: json_children,meta: { total_records: total_pages }
  end

  api :GET, 'v1/categories/:id', ' Show Category'
  def show
    @category = Category.find(params[:id])
    render json: @category
  end

  def update
    category = Category.find(params[:id])
    if category.update(category_params)
      render json: category, status: :ok
    else
      render json: category.errors.full_messages, status: :unprocessable_entity
    end
  end

  api :POST, 'v1/categories', ' Show Category'
  param :name, String, 'Name of category', require: true
  param :image, String, 'Image of category'
  def create
    category = Category.new(category_params)
    # authorize! :create, project
    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @category = Category.find(params[:id])
    if !(@category.projects.present? || @category.workflow_templates.present?)
      @category.archive!
      head :no_content
    else
      @category.errors[:base] << "#{@category.name} cannot be archived since it has projects/workflows under it."
      render json: {errors: @category.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def unarchive
    @category = Category.find(params[:id])
    @category.un_archive!
    render json: @category, status: :ok
  end

  private

  def category_params
    params.require(:category).permit(:name, :image, :is_published)
  end

  def json_children
    '*'
  end
end
