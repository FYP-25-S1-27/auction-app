export async function POST(req: Request) {
    const { userId, newPassword } = await req.json();
  
    if (!userId || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Missing userId or newPassword" }),
        { status: 400 }
      );
    }
  
    try {
      // Get Management API token
      const tokenRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
          grant_type: "client_credentials",
        }),
      });
  
      if (!tokenRes.ok) {
        const errorData = await tokenRes.json();
        console.error("Error getting management token:", errorData);
        return new Response(
          JSON.stringify({ error: "Failed to get access token", details: errorData }),
          { status: 500 }
        );
      }
  
      const { access_token } = await tokenRes.json();
  
      // Update password via Management API
      const updateRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });
  
      if (!updateRes.ok) {
        const updateError = await updateRes.json();
        console.error("Error updating password:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update password", details: updateError }),
          { status: 500 }
        );
      }
  
      return new Response(
        JSON.stringify({ message: "Password updated successfully" }),
        { status: 200 }
      );
  
    } catch (err) {
      console.error("Unexpected error:", err);
      return new Response(
        JSON.stringify({ error: "Unexpected error", details: err }),
        { status: 500 }
      );
    }
  }
  