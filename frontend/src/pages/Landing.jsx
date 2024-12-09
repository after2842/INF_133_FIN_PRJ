import { Calendar, Cloud, RefreshCw, CheckSquare, ChevronDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import gcal from '../assets/gcal.png';
import scheudle from '../assets/schedule.png';
import weather from '../assets/weather.png';
import canvas from '../assets/canvas.png'
import profile from '../assets/profile.jpg';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
    navigate('/register');
  };

    return <main className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Personal Digital Assistant
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-8">
            Seamlessly integrate and manage your schedules across multiple
            platforms in one place
            </p>
            <button onClick={handleGetStarted} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors" data-prototypeId="2">
            Get Started
            <ChevronDown size={20} />
            </button>
        </section>

        {/* Project Overview */}
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Project Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Managing multiple schedules across different platforms can be
                    overwhelming. Our digital assistant seamlessly integrates
                    Canvas, Google Calendar, weather services, and work schedules
                    into one intuitive interface, helping you stay organized and
                    productive.
                </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-xl">
                    <img src={canvas} alt="Canvas Logo" className="mb-4" />
                    <p className="font-medium">Canvas</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <img src={gcal} alt="Google Calendar Logo" className="mb-4" />
                    <p className="font-medium">Google Calendar</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <img src={weather} alt="Weather Service Logo" className="mb-4" />
                    <p className="font-medium">Weather</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl">
                    <img src={scheudle} alt="Work Schedule Logo" className="mb-4" />
                    <p className="font-medium">Work Schedule</p>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Meet the Team
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                <img src={profile} alt="Ryan Sungmo Troy Eurich" className="w-48 h-48 rounded-full mb-4 object-cover" />
                <h3 className="text-xl font-medium">Ryan Eurich</h3>
                </div>
                <div className="flex flex-col items-center">
                <img src="https://placehold.co/200x200" alt="Samuel Choi" className="w-48 h-48 rounded-full mb-4 object-cover" />
                <h3 className="text-xl font-medium">Samuel Choi</h3>
                </div>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Key Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                <Calendar className="w-12 h-12 mb-4 text-slate-700" />
                <h3 className="text-xl font-medium mb-2">Schedule Integration</h3>
                <p className="text-slate-600">
                    Combine all your schedules in one place
                </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                <RefreshCw className="w-12 h-12 mb-4 text-slate-700" />
                <h3 className="text-xl font-medium mb-2">Cross-platform Sync</h3>
                <p className="text-slate-600">
                    Stay synchronized across all devices
                </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                <Cloud className="w-12 h-12 mb-4 text-slate-700" />
                <h3 className="text-xl font-medium mb-2">Weather Updates</h3>
                <p className="text-slate-600">Real-time weather information</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                <CheckSquare className="w-12 h-12 mb-4 text-slate-700" />
                <h3 className="text-xl font-medium mb-2">Task Management</h3>
                <p className="text-slate-600">Organize and track your tasks</p>
                </div>
            </div>
            </div>
        </section>
    </main>
}
