"""
FourFlow Chart Service
A lightweight API for calculating natal charts using Kerykeion.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
from kerykeion import AstrologicalSubject

app = FastAPI(title="FourFlow Chart Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

geolocator = Nominatim(user_agent="fourflow-chart-service")
tf = TimezoneFinder()


class ChartRequest(BaseModel):
    birth_date: str  # YYYY-MM-DD
    birth_time: Optional[str] = None  # HH:MM
    birth_location: str
    lat: Optional[float] = None
    lng: Optional[float] = None


class PlanetInfo(BaseModel):
    name: str
    sign: str
    position: float
    abs_pos: float
    element: str
    quality: str
    house: Optional[str] = None
    retrograde: bool = False


class ChartResponse(BaseModel):
    context: str
    planets: list[PlanetInfo]
    sun_sign: str
    moon_sign: str
    rising_sign: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chart", response_model=ChartResponse)
def calculate_chart(req: ChartRequest):
    # Parse birth date
    try:
        dt = datetime.strptime(req.birth_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid birth_date format. Use YYYY-MM-DD.")

    # Geocode location if lat/lng not provided
    lat = req.lat
    lng = req.lng
    city = req.birth_location

    if lat is None or lng is None:
        try:
            location = geolocator.geocode(req.birth_location)
            if location:
                lat = location.latitude
                lng = location.longitude
                city = location.address.split(",")[0] if location.address else req.birth_location
            else:
                raise HTTPException(status_code=400, detail=f"Could not geocode location: {req.birth_location}")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Geocoding error: {str(e)}")

    # Find timezone from coordinates
    tz_str = tf.timezone_at(lng=lng, lat=lat)
    if not tz_str:
        tz_str = "UTC"

    # Parse birth time
    hour = 12  # Default to noon if unknown
    minute = 0
    time_known = req.birth_time is not None

    if req.birth_time:
        try:
            parts = req.birth_time.split(":")
            hour = int(parts[0])
            minute = int(parts[1]) if len(parts) > 1 else 0
        except (ValueError, IndexError):
            raise HTTPException(status_code=400, detail="Invalid birth_time format. Use HH:MM.")

    # Calculate chart using offline mode
    try:
        subject = AstrologicalSubject(
            "Subject",
            dt.year, dt.month, dt.day,
            hour, minute,
            lng=lng,
            lat=lat,
            tz_str=tz_str,
            online=False,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart calculation error: {str(e)}")

    # Extract planet data
    planet_attrs = [
        "sun", "moon", "mercury", "venus", "mars",
        "jupiter", "saturn", "uranus", "neptune", "pluto",
    ]

    planets = []
    for attr_name in planet_attrs:
        planet = getattr(subject, attr_name, None)
        if planet:
            planets.append(PlanetInfo(
                name=planet.name,
                sign=planet.sign,
                position=round(planet.position, 2),
                abs_pos=round(planet.abs_pos, 2),
                element=getattr(planet, 'element', 'Unknown'),
                quality=getattr(planet, 'quality', 'Unknown'),
                house=getattr(planet, 'house', None) if time_known else None,
                retrograde=getattr(planet, 'retrograde', False),
            ))

    # Get rising sign if time known
    rising_sign = None
    if time_known:
        first_house = getattr(subject, 'first_house', None)
        if first_house:
            rising_sign = getattr(first_house, 'sign', None)

    # Build context string
    sun_sign = subject.sun.sign if subject.sun else "Unknown"
    moon_sign = subject.moon.sign if subject.moon else "Unknown"

    context_parts = [f"Sun in {sun_sign}", f"Moon in {moon_sign}"]
    if rising_sign:
        context_parts.append(f"Rising in {rising_sign}")
    for p in planets:
        if p.retrograde:
            context_parts.append(f"{p.name} retrograde in {p.sign}")

    context = ". ".join(context_parts) + "."

    return ChartResponse(
        context=context,
        planets=planets,
        sun_sign=sun_sign,
        moon_sign=moon_sign,
        rising_sign=rising_sign,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
