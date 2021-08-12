STRIPE_SECRET_KEY = "sk_test_gWZRNbTgEodfQ54iuSTldtgF" # Pimovation::Application.config.STRIPE_SECRET_KEY
STRIPE_PUBLIC_KEY = "pk_test_4em4OAmPvs5JBYXfQtBXzU2b" # Pimovation::Application.config.STRIPE_PUBLIC_KEY

Rails.configuration.stripe = {
  publishable_key: STRIPE_PUBLIC_KEY,
  secret_key: STRIPE_SECRET_KEY
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
