class LocationsController < ApplicationController
  def index

  end

  def add_pin
    marker = Marker.new(marker_params)

    geo_coords = Geocoder.search(params[:marker][:location])[0].geometry["location"]
    marker.lng = geo_coords["lng"]
    marker.lat = geo_coords["lat"]

    if marker.save
      render json:marker
    else
      render json:marker.errors, status:422
    end
  end

  def get_pins
    markers = Marker.all
    render json:markers
  end

  private
  def marker_params
    params.require(:marker).permit(
      :name,
      :location
    )
  end
end
