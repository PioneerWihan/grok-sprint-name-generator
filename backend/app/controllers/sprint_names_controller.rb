require "httparty"

class SprintNamesController < ApplicationController
  # Define a cache store (MemoryStore for now)
  CACHE = ActiveSupport::Cache::MemoryStore.new

  # Cache key for the sprint state
  SPRINT_STATE_KEY = "sprint_state"

  # Default state if cache is empty
  DEFAULT_STATE = {
    letter: "A",
    sprint_names: [],
    votes: {},
    reset: true,
    inspiration: ""
  }.freeze

  def current_state
    # Fetch state from cache, or initialize with default if not present
    CACHE.fetch(SPRINT_STATE_KEY) { DEFAULT_STATE.dup }
  end

  def generate
    letter = params[:letter]&.upcase || "A"
    inspiration = params[:inspiration]&.downcase || "fun"
    sprint_names = generate_sprint_names(letter, inspiration)
    votes = Hash[sprint_names.map { |name| [name, 0] }] # Reset votes to 0

    # Update state in cache
    new_state = {
      letter: letter,
      sprint_names: sprint_names,
      votes: votes,
      inspiration: inspiration,
      reset: true
    }
    CACHE.write(SPRINT_STATE_KEY, new_state)

    # Broadcast to all clients
    ActionCable.server.broadcast("sprint_channel", new_state)
    render json: new_state
  end

  def vote
    name = params[:name]
    current = current_state

    if current[:sprint_names].include?(name)
      current[:reset] = false
      current[:votes][name] ||= 0
      current[:votes][name] += 1
      CACHE.write(SPRINT_STATE_KEY, current)
      ActionCable.server.broadcast("sprint_channel", current)
    end

    head :ok
  end

  private

  def generate_sprint_names(letter, inspiration)
    url = "https://api.datamuse.com/words?sp=#{letter}???*&ml=#{inspiration}&v=enwiki&max=10"
    response = HTTParty.get(url)
    words = response.parsed_response

    if words.any?
      random = Random.new
      words.sample(5, random: random).map { |w| w["word"].capitalize }
    else
      5.times.map { "Sprint-#{letter.downcase}-#{rand(100)}" }
    end
  end
end