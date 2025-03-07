class SprintChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sprint_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
