class AddFieldsToPlan < ActiveRecord::Migration[5.1]
  def change
    add_column :plans, :currency, :string
    add_column :plans, :interval, :string
  end
end
