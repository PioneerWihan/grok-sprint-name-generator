require "httparty"

class SprintNamesController < ApplicationController
  def generate
    current_date = Date.parse(params[:date] || Date.today.to_s)
    inspiration = params[:inspiration]&.downcase || "fun" # Default to 'fun' if not provided
    sprint_letter = calculate_sprint_letter(current_date)
    sprint_names = generate_sprint_names(sprint_letter, inspiration)
    render json: { sprint_letter: sprint_letter, sprint_names: sprint_names }
  end

  private

  def calculate_sprint_letter(date)
    start_date = Date.new(2025, 1, 1)
    days_since_start = (date - start_date).to_i
    sprint_number = (days_since_start / 14) + 1
    ("A".."Z").to_a[[ sprint_number - 1, 25 ].min]
  end

  def generate_sprint_names(letter, inspiration)
    url = "https://api.datamuse.com/words?sp=#{letter}*&rel_trg=#{inspiration}&max=10"
    response = HTTParty.get(url)
    words = response.parsed_response

    if words.any?
      seed = letter.ord
      random = Random.new(seed)
      words.sample(5, random: random).map { |w| w["word"].capitalize }
    else
      5.times.map { "Sprint-#{letter.downcase}-#{rand(100)}" }
    end
  end
end
