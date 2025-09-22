// oura client 

const OURA_API_KEY = Deno.env.get('API_KEY');
const OURA_BASE_URL = "https://api.ouraring.com/v2";

type DailyReadinessResponse = {
    data: {
        id: string;
        contributors: unknown; 
        day: string;
        score: number | null;
        temperature_deviation: number | null;
        temperature_trend_deviation: number | null;
        timestamp: string;
    }[];
    nextToken: string | null;
};

export class OuraApi{

    private apiKey: string | undefined = OURA_API_KEY;

    constructor(apiKey: string){
        this.apiKey = apiKey;
    }

    // daily readiness
    async getDailyReadiness(startDate?: Date, endDate?: Date): Promise<DailyReadinessResponse> {
        if(!startDate) {
            startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        }
        if(!endDate) {
            endDate = new Date();
        }

        const filters = new URLSearchParams();
        filters.append('start_date', startDate.toISOString());
        filters.append('end_date', endDate.toISOString());

        const url = `${OURA_BASE_URL}/usercollection/daily_readiness?${filters.toString()}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`
            },
        });
        return response.json();
    }
}