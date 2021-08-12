class CreatePortraits < ActiveRecord::Migration[5.1]
  def up
    create_table :portraits do |t|
      t.string :image
    end
  end

  def down
    drop_table :portraits
  end
end
