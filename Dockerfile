FROM node:14-slim

# Create the app directory in the container
WORKDIR /app

# Install dnsutils
RUN apt-get update && apt-get install -y dnsutils

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json .

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV PORT=3000

# Expose the port your app runs on
EXPOSE $PORT

# Install nodemon globally
RUN npm install -g nodemon

# Start your application with nodemon
CMD ["nodemon", "server.js"]
