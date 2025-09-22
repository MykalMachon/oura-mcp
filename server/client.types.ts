export type DailyReadiness = {
  id: string;
  contributors: Record<string, unknown>;
  day: string;
  score: number | null;
  timestamp: string;
};

export type DailyReadinessResponse = {
  data: DailyReadiness[];
  nextToken: string | null;
};

export type DailyActivity = {
    id: string;
    class_5_min: (number | null)[];
    score: number | null;
    active_calories: number;
    average_met_minutes: number;
    contributors: Record<string, unknown>;
    equivalent_walking_distance: number;
    high_activity_met_minutes: number;
    high_activity_time: number;
    inactivity_alerts: number;
    low_activity_met_minutes: number;
    low_activity_time: number;
    medium_activity_met_minutes: number;
    medium_activity_time: number;
    meters_to_target: number;
    non_wear_time: number;
    resting_time: number;
    sedentary_met_minutes: number;
    sedentary_time: number;
    steps: number;
    target_calories: number;
    target_meters: number;
    total_calories: number;
    day: string;
    timestamp: string;
  };

export type DailyActivityResponse = {
  data: DailyActivity[];
  nextToken: string | null;
};

export type DailySleep = {
    id: string;
    contributors: Record<string, unknown>;
    day: string;
    score: number | null;
    timestamp: string;
}

export type DailySleepResponse = {
    data: DailySleep[];
    nextToken: string | null;
}