export type PersonalInfo = {
	id: string;
	age: number;
	weight: number;
	height: number;
	biological_sex: string;
	email: string;
}

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

export type HeartRateData = {
	bpm: number;
	source: string;
	timestamp: string;
};

export type HeartRateResponse = {
	data: HeartRateData[];
	nextToken: string | null;
}

export type DailyStress = {
	id: string;
	day: string;
	stress_high: number;
	stress_average: number;
	stress_low: number;
	recovery_high: number;
	recovery_average: number;
	recovery_low: number;
	timestamp: string;
};

export type DailyStressResponse = {
	data: DailyStress[];
	nextToken: string | null;
};

export type Workout = {
	id: string;
	day: string;
	start_datetime: string;
	end_datetime: string;
	sport: string;
	source: string;
	calories: number;
	distance: number | null;
	duration: number;
	intensity: string;
	label: string | null;
	source_name: string;
	strain: number | null;
	timestamp: string;
};

export type WorkoutResponse = {
	data: Workout[];
	nextToken: string | null;
};

export type DailySPO2 = {
	id: string;
	day: string;
	contributors: Record<string, unknown>;
	spo2_percentage: number | null;
	timestamp: string;
};

export type DailySPO2Response = {
	data: DailySPO2[];
	nextToken: string | null;
};