
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type EventType =
  | "REPORT_SUBMITTED"
  | "PHOTO_ADDED"
  | "AGENCY_ACCEPTED"
  | "ISSUE_RESOLVED";

type ImpactEvent = {
  id: string;
  reportId: string;
  type: EventType;
  timestamp: string;
  verified?: boolean;
};

const POINTS: Record<EventType, number> = {
  REPORT_SUBMITTED: 10,
  PHOTO_ADDED: 5,
  AGENCY_ACCEPTED: 25,
  ISSUE_RESOLVED: 100,
};

const LEVELS = [
  { name: "Civic Starter", min: 0 },
  { name: "Community Helper", min: 100 },
  { name: "Community Advocate", min: 300 },
  { name: "Civic Champion", min: 750 },
  { name: "Community Guardian", min: 1500 },
  { name: "Civic Legend", min: 3000 },
];

const BADGES = [
  { id: "first-report", name: "First Step", requirement: 1 },
  { id: "five-reports", name: "Active Citizen", requirement: 5 },
  { id: "ten-reports", name: "Neighborhood Hero", requirement: 10 },
  { id: "first-resolution", name: "Problem Solver", requirement: 1 },
  { id: "five-resolutions", name: "Change Maker", requirement: 5 },
];

function calculateImpact(events: ImpactEvent[]) {
  const seen = new Set<string>();

  const valid = events
    .filter((event) => {
      if (!POINTS[event.type]) return false;

      if (
        (event.type === "AGENCY_ACCEPTED" ||
          event.type === "ISSUE_RESOLVED") &&
        event.verified !== true
      ) {
        return false;
      }

      const key = `${event.reportId}:${event.type}`;

      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );

  const totalPoints = valid.reduce(
    (sum, event) => sum + POINTS[event.type],
    0
  );

  const reportCount = valid.filter(
    (event) => event.type === "REPORT_SUBMITTED"
  ).length;

  const resolvedCount = valid.filter(
    (event) => event.type === "ISSUE_RESOLVED"
  ).length;

  const acceptedCount = valid.filter(
    (event) => event.type === "AGENCY_ACCEPTED"
  ).length;

  const level =
    [...LEVELS]
      .reverse()
      .find((item) => totalPoints >= item.min) ||
    LEVELS[0];

  const nextLevel = LEVELS.find(
    (item) => item.min > totalPoints
  );

  const achievements = BADGES.filter((badge) => {
    if (badge.id.includes("resolution")) {
      return resolvedCount >= badge.requirement;
    }

    return reportCount >= badge.requirement;
  }).map((badge) => ({
    id: badge.id,
    name: badge.name,
    unlocked: true,
  }));

  return {
    totalPoints,
    level: level.name,
    nextLevel: nextLevel?.name ?? null,
    pointsToNextLevel: nextLevel
      ? nextLevel.min - totalPoints
      : 0,
    statistics: {
      reportsSubmitted: reportCount,
      reportsAccepted: acceptedCount,
      issuesResolved: resolvedCount,
    },
    achievements,
    history: valid.map((event) => ({
      eventId: event.id,
      reportId: event.reportId,
      action: event.type,
      points: POINTS[event.type],
      timestamp: event.timestamp,
    })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("events" in body) ||
      !Array.isArray(body.events)
    ) {
      return NextResponse.json(
        { error: "Expected an events array." },
        { status: 400 }
      );
    }

    const events = body.events;

    if (events.length > 1000) {
      return NextResponse.json(
        { error: "Too many events." },
        { status: 413 }
      );
    }

    const allowedTypes = new Set([
      "REPORT_SUBMITTED",
      "PHOTO_ADDED",
      "AGENCY_ACCEPTED",
      "ISSUE_RESOLVED",
    ]);

    const validShape = events.every(
      (event: unknown) => {
        if (typeof event !== "object" || event === null) {
          return false;
        }

        const e = event as Record<string, unknown>;

        return (
          typeof e.id === "string" &&
          e.id.length > 0 &&
          e.id.length <= 128 &&
          typeof e.reportId === "string" &&
          e.reportId.length > 0 &&
          e.reportId.length <= 128 &&
          typeof e.type === "string" &&
          allowedTypes.has(e.type) &&
          typeof e.timestamp === "string" &&
          !Number.isNaN(Date.parse(e.timestamp)) &&
          (e.verified === undefined ||
            typeof e.verified === "boolean")
        );
      }
    );

    if (!validShape) {
      return NextResponse.json(
        { error: "Invalid event data." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      impact: calculateImpact(events as ImpactEvent[]),
      note: "Calculated results only. No points have been permanently awarded.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "DistrictPulse PulsePoints Engine",
    version: "1.0",
    status: "operational",
    endpoint: "/api/impact",
    method: "POST",
    supportedEvents: POINTS,
    levels: LEVELS,
  });
}

