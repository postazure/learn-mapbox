class CreateMarkers < ActiveRecord::Migration
  def change
    create_table :markers do |t|
      t.string :name
      t.float :lat
      t.float :lng
      t.string :location

      t.timestamps
    end
  end
end
