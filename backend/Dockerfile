# backend/Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 6000

# Define environment variable for production
ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "start"]
