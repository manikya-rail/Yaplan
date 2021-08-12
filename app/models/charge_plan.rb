  class ChargePlan < ActiveRecord::Base
  has_many :users, class_name: 'User'

  validates_uniqueness_of :code

  def update_with(plan)
    self.name = plan.name
    self.amount = plan.price
    self.interval = plan.period_unit
    self.currency = plan.currency_code
    self.project_count = plan.description.to_f.round

    save
  end

  # private
  # 	def set_project_counts
  # 		if self.code == 'cbdemo_free'
  # 			self.update_attribute(:project_count, 3)
  # 		else
  # 			self.update_attribute(:project_count, -1)
  # 		end
  # 	end
end
