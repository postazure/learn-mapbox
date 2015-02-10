class LocationsController < ApplicationController
  def index

  end

  def add_pin
    geo_data = Geocoder.search(params[:marker][:location])
    if geo_data.empty?
      render json:{address:["address was not found"]}, status:422
    else
      geo_coords = geo_data[0].geometry["location"]

      @marker = Marker.new(marker_params)
      @marker.lng = geo_coords["lng"]
      @marker.lat = geo_coords["lat"]

      if @marker.save
        render json:@marker
      else
        render json:@marker.errors.messages, status:422
      end
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
