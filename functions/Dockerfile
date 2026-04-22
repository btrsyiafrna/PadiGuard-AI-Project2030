# Use Node.js 20 as the base image
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# --- Production Stage ---
FROM node:20-slim

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/lib ./lib
COPY --from=build /app/node_modules ./node_modules

# Expose port 8080
EXPOSE 8080

# Define environment variables
# Note: GOOGLE_GENAI_API_KEY should be provided at runtime via Cloud Run environment variables or Secret Manager
ENV PORT=8080
ENV NODE_ENV=production

# Command to run the application
# We use 'node lib/index.js' assuming index.js calls ai.serve()
CMD ["node", "lib/index.js"]
