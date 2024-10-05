# Running the Project in a Local Environment

Follow these steps to set up and run the project locally:

## Prerequisites

- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- npm (v6.x or later)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/quoc0212/node-mongodb-2.git
   cd node-mongodb
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/yourdbname
   PORT=3000
   ```

## Running the Project

1. **Start MongoDB:**
   Ensure MongoDB is running. You can start it using:

   ```bash
   mongod
   ```

2. **Run the application:**

   ```bash
   npm start
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Testing

To run tests, use the following command:

```bash
npm test
```

## Troubleshooting

- Ensure MongoDB is running and accessible.
- Check the `.env` file for correct configurations.
- Review the console output for any error messages.

For further assistance, refer to the [documentation](https://github.com/yourusername/node-mongodb/wiki) or open an issue on GitHub.
