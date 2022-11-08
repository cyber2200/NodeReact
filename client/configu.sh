Configu upsert --set "/client" --schema "./main.cfgu.json" --config "BACKEND_API_URL=http://localhost:3000" --config "DEFAULT_KEYWORD=test" --config "LIMIT_FEATURE_FLAG=1"
Configu export --set "/client" --schema "./main.cfgu.json" --format "Dotenv" > ".env"
