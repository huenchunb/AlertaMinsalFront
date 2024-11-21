import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Successfully logged out" });

  response.cookies.set(".AspNetCore.Identity.Application", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
