const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.utzbupksqdtzbatwnucr:Murugaaa_05@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    await client.connect();
    console.log("Connected to DB!");
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

test();