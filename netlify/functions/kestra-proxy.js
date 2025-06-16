export async function handler(event) {
  // Preserve the path and query after /kestra-proxy
  const kestraPath = event.rawUrl.replace(
    /^\/\.netlify\/functions\/kestra-proxy/,
    ""
  );
  const targetUrl = "https://ec76-2401-4900-8fc7-ff30-c939-155b-876-8e18.ngrok-free.app" + kestraPath;

  // CORS headers for preflight and responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Respond to OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Forward other methods to Kestra
  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: { 
        "Content-Type": event.headers["content-type"] || "application/json",
        // Forward any additional headers that might be needed
        ...(event.headers["authorization"] && { "Authorization": event.headers["authorization"] })
      },
      body: event.body,
    });
    
    const text = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("content-type") || "application/json"
      },
      body: text,
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Proxy error", 
        message: err.message,
        target: targetUrl 
      }),
    };
  }
}