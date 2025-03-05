# app/controllers/sprint_names_controller.rb
class SprintNamesController < ApplicationController
  def generate
    current_date = Date.parse(params[:date] || Date.today.to_s)
    sprint_letter = calculate_sprint_letter(current_date)
    sprint_name = generate_sprint_name(sprint_letter)
    render json: { sprint_letter: sprint_letter, sprint_name: sprint_name }
  end

  private

  def calculate_sprint_letter(date)
    start_date = Date.new(2025, 1, 1)
    days_since_start = (date - start_date).to_i
    sprint_number = (days_since_start / 14) + 1
    ("A".."Z").to_a[sprint_number - 1] || "Z" # Cap at Z
  end

  def generate_sprint_name(letter)
    attempts = 0
    max_attempts = 1000

    # List of Faker categories to randomly choose from
    # Call the selected Faker method
    faker_categories = [
      Faker::Company.buzzword,          # e.g., "Synergy"
      Faker::Games::Pokemon.name,       # e.g., "Pikachu"
      Faker::Movie.title,               # e.g., "The Matrix"
      Faker::Space.planet,              # e.g., "Mars"
      Faker::Food.dish,                 # e.g., "Pizza"
      Faker::Superhero.name,            # e.g., "Captain Planet"
      Faker::Creature::Animal.name      # e.g., "Penguin"
    ]

    loop do
      name = faker_categories.sample

      return "#{name.capitalize}" if name.downcase.start_with?(letter.downcase)

      attempts += 1
      if attempts >= max_attempts
        return "Sprint-#{letter.downcase}" # Fallback
      end
    end
  end
end
