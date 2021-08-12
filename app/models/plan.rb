class Plan < ActiveRecord::Base
  has_many :users
  after_create :sync_stripe_plan

  validate :duplicate_plans

  def sync_stripe_plan
    Stripe::Plan.create(amount: amount.to_i,
                        interval: interval,
                        name: name,
                        currency: currency,
                        id: name
                       )
  end

  private

  def duplicate_plans
    stripe_plans = Stripe::Plan.list.map(&:name)
    if stripe_plans.include?(name)
      errors.add(:duplication, 'Stripe plan with this name already exists. If you want to change it you have to recreate it')
    end
  end
end
