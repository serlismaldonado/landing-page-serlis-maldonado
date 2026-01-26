import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "serlismaldonado";

interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 },
    );
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { username: USERNAME },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 500 },
      );
    }

    const weeks =
      data.data.user.contributionsCollection.contributionCalendar.weeks;

    // Transform to our format
    const contributions = weeks.flatMap((week: GitHubContributionWeek) =>
      week.contributionDays.map((day: GitHubContributionDay) => ({
        date: day.date,
        intensity:
          day.contributionCount > 0
            ? Math.min(4, Math.ceil(day.contributionCount / 3))
            : 0,
        count: day.contributionCount,
      })),
    );

    return NextResponse.json({
      contributions,
      total:
        data.data.user.contributionsCollection.contributionCalendar
          .totalContributions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 },
    );
  }
}
