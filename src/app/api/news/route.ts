import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { NEWS_API_KEY } from "@/config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fromDate = from.toISOString().split("T")[0];

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        apiKey: NEWS_API_KEY,
        q: query,
        from: fromDate,
        sortBy: "popularity",
        pageSize: 10,
        page: page,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.statusText },
        { status: error.response.status }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
