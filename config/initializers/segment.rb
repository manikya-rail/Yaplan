# Gon.global.segmentWriteKey = SEGMENT_WRITE_KEY  # If we want to pass the data to JS

require 'segment/analytics'

Analytics = Segment::Analytics.new(write_key: "nt35LJpQUjOBJxtBsGQvoee0cS6hXxU0",
                                   on_error: proc { |_status, msg| print msg })
 