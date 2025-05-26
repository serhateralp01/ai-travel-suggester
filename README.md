# AI Travel Suggester

AI Travel Suggester is a web application that provides personalized travel destination suggestions based on user preferences. It leverages the power of OpenAI to generate creative and relevant ideas, and Unsplash to display beautiful images of the suggested locations.

## Features

*   **Personalized Suggestions:** Get travel ideas tailored to your budget, travel companions, preferred holiday type, travel month, duration, and specific interests.
*   **"Surprise Me!" Mode:** Feeling adventurous? Let the AI pick a destination for you based on minimal input!
*   **Dynamic Destination Images:** See inspiring images for each suggestion, fetched dynamically from Unsplash.
*   **Save Favorite Searches:** Keep track of your favorite travel preference sets using browser LocalStorage.
*   **Interactive UI:** Clean and modern user interface for a smooth experience.

## Tech Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite (Build tool & Dev Server)
    *   Tailwind CSS (via CDN for styling)
*   **Backend (Serverless Functions on Vercel):**
    *   Node.js
*   **APIs & Services:**
    *   OpenAI API (gpt-4o-mini model) for travel suggestions.
    *   Unsplash API for destination images.
    *   Vercel for deployment and hosting serverless functions.

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/serhateralp01/ai-travel-suggester.git
    cd ai-travel-suggester
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables (Optional for Local Frontend Testing):**
    The application is designed to use Vercel environment variables for API keys in production. The frontend makes calls to backend serverless functions (`/api/getSuggestions`, `/api/fetchImage`) which then use these keys.

    If you intend to modify or test the frontend to call these services directly, or test the Vercel functions locally (e.g., using `vercel dev`), you would need to create a `.env` file in the root of your project with your API keys:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    ```
    **Note:** For running the application with `npm run dev`, these keys are not directly used by the frontend if it's calling the `/api/*` endpoints.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## Deployment to Vercel

This project is optimized for deployment on Vercel.

1.  **Push your code to a GitHub repository.**
2.  **Connect your GitHub repository to Vercel.**
3.  **Configure Environment Variables in Vercel:**
    In your Vercel project settings, add the following environment variables:
    *   `OPENAI_API_KEY`: Your OpenAI API key.
    *   `UNSPLASH_ACCESS_KEY`: Your Unsplash Access Key.
4.  **Deploy!** Vercel should automatically detect it as a Vite project and build it.

## API Endpoints

The application uses the following serverless functions (deployed on Vercel):

*   `/api/getSuggestions`: Accepts user preferences (POST request) and returns AI-generated travel suggestions.
*   `/api/fetchImage`: Accepts an image search query (GET request) and returns an image URL from Unsplash.

## Attributions

*   Suggestions Powered by OpenAI
*   Images from Unsplash
