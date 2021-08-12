class ChangeColumnNameCountryCode < ActiveRecord::Migration[5.1]
  def change
  	rename_column :users, :contry_code, :country_code
  end
end
