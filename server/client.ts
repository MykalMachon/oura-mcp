// oura client

import { throwOuraError } from "./client.errors.ts";
import { DailyActivityResponse, DailyReadinessResponse, DailySleepResponse } from "./client.types.ts";

const OURA_API_KEY = Deno.env.get("API_KEY");
const OURA_BASE_URL = "https://api.ouraring.com/v2";

export class OuraApi {
  private apiKey: string | undefined = OURA_API_KEY;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Make a request to the Oura API
   * 
   * @param path the API endpoint path
   * @param options fetch options
   * @param filters URL search parameters
   * 
   * @returns the JSON response from the API
   */
  private async _request<T>(
    path: string,
    options?: RequestInit,
    filters?: URLSearchParams,
  ): Promise<T> {
    const url = `${OURA_BASE_URL}${path}${
      filters ? `?${filters.toString()}` : ""
    }`;
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options?.headers,
    };
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throwOuraError(response);
    }

    return response.json();
  }

  /**
   * Get daily activity data from Oura
   *
   * @param {Date} startDate the start of the period you would like data for
   * @param {Date} endDate the end of the period you would like data for
   * @returns {Promise<DailyActivityResponse>}
   */
  async getDailyActivity(
    startDate?: Date,
    endDate?: Date,
  ): Promise<DailyActivityResponse> {
    if (!startDate) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    if (!endDate) {
      endDate = new Date();
    }

    const filters = new URLSearchParams();
    filters.append("start_date", startDate.toISOString());
    filters.append("end_date", endDate.toISOString());

    const dailyActivity = await this._request<DailyActivityResponse>("/usercollection/daily_activity", {}, filters);

    return dailyActivity;
  }

  /**
   * Get daily readiness data from Oura
   * 
   * @param {Date} startDate the start of the period you would like data for
   * @param {Date} endDate the end of the period you would like data for
   * @returns {Promise<DailyReadinessResponse>}
   */
  async getDailyReadiness(
    startDate?: Date,
    endDate?: Date,
  ): Promise<DailyReadinessResponse> {
    if (!startDate) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    if (!endDate) {
      endDate = new Date();
    }

    const filters = new URLSearchParams();
    filters.append("start_date", startDate.toISOString());
    filters.append("end_date", endDate.toISOString());

    const dailyReadiness = await this._request<DailyReadinessResponse>("/usercollection/daily_readiness", {}, filters);

    return dailyReadiness;
  }

  /**
   * Get daily sleep data from Oura
   *
   * @param {Date} startDate the start of the period you would like data for
   * @param {Date} endDate the end of the period you would like data for
   * @returns {Promise<DailySleepResponse>}
   */
  async getDailySleep(startDate?: Date, endDate?: Date): Promise<DailySleepResponse> {
    if (!startDate) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    if (!endDate) {
      endDate = new Date();
    }

    const filters = new URLSearchParams();
    filters.append("start_date", startDate.toISOString());
    filters.append("end_date", endDate.toISOString());

    const sleepRoutes = await this._request<DailySleepResponse>("/usercollection/daily_sleep", {}, filters);

    return sleepRoutes;
  }

  /**
   * Get detailed heart rate data from Oura.
   * 
   * @param {Date} startDateTime the start of the period you would like data for
   * @param {Date} endDateTime the end of the period you would like data for
   * @returns {Promise<HeartRateResponse>}
   */
  async getHeartRate(startDateTime?: Date, endDateTime?: Date) {
    if (!startDateTime) {
      startDateTime = new Date(new Date().setDate(new Date().getDate() - 1));
    }
    if (!endDateTime) {
      endDateTime = new Date();
    }

    const filters = new URLSearchParams();
    filters.append("start_date", startDateTime.toISOString());
    filters.append("end_date", endDateTime.toISOString());

    const heartRate = await this._request("/usercollection/heartrate", {}, filters);

    return heartRate;
  }
}
