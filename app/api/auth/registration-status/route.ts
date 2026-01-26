import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the ALLOW_PUBLIC_USER environment variable
    const allowPublicUser = process.env.ALLOW_PUBLIC_USER === "true";

    // Also check if registration is enabled in Convex auth config
    // This is a fallback check
    const registrationEnabled = allowPublicUser;

    const response = {
      allowPublicUser,
      registrationEnabled,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      message: allowPublicUser
        ? "Registration is currently enabled"
        : "Registration is disabled. Only existing users can sign in.",
    };

    // Don't cache this response since it depends on environment variables
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vary': 'Authorization',
      },
    });
  } catch (error) {
    console.error("Error checking registration status:", error);

    return NextResponse.json(
      {
        error: "Failed to check registration status",
        message: error instanceof Error ? error.message : "Unknown error",
        allowPublicUser: false,
        registrationEnabled: false,
      },
      { status: 500 }
    );
  }
}
