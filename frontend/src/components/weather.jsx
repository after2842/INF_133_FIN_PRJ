// components/WeatherDisplay.jsx
import { Cloud, MapPin, Thermometer } from 'lucide-react';

function Weather() {
    return (
        <div className="flex items-center gap-6 bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-600" />
                <span className="text-slate-800">Seattle, WA</span>
            </div>
            <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-slate-600" />
                <span className="text-slate-800">48°F</span>
            </div>
            <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-slate-600" />
                <span className="text-slate-800">Cloudy</span>
            </div>
        </div>
    );
}
//reutnr with api call. need to pass in temp, location, and the cloudy(change icon depending on sunny, cloudly, rainy)

export default Weather;