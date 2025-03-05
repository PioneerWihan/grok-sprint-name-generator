# app/controllers/sprint_names_controller.rb

# Define a hash of fun, thematic words for each letter
WORD_LIST = {
  "A" => [ "Astro", "Axiom", "Alpaca", "Aurora" ],
  "B" => [ "Blitz", "Bazooka", "Bison", "Byte" ],
  "C" => [ "Cosmo", "Cobra", "Cipher", "Crux" ],
  "D" => [ "Drift", "Dynamo", "Dragon", "Delta" ],
  "E" => [ "Echo", "Ember", "Eagle", "Enigma" ],
  "F" => [ "Flux", "Falcon", "Flicker", "Forge" ],
  "G" => [ "Gizmo", "Glitch", "Gopher", "Gravity" ],
  "H" => [ "Halo", "Hawk", "Hex", "Hyper" ],
  "I" => [ "Ion", "Igloo", "Iris", "Impact" ],
  "J" => [ "Jolt", "Jaguar", "Jinx", "Jupiter" ],
  "K" => [ "Karma", "Kestrel", "Kernel", "Kilo" ],
  "L" => [ "Lunar", "Lynx", "Laser", "Lift" ],
  "M" => [ "Mystic", "Maverick", "Matrix", "Meteor" ],
  "N" => [ "Nexus", "Nomad", "Neon", "Nova" ],
  "O" => [ "Orbit", "Onyx", "Ogre", "Omega" ],
  "P" => [ "Pulse", "Panther", "Pixel", "Phantom" ],
  "Q" => [ "Quark", "Quest", "Quartz", "Quip" ],
  "R" => [ "Radar", "Rogue", "Raven", "Rush" ],
  "S" => [ "Spark", "Sphinx", "Sonic", "Sprint" ], # Nod to the project!
  "T" => [ "Turbo", "Titan", "Tracer", "Twist" ],
  "U" => [ "Ultra", "Umbra", "Unity", "Uplink" ],
  "V" => [ "Vortex", "Viper", "Vector", "Vibe" ],
  "W" => [ "Wave", "Wraith", "Whiz", "Warp" ],
  "X" => [ "Xeno", "Xray", "Xylem", "Xenon" ],
  "Y" => [ "Yeti", "Yield", "Yarn", "Yolo" ],
  "Z" => [ "Zen", "Zephyr", "Zigzag", "Zoom" ]
}.freeze # Freeze to prevent accidental modification

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
    ("A".."Z").to_a[[ sprint_number - 1, 25 ].min] # Cap at Z (index 25)
  end

  def generate_sprint_name(letter)
    letter = letter.upcase
    words = WORD_LIST[letter]
    words.sample.capitalize
  end
end
