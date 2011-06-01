class User < ActiveRecord::Base

  devise :database_authenticatable, :encryptable, :registerable, :confirmable, :recoverable, :rememberable, :trackable, :validatable, :lockable #, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
end
