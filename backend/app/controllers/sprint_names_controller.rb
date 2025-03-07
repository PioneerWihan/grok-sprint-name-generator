require "httparty"

class SprintNamesController < ApplicationController
  before_action :initialize_state, only: [:generate, :vote]

  def current_state
    {
      letter: @letter,
      sprint_names: @sprint_names,
      votes: @votes # e.g., { "Name1" => 2, "Name2" => 0 }
    }
  end

  def generate
    @letter = params[:letter]&.upcase || "A"
    @inspiration = params[:inspiration]&.downcase || "fun"
    @sprint_names = generate_sprint_names(@letter, @inspiration) # Your name generation logic
    @votes = Hash[@sprint_names.map { |name| [name, 0] }] # Reset votes to 0
    ActionCable.server.broadcast("sprint_channel", current_state)
    render json: current_state
  end

  def vote
    name = params[:name]
    # client_id = params[:client_id] # Optional: track votes per client
    @votes[name] += 1 if @votes.key?(name)
    ActionCable.server.broadcast("sprint_channel", current_state)
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

  def initialize_state
    @letter ||= "A"
    @sprint_names ||= []
    @votes ||= {}
  end
end
