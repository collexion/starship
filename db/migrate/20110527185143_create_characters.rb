class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.integer :user_id
      t.string :name
      t.integer :xp

      t.timestamps
    end
  end
end
