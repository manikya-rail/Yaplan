ActiveAdmin.register User do
  actions :all, :except => [:destroy]
  permit_params :email,:first_name,:last_name, :password, :password_confirmation,:role_id

  index :download_links => [:csv] do 
    selectable_column
    id_column

    column :full_name do |user|
      link_to user.full_name, admin_user_path(user) ,class: "member_link"
    end

    column :email
    column :phone_number
    column :role do |user|
      user.try(:role).try(:name).humanize
    end

    column :current_sign_in_at
    column :sign_in_count
    actions defaults: false do |user|
      item "Edit", edit_admin_user_path(user), class: "member_link"
      item "Disable", admin_user_path(user), method: :delete, class: "member_link",data: { confirm: 'Are you sure you want to disable this user.?' } if user.active
      item "Enable", enable_admin_user_path(user),method: :put, class: "member_link", data: { confirm: 'Are you sure you want to enable this user.?' } unless user.active
    end
  end


  csv do
    column :full_name
    column :email
    column :phone_number
    column :role do |user|
      user.role.name.humanize
    end
    column :sign_in_count
    column :status do |user|
      user.active ? "Active" : "Inactive"
    end
  end

  show  do
    attributes_table :first_name,:last_name,:phone_number, :email,:current_sign_in_at,:sign_in_count
  end

  filter :email
  filter :current_sign_in_at
  filter :sign_in_count
  filter :active

  form do |f|
    f.inputs "Admin Details" do
      f.input :email
      f.input :first_name
      f.input :last_name
      f.input :role_id, as: :select, collection: Role.select(:id, :name).map { |row| [row.name.humanize,row.id] }, include_blank: false
      if f.object.new_record?
         f.input :password
         f.input :password_confirmation
      end
    end
    f.actions
  end


  batch_action :export do |ids|
    redirect_to "/admin/users.csv?q[id_in][]=" + ids.join("&q[id_in][]=")
  end


  member_action :enable, method: :put do
    user = User.find_by_id(params[:id])
    user.activate!
    flash[:notice] = "User account Succesfully enabled"
    redirect_to admin_users_path
  end


  controller do
    def update
      if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
        params[:user].delete("password")
        params[:user].delete("password_confirmation")
      end
      super
    end

    def destroy 
      user = User.find_by_id(params[:id])
      user.deactivate!
      flash[:notice] = "User Account Succesfully disabled"
      redirect_to admin_users_path  
    end 
  end

end
