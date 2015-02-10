class Marker < ActiveRecord::Base
  validate :name, uniqueness: true
  validate :name, presence: true
  validate :location, presence: true

  validates :lat, uniqueness: {scope: :lng, message:"lat/lng have already been asigned"}
end
