namespace :database do
  desc 'Import default stripe plans'
  task import_default_plans: :environment do
    filename = Rails.root.to_s + '/db/seeds/plans.yaml'
    data = YAML.load_file filename
    if data['plans'].present?
      stripe_plans = Stripe::Plan.list.map(&:id)
      data['plans'].each do |p|
        if stripe_plans.include?(p['id'])
          plan = Stripe::Plan.retrieve(p['id'])
          puts plan.to_s
          # Skipping callback allows us to create Plan in database without creating it online with Stripe
          Plan.skip_callback(:create, :after, :sync_stripe_plan)
          tmp_plan = Plan.new(name: plan.name, amount: plan.amount, currency: plan.currency, interval: plan.interval)
          if tmp_plan.save(validate: false)
            puts "Plan #{plan.name} loaded successfully."
          end
          Plan.set_callback(:create, :after, :sync_stripe_plan)
        else
          Plan.create(name: p['name'], amount: p['amount'], currency: p['currency'], interval: p['interval'])
        end
      end
      puts 'Plans loaded successfully.'
    end
  end
end
