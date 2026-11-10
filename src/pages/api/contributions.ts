import type { APIRoute } from 'astro'
import { serverEnv } from '@/lib/env'

const USERNAME = "serlismaldonado";

interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export const GET: APIRoute = async () => {
  const GITHUB_TOKEN = serverEnv('GITHUB_TOKEN');
  if (!GITHUB_TOKEN) {
    return Response.json(
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
      return Response.json(
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

    return Response.json({
      contributions,
      total:
        data.data.user.contributionsCollection.contributionCalendar
          .totalContributions,
    }, {
      // El calendario de GitHub cambia poco: cachear en el CDN 1 h para no gastar la API en cada visita.
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch contributions" },
      { status: 500 },
    );
  }
}

export const prerender = false
