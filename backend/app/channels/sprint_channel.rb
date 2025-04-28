class SprintChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sprint_channel"
    transmit_current_state
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def transmit_current_state
    current_state = SprintNamesController::CACHE.fetch(SprintNamesController::SPRINT_STATE_KEY) { SprintNamesController::DEFAULT_STATE.dup }
    ActionCable.server.broadcast("sprint_channel", current_state)
  end
end
