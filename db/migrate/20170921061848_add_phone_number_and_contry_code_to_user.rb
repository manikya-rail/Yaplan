class AddPhoneNumberAndContryCodeToUser < ActiveRecord::Migration[5.1]
  def change
  	add_column  :users, :phone_number, :string
  	add_column  :users, :contry_code, :string
  end
end
