class TrackChange
  require 'htmldiff'
  class << self
    include HTMLDiff
  end
  
end