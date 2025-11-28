import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

console.log(clientId);
console.log(clientSecret);
async function exchangeCodeForTokens(code) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const data = await res.json();
  return data; // contains access_token, refresh_token, expires_in, scope
}

// Example:
const tokens = await exchangeCodeForTokens(
  "AQBt0cvmRA_ijko-Qrp8QHD8OUsGM4X6gaiHX4dPmxZhnCyVA60OPUJ45EaCg0KnP1_1S1pJBTU3OrVR3eC1fsIXF3xsqa8ZTOwY1HbvodT6DnUBDsGTLNb8ohusa-h-dbcNivmRX37ebWZSWkk4PnRMJRcUkGBkP97kXSP2HwSNJEDwksFSYRiJ6QJk4h9v_ETbqiwKT9XI0gQSrd04XLSVJGE3H0VJ0W3QAke9adMS5Ujb0kLc_hgkzbbFfqj7B-eZJ2DAWiVEqebGldaqXbMfXRtJhUPCfBFUAi7QaOoyt9tQTsWDBuFNSouCa1HLMc81XhCNp1bm9DRmZ9pq2BMBMWrhSKYwZNIVX8MmlwOTGCqo_mqAw1-RSfn-pVMtVITUsSf4hXcAIcK8koGY9GRM7mnGh-0LKjtLClYWmLYpj2xEpcwy2OLCeUXV55QfAZEx2fKyng-p08d9k1RZZG1vaibIa3GSC2zu5LasM_XJXyzFO_E6wPUAY_Ii8CfG-7zqRi_JBjTTWBAIO5vC4SO246AoZq0hYhYpk5qZlje9tQTM5Qs4DoF4dJV7YaY1dwPbmq4b9ig819fAV4gENQh3agy18KWALHTph7REywUsc7B-n6Cs6F7NPytBiGOqSyN1vUImmhzgWFZ1B7bGRFhvLwzD94SFR106ZYmMuNcpH702-1kWVpRGIm9Zg3_Uw3P908CNFnCyJKaC-Yf2nAnA"
);
console.log(tokens);
