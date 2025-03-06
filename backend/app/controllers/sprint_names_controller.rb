require "httparty"

class SprintNamesController < ApplicationController
  def generate
    letter = params[:letter]&.upcase || "A" # Default to 'A' if not provided
    inspiration = params[:inspiration]&.downcase || "fun" # Default to 'fun'
    sprint_names = generate_sprint_names(letter, inspiration)
    render json: { sprint_letter: letter, sprint_names: sprint_names }
  end

  private

  def generate_sprint_names(letter, inspiration)
    url = "https://api.datamuse.com/words?sp=#{letter}???*&ml=#{inspiration}&v=enwiki&max=10"
    response = HTTParty.get(url)
    words = response.parsed_response

    if words.any?
      words.take(5).map { |w| w["word"].capitalize }
    else
      5.times.map { "Sprint-#{letter.downcase}-#{rand(100)}" }
    end
  end
end
