class CreateCatalogObjects < ActiveRecord::Migration
  def change
    create_table :catalog_objects do |t|
      t.string :name
      t.text :description
      t.string :type
      t.integer :current_hp
      t.integer :max_hp
      t.float :heading
      t.string :current_velocity
      t.string :max_velocity
      t.string :position
      t.string :radius
      t.integer :max_cargo
      t.boolean :dockable

      t.timestamps
    end
  end
end
