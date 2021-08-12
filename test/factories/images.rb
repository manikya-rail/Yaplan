require 'base64'

FactoryGirl.define do
  factory :image do
    document
    factory :valid_image do
      image 'data:image/jpg;base64,' + Base64.encode64(File.read(Rails.root + 'test/factories/images/grapple.jpg')).delete("\n")
    end
  end
end
