import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WishPayload {
  name: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, message }: WishPayload = await req.json();

    const brideEmail = "yazhiniyan018@gmail.com";
    const groomEmail = "restinpeace1623@gmail.com";

    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #ffeef8 0%, #fff5f7 100%); border-radius: 10px;">
            <h2 style="color: #d4145a; text-align: center; font-family: Georgia, serif;">💐 New Wedding Wish Received 💐</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; margin-bottom: 10px;"><strong>From:</strong> ${name}</p>
              <div style="border-left: 4px solid #d4145a; padding-left: 15px; margin-top: 15px;">
                <p style="font-size: 15px; font-style: italic; color: #555;">"${message}"</p>
              </div>
            </div>
            <p style="text-align: center; margin-top: 20px; color: #888; font-size: 14px;">
              🦋 Sent with love from your wedding invitation website 🦋
            </p>
          </div>
        </body>
      </html>
    `;

    const emailPromises = [brideEmail, groomEmail].map(async (email) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        },
        body: JSON.stringify({
          from: "Wedding Wishes <onboarding@resend.dev>",
          to: [email],
          subject: `💝 New Wedding Wish from ${name}`,
          html: emailContent,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to send email to ${email}:`, await response.text());
        return { success: false, email };
      }

      return { success: true, email };
    });

    const results = await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Wish submitted successfully!",
        emailResults: results,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing wish:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
