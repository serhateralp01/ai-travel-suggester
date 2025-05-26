# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `OPENAI_API_KEY` in [.env.local](.env.local) to your OpenAI API key
3. Run the app:
   `npm run dev`

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

* `OPENAI_API_KEY`: Your OpenAI API key.

### Get an OpenAI API key

1. Go to [OpenAI Platform](https://platform.openai.com/signup) and sign up or log in.
2. Navigate to the [API keys](https://platform.openai.com/api-keys) section.
3. Create a new secret key and copy it.
4. Set the `OPENAI_API_KEY` in [.env.local](.env.local) to your OpenAI API key
