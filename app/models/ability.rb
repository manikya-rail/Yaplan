class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities
    user ||= User.new

    can :manage, :all if user.admin?
    can :manage, WorkflowTemplate do |template|
        (user.admin? && template.is_public) || template.created_by_id == user.id
    end
    can :manage, [Document, Project], created_by_id: user.id
    can :manage, Document do |template|
        (user.admin? && template.is_public) || template.created_by_id == user.id ||
            template.project.created_by_id == user.id
    end
    can :manage, Portrait, user_id: user.id
    can :manage, ProjectWorkflow, project: { created_by_id: user.id }
    can :manage, SectionContainer, document: { created_by_id: user.id }
    can :manage, SectionText, created_by: user.id

    can :accept_invitation, [Project, Document], collaborations: { collaborator_id: user.id }
    can :reject_invitation, [Project, Document], collaborations: { collaborator_id: user.id }
    can :lock, ProjectWorkflow, project: { created_by_id: user.id }
    can :submit_document, Document, assigned_to_id: user.id
    can :manage, UserTask, user_id: user.id
    can :change_state, UserTask, user_id: user.id
    can [:approve, :reject], Document, approver_id: user.id
    can [:read, :edit,:update, :add_tags, :remove_tags, :invites], Document do |obj|
        obj.can_access?(user)
    end
    can :read, Document do |obj|
        obj.is_public == true  #read admin-published document templates
    end
    can :read, User, id: user.id

    can [:read, :can_create_documents,:view,:collaborators, :members, :invites], Project do |obj|
      obj.can_access?(user)
    end

    can :destroy, Comment do |c| 
        c.commenter_id == user.id
    end
  end
end
