class RakeTaskForSeeding < ActiveRecord::Migration[5.1]
  def change
    Rake::Task['database:import_default_plans'].execute
  end
end
