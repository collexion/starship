class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :stardate
      t.string :name

      t.timestamps
    end
  end
end
