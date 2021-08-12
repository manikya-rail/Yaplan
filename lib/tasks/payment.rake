namespace :payment do
  desc 'Import chargebee payment plans into DB'
  task import_chargebee_plans: :environment do
    plan_list = ChargeBee::Plan.list('status[is]' => 'active').map(&:plan)

    plan_list.each do |plan|
      existing_plan = ChargePlan.find_by code: plan.id
      if existing_plan
        existing_plan.update_with(plan)
      else
        ChargePlan.create(name: plan.name, code: plan.id, amount: plan.price, currency: plan.currency_code, interval: plan.period_unit, project_count: plan.description.to_f.round)
      end
    end
    puts plan_list.count.to_s + ' plans loaded successfully.'
  end

  desc 'Purge all payment plans'
  task purge_chargebee_plans: :environment do
    ChargePlan.delete_all
  end

  desc 'Purge all subscription data'
  task purge_subscriptions: :environment do
    User.update_all(customer_id: nil, charge_plan_id: nil, card: nil, subscription_id: nil)
  end
end
