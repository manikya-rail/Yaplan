Rails.application.routes.draw do
  apipie
  devise_for :users, controllers: { sessions: 'users/sessions', registrations: 'users/registrations', invitations: 'users/invitations', confirmations: 'users/confirmations' }.merge(ActiveAdmin::Devise.config)
  ActiveAdmin.routes(self)

  resources :users do
    collection do
      post :invite
      get :available_projects
    end
    member do
      put :unarchive
    end
  end

  get 'test/am_i_authenticated' => 'users/check_authentication#am_i_authenticated'

  # Not sure it is needed
  # Seems to be the default
  root 'application#index'
  # For devise
  # root to: "home#index"

  get 'hello/world' => 'hello#world'
  get 'hello/protected' => 'hello#protected'
  # post 'hello/create' => 'hello#create'

  get 'v1/collaborated_documents' => 'batch#collaborated_documents'

  namespace 'v1' do
    resources :dashboard do
      collection do
        get :search
      end
    end
    resources :activities
    resources :categories do 
      member do 
        put :unarchive
      end
    end
    resources :tags
    resources :comments
    resources :workflow_templates,shallow: true do
      member do
        put :unarchive
        put :publish
      end
    end
    resources :projects, only: [:index, :create, :show, :update, :destroy] do
      collection do
        get :archived_count
        get :list
      end
      member do
        patch :unarchive
        post :invite_collaborators
        get  :accept_invitation
        get :reject_invitation
        get :members
        get :invites
        get :collaborators
        put :update_category
        get :start_project
        put :assign_workflow
        get :basic
      end
    end
    resources :documents, only: [:index, :create, :show, :update, :destroy] do
      collection do
        get :tagged
        get :archived_count
      end
      member do
        put :submit
        delete :destroy_for_good
        get :accept_invitation
        get :reject_invitation
        put :set_approver
        put :unarchive
        put :approve
        put :set_assignee
        put :reject
        put :add_tags
        put :remove_tags
        get :versions
        get :show_version
        put :revert_version
        get :track_changes
      end
      # update currently not used nor implemented
      resources :section_containers, shallow: true, only: [:index, :create, :show, :update, :destroy] do
        # Updating the order
      end
    end
    resources :tasks
    resources :section_containers, only: [:index, :create, :show, :update, :destroy] do
    end
    resources :plans, only: [:index, :destroy] do
      member do
        get :update_subscription
      end
    end
    get 'retrieve_source' => 'plans#retrieve_source'
    get 'create_card' => 'plans#create_card'
    get 'check_subscription' => 'plans#check_subscription'
    resources :payment_methods, only: [:create, :index]
    # Section texts:
    # Either we want to list them all for the search - not yet used
    # Or we want to update its content
    # For now, we do not allow it to be destroy
    # Creation happens through section_containers.
    resources :section_texts, only: [:index, :show, :update] # For now, no destroy.

    resources :user_tasks do
      member do
        put :accept_task
        put :reject_task
      end
    end

    resources :images
    resources :portraits

    resources :document_templates, only: [:index, :create, :show, :destroy] do
      collection do
        get :archived_count
      end
      member do
        put :unarchive
      end
    end

    resources :collaborations, only: [:index, :show] do
      collection do
        get :get_pending_invitations
      end

    end
    resources :collaborators, only: [:index, :create, :destroy, :show] do
      collection do
        get :get_user
        get :search_collaborators
      end
    end

    resources :communications,only: [:create,:update,:show]

    resources :project_workflows do
      member do
        put :set_lock
        put :save_as_template
      end
    end
    resources :project_workflow_steps do
      member do
        put :set_assignee
      end
    end


  end

  resources :pdf_documents, only: [:show] do
    member do
      get :generate
    end
  end
  # Shallow routes, see http://guides.rubyonrails.org/routing.html on shallow nesting
  resources :projects do
    resources :project_text_section, shallow: true
    resources :project_budget, shallow: true
    resources :project_content_categories, shallow: true, only: [:create, :show, :update, :destroy] do
      post :add_field
      post :remove_field
      resources :content_category_items, shallow: true
    end
  end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # Keep at bottom.
  # BEWARE Ember provides routes for its subcontrollers as well
  # Since Ember is mounted at '/', it gobbles up everything
  mount_ember_assets :frontend, to: '/'
  mount_ember_app :frontend, to: '/'
end
