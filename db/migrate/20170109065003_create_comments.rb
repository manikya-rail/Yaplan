class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.string :comment_text
      t.references :commentable, polymorphic: true, index: true
      t.integer :commenter_id, foreign_key: true
      t.integer :parent_comment_id
      t.timestamps null: false
    end
  end
end
