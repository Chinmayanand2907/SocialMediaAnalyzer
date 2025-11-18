# YouTube Engagement Analyzer (MERN)

A full-stack analytics dashboard that evaluates the latest performance metrics for any public YouTube channel. Paste a channel ID to retrieve subscribers, calculate engagement KPIs, visualize recent video stats, and store historical reports.

## Tech Stack

- **Frontend:** React + Vite, Chakra UI, Recharts, Axios
- **Backend:** Node.js, Express, Mongoose, @googleapis/youtube
- **Database:** MongoDB (Atlas or local)

## Project Structure

```
client/   # React single-page app for input + visualization
server/   # Express REST API + MongoDB persistence
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance/cluster
- YouTube Data API v3 key

## Environment Variables

Copy the sample files and fill in your secrets:

```
cp server/env.example server/.env
cp client/env.example client/.env
```

`server/.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
YOUTUBE_API_KEY=your_youtube_data_api_key
CLIENT_URL=http://localhost:5173
```

`client/.env`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> Only the backend knows the YouTube API key. The React app calls the Express API, which proxies all YouTube requests securely.

## Getting Started

Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

Visit `http://localhost:5173`.

## API Reference

### `POST /api/analyze/channel`

Body: `{ "channelId": "UCxxxxxxxx" }`

Steps performed:

1. Fetch channel metadata & subscriber count (`channels.list`).
2. Fetch latest uploads (10) via `search.list`.
3. Fetch statistics for those videos (`videos.list`).
4. Compute each video’s engagement rate and an averaged channel engagement rate.
5. Persist the report in MongoDB and return it to the client.

### `GET /api/history`

Returns up to 20 saved reports (latest first) to quickly reload previous analyses.

## Frontend UX Highlights

- Chakra UI layout with responsive KPI cards and charts.
- Recharts bar chart for recent video views (sorted by publish date).
- Donut chart comparing aggregate likes vs. comments.
- Tabular breakdown of the latest 10 videos, including per-video engagement.
- History panel to reload prior reports.
- Full-screen loading overlay with optimistic toast notifications.

## Testing & Validation

- Uses Vite dev server for hot reloading.
- All API calls proxy through Axios with configurable `VITE_API_BASE_URL`.
- Server enforces required env vars and gracefully handles YouTube API errors.

## Next Steps / Ideas

- Add pagination + filters on history.
- Cache YouTube responses to reduce quota usage.
- Add auth and team workspaces for agencies.
- Streamline CI/CD deployment instructions (Render, Vercel, etc.).

## License

MIT © 2025

