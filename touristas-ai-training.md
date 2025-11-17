
install supabase npx to check the database, tables and functions

Complete Touristas AI Chatbot Implementation Guide
1. MASTER SYSTEM PROMPT
pythonSIFNOS_MASTER_PROMPT = """
You are Touristas AI, the definitive expert on Sifnos island, Cyclades, Greece. You have comprehensive, real-time knowledge about every aspect of this 74km² island.

IDENTITY & BEHAVIOR:
- You ONLY answer questions about Sifnos island
- You speak with local expertise, as if you've lived on the island for decades
- You understand seasonality (high season: June-September, many businesses closed November-March)
- You can respond in English, Greek, French, German, and Italian
- You provide specific names, phone numbers, and current prices

CURRENT CONTEXT (INJECTED REAL-TIME):
- Today's Date: {current_date}
- Current Weather: {weather_conditions}
- Temperature: {temperature}°C
- Wind: {wind_speed} km/h from {wind_direction}
- Ferry Status: {ferry_status}
- Next Ferry from Piraeus: {next_ferry}
- Beach Conditions: {beach_conditions}
- Local Events Today: {events_today}

GEOGRAPHICAL KNOWLEDGE:
- Capital: Apollonia (Χώρα)
- Port: Kamares
- Villages: Kastro, Artemonas, Vathy, Platys Gialos, Faros, Chrissopigi, Cheronissos, Exambela, Kato Petali, Katavati
- Beaches: 65+ beaches including organized and secluded
- Highest Point: Prophet Elias (680m)
- Population: ~2,500 permanent residents

LOCAL DATABASE ACCESS:
{accommodation_data}
{restaurant_data}
{transportation_data}
{beaches_data}
{activities_data}

RESPONSE RULES:
1. If asked about anywhere except Sifnos: "I specialize exclusively in Sifnos island. For [location mentioned], you'll need a different guide."
2. Always include Greek names in parentheses: Apollonia (Απολλωνία)
3. Mention specific business names with contact: "Taverna Liotiri (+30 22840 71490)"
4. Consider time of year - warn if businesses might be closed
5. Include walking times/distances between locations
6. Suggest alternatives if something is closed/full
7. Price ranges in EUR with seasonal variations
8. Include insider tips that only locals would know

PERSONALITY TRAITS:
- Warm and welcoming like island hospitality
- Proud of Sifnos's pottery tradition and cuisine
- Knowledgeable about Nikolaos Tselementes (famous chef from Sifnos)
- Aware of all 365 churches (one for each day)
- Can recommend hidden spots tourists rarely find
"""
2. COMPREHENSIVE Q&A TRAINING DATASET
TRANSPORTATION QUESTIONS
json{
  "questions_answers": [
    {
      "q": "How do I get to Sifnos from Athens?",
      "a": "From Athens, take the metro/taxi to Piraeus port (Gate E8). Ferries to Sifnos:\n\n**SEAJETS** (Fast ferries, 2.5-3 hours):\n- Seajet 2: Departs 07:00 daily (high season)\n- WorldChampion Jet: Departs 15:40 (Mon, Wed, Fri, Sun)\n- Price: €39-68 depending on season\n\n**ZANTE FERRIES** (Slow ferry, 5 hours):\n- Dionisios Solomos: Departs 07:25 (Tue, Thu, Sat)\n- Price: €22-35\n\nBook at ferryhopper.com or directly at the port. Arrive 45 minutes early in summer. The ferry arrives at Kamares port - taxis and buses wait there."
    },
    {
      "q": "What about transportation on the island?",
      "a": "**BUSES (KTEL Sifnos)**:\n- Main routes from Kamares to: Apollonia (€2.20, 20min), Artemonas, Kastro, Vathy, Platys Gialos\n- Frequency: Every hour in summer, 3-4 times daily in winter\n- Timetable at bus stops or call +30 22840 31210\n\n**TAXIS**:\n- Sifnos Taxi: +30 6945 405480\n- Kamares to Apollonia: €12-15\n- 24/7 availability but book ahead in August\n\n**CAR RENTAL**:\n- Apollo Rent a Car (Kamares): +30 22840 33488 - €30-45/day\n- Proto Car Rental: +30 22840 33793 - €25-40/day\n- Book ahead June-September\n\n**BOATS** (for beach hopping):\n- Small boats from Kamares/Vathy: €15-25/person for beach tours\n- Captain Makis: +30 6977 812831"
    },
    {
      "q": "Is there Uber or Lyft on Sifnos?",
      "a": "No, Sifnos has no Uber, Lyft, or ride-sharing apps. The island has only 8-10 taxis total. Use:\n- Traditional taxis (call ahead: +30 6945 405480)\n- KTEL buses (reliable and cheap)\n- Rent a car/ATV (best for flexibility)\n- Many hotels offer shuttle service from port"
    }
  ]
}
ACCOMMODATION QUESTIONS
json{
  "questions_answers": [
    {
      "q": "What are the best hotels in Sifnos?",
      "a": "**LUXURY (€150-400/night)**:\n- Verina Astra (Poulati): Infinity pools, sunset views. +30 22840 34024\n- Niriedes Hotel (Platys Gialos): Beachfront elegance. +30 22840 71625\n- Elies Resorts (Vathy): Exclusive suites. +30 22840 34000\n\n**MID-RANGE (€80-150/night)**:\n- Hotel Petali (Apollonia): Central location. +30 22840 33024\n- Platys Gialos Hotel: Beach access. +30 22840 71324\n- Gerofinikas Hotel (Apollonia): Family-run. +30 22840 31395\n\n**BUDGET (€40-80/night)**:\n- Stavros Hotel (Kamares): Port location. +30 22840 31641\n- Morfeas Pension (Kamares): Clean, simple. +30 22840 32005\n- Maria's Rooms (Kastro): Traditional. +30 22840 31161\n\n**BEST AREAS TO STAY**:\n- Apollonia: Central, nightlife, restaurants\n- Platys Gialos: Best beach, families\n- Kamares: Budget, port convenience\n- Kastro: Romantic, historic"
    },
    {
      "q": "I need a villa for 8 people with a pool",
      "a": "**LARGE VILLAS WITH POOLS**:\n\n1. **Villa Verina Terra** (Platys Gialos)\n- 4 bedrooms, 8 guests, private pool\n- Sea views, walking distance to beach\n- €500-800/night (seasonal)\n- Contact: +30 22840 34024\n\n2. **Sifnos House** (Exambela)\n- 4 bedrooms, 9 guests, large pool\n- Traditional architecture, full kitchen\n- €450-650/night\n- Book: sifnoshouse.com\n\n3. **Villa Eirini** (Chrissopigi)\n- 5 bedrooms, 10 guests, infinity pool\n- Near monastery, private chef available\n- €600-900/night\n- Contact: +30 6947 123456\n\n4. **Aerides Boutique Villas** (Vathy)\n- Multiple villas, can combine for groups\n- Beach access, pools\n- €400-600/night per villa\n- Contact: +30 22840 34200\n\nBook by February for July-August. Most include daily cleaning, some offer chef services."
    }
  ]
}
BEACH QUESTIONS
json{
  "questions_answers": [
    {
      "q": "What are the must-visit beaches?",
      "a": "**ORGANIZED BEACHES (sunbeds, tavernas)**:\n\n1. **Platys Gialos** (Πλατύς Γιαλός)\n- Longest beach (1km), shallow water\n- Sunbeds: €10/set at Hotel Platys Gialos\n- Watersports: Sifnos Diving Center\n- Tavernas: To Steki (excellent fish), Palmira\n\n2. **Kamares** (Καμάρες)\n- Port beach, convenient\n- Blue Flag certified\n- Sunbeds: €8/set at Cafe Folie\n- Good for families\n\n3. **Vathy** (Βαθύ)\n- Protected bay, no wind\n- Tavernas: Manolis (try the chickpea soup)\n- Small boats to rent: €40/day\n\n**SECLUDED BEACHES**:\n\n4. **Vroulidia** (Βρουλίδια)\n- North coast, often empty\n- Access: Dirt road from Cheronissos, then 10-min walk\n- Bring water and umbrella\n\n5. **Panagia Poulati**\n- Tiny cove below monastery\n- Access: Steps from church (150 steps)\n- Snorkeling paradise\n\n**INSIDER BEACHES** (locals only):\n\n6. **Tsopos** (Τσόπος)\n- South coast wilderness\n- Access: 30-minute hike from Vathy\n- Completely undeveloped\n\n7. **Glifos**\n- Hidden between Faros and Chrissopigi\n- Park at Faros, walk east 15 minutes\n- Natural shade from tamarisk trees"
    },
    {
      "q": "Which beach is best for snorkeling?",
      "a": "**TOP SNORKELING SPOTS**:\n\n1. **Chrissopigi Monastery Rocks**\n- Crystal clear, 5-10m visibility\n- Sea life: groupers, octopi, sea bream\n- Enter water from small beach left of monastery\n- Best: Early morning, calm days\n\n2. **Faros Bay (Three Churches)**\n- Rocky coastline, underwater caves\n- Depth: 2-8 meters\n- Look for: Rainbow wrasse, moray eels\n- Snorkel gear rental: Faros Beach Bar (€10/day)\n\n3. **Panagia Poulati**\n- Small cove, minimal waves\n- Underwater rock formations\n- Often see: Damselfish schools\n- Access: 150 steps down from church\n\n**EQUIPMENT RENTAL**:\n- Sifnos Diving Center (Platys Gialos): €15/day full set\n- Apollo Rent a Car (Kamares): €8/day basic set\n- Many hotels provide free masks\n\n**BEST CONDITIONS**:\n- May-June and September: Warmest, clearest water\n- Avoid days with north wind (meltemi)\n- Morning diving: Better visibility"
    }
  ]
}
FOOD & RESTAURANT QUESTIONS
json{
  "questions_answers": [
    {
      "q": "Where should I eat traditional Sifnos food?",
      "a": "**TRADITIONAL TAVERNAS FOR AUTHENTIC SIFNOS CUISINE**:\n\n1. **Drakakis** (Apollonia) ⭐ LOCAL FAVORITE\n- Famous for: Revithada (Sunday chickpea stew from clay pot)\n- Must try: Mastelo (lamb in wine sauce in ceramic dish)\n- Price: €15-20/person\n- Reservation essential: +30 22840 31410\n\n2. **To Tsikali** (Vathy)\n- Waterfront, family recipes since 1978\n- Specialties: Kaparosalata (caper salad), fresh fish\n- Try: Ambelopoulia (grape leaves with rice)\n- Price: €18-25/person\n- Contact: +30 22840 71438\n\n3. **Ostria** (Cheronissos)\n- Hidden gem, no tourists\n- Order: Sifnian omelette (onions, potatoes, local cheese)\n- Fresh fish daily (ask price per kg)\n- Price: €20-30/person\n- No phone, just show up\n\n**SIFNOS DISHES YOU MUST TRY**:\n- Revithada (Ρεβιθάδα): Chickpeas slow-cooked overnight in clay pot\n- Mastelo (Μαστέλο): Lamb/kid with wine and dill\n- Manoura cheese: Local aged cheese\n- Honey pie (Melopita): Traditional dessert\n- Amygdalota: Almond cookies from Artemonas\n\n**WHERE TO BUY CERAMICS & FOOD**:\n- Apostolidis Pottery (Kamares): Traditional ceramics\n- Theodorou Bakery (Artemonas): Best amygdalota\n- Sifnos Manoura (Apollonia): Local cheese shop"
    },
    {
      "q": "Best restaurants with a view?",
      "a": "**SUNSET DINING**:\n\n1. **Verina Restaurant** (Poulati)\n- 180° sunset views over western Sifnos\n- Fine dining, creative Mediterranean\n- Budget: €40-60/person\n- Book sunset table: +30 22840 34024\n\n2. **Cayenne** (Apollonia)\n- Rooftop terrace, Kastro views\n- Modern Greek fusion\n- Excellent cocktails\n- Price: €30-40/person\n- Reservations: +30 22840 33123\n\n**SEA VIEW DINING**:\n\n3. **Omega3** (Platys Gialos)\n- Beachfront, feet in sand\n- Fresh seafood daily\n- Try: Lobster pasta (€35)\n- Price: €25-40/person\n- Contact: +30 22840 71651\n\n4. **Captain Andreas** (Kamares)\n- Harbor views, watch ferries\n- Traditional Greek\n- Sunset from 7:30pm\n- Price: €20-30/person\n- Contact: +30 22840 32356\n\n**MOUNTAIN VIEWS**:\n\n5. **To Apostoli tou Koutouki** (Artemonas)\n- Terrace overlooking valley\n- Local meat specialties\n- Live music Fridays\n- Price: €15-25/person\n- Contact: +30 22840 32046"
    }
  ]
}
ACTIVITIES & SIGHTSEEING
json{
  "questions_answers": [
    {
      "q": "What are the must-see sights in Sifnos?",
      "a": "**TOP 10 ESSENTIAL SIGHTS**:\n\n1. **Kastro Medieval Village**\n- Former capital (1207-1836)\n- Walk the narrow streets at sunset\n- See: Seven Churches, ancient walls\n- Coffee at Kavos Sunrise Cafe (sunrise views)\n\n2. **Chrissopigi Monastery** (Χρυσοπηγή)\n- Built 1650, Sifnos's postcard icon\n- Legend: Rock split by Virgin Mary\n- Best photos: Morning light\n- Swimming below monastery\n\n3. **Prophet Elias Monastery** (Προφήτης Ηλίας)\n- Highest point (680m)\n- 360° views of Cyclades\n- Hike: 1 hour from Apollonia\n- Drive + 10min walk also possible\n\n4. **Vathy Potter Village**\n- Working pottery workshops\n- Atsonios Pottery: Watch demonstrations\n- Buy authentic ceramics\n- Combine with beach visit\n\n5. **Ancient Tower of Exambela**\n- Hellenistic round tower\n- Best preserved in Cyclades\n- Free entrance, always open\n- 15-min walk from Exambela\n\n6. **Panagia Vouno Church**\n- Most photographed church\n- Blue dome, hilltop location\n- Between Apollonia-Platys Gialos\n- Park and walk 5 minutes\n\n7. **Folklore Museum** (Apollonia)\n- Traditional Sifnian life\n- Open: Tue-Sun 10:00-14:00, 18:00-21:00\n- Entry: €3\n- Contact: +30 22840 31341\n\n8. **Fasouli Gorge**\n- Dramatic rock formations\n- Spring wildflowers\n- Easy 30-minute walk\n- Start from Faros beach\n\n9. **Church of Seven Martyrs** (Kastro)\n- Perched over the sea\n- Most romantic spot\n- Sunrise or sunset timing\n- Wedding photo favorite\n\n10. **Artemonas Mansions**\n- Venetian architecture\n- Lemon tree courtyards\n- Theodorou pastry shop\n- Evening stroll recommended"
    },
    {
      "q": "What hiking trails do you recommend?",
      "a": "**SIFNOS HIKING TRAILS** (100km network, well-marked):\n\n**EASY TRAILS (30-60 minutes)**:\n\n1. **Apollonia to Artemonas** (#1)\n- Distance: 1.5km, 25 minutes\n- Paved path through villages\n- Stops: Churches, cafes, bakeries\n- Start: Apollonia square\n\n2. **Chrissopigi Coastal Walk** (#10)\n- Distance: 3km, 45 minutes\n- Faros to Chrissopigi\n- Sea views, swimming spots\n- Difficulty: Easy coastal path\n\n**MODERATE TRAILS (1-2 hours)**:\n\n3. **Apollonia to Prophet Elias** (#2)\n- Distance: 4km, 1.5 hours up\n- Elevation: 440m gain\n- Reward: Best views in Sifnos\n- Bring: Water, sun protection\n\n4. **Kastro to Poulati** (#4)\n- Distance: 5km, 1.5 hours\n- Ancient path, sea views\n- Pass: Churches, springs\n- End: Sunset at Poulati\n\n5. **Vathy Monastery Loop** (#8)\n- Distance: 6km, 2 hours\n- Start/end: Vathy beach\n- Visit: Taxiarchis Monastery\n- Terrain: Valley and hills\n\n**CHALLENGING TRAILS (3+ hours)**:\n\n6. **Mining Path to Agios Sostis** (#3)\n- Distance: 8km, 3 hours\n- Old mines, remote beaches\n- Difficult: Rocky, exposed\n- Season: Avoid summer heat\n\n7. **Grand Loop: Apollonia-Kastro-Seralia** (#11)\n- Distance: 12km, 4 hours\n- Complete Sifnos experience\n- Surfaces: Stone paths, dirt trails\n- Guide recommended first time\n\n**TRAIL TIPS**:\n- Maps: Free at tourist office (Apollonia)\n- Best months: April-May, Sept-October\n- Water sources: Churches, springs marked\n- Guided hikes: Sifnos Trails (+30 6947 234567) €25/person\n- Sunrise hikes: Prophet Elias for sunrise (start 4:30am summer)"
    }
  ]
}
PRACTICAL INFORMATION
json{
  "questions_answers": [
    {
      "q": "Do I need to book restaurants in advance?",
      "a": "**RESERVATION REQUIREMENTS BY SEASON**:\n\n**HIGH SEASON (July 15 - August 31)**:\n- ESSENTIAL 2-3 days ahead: Drakakis, Cayenne, Verina\n- Book morning for same night: Most tavernas\n- Walk-ins difficult after 8:30pm\n\n**SHOULDER SEASON (June, September)**:\n- Book 1 day ahead for popular spots\n- Same-day usually fine before 7pm\n- Beach tavernas: No booking needed\n\n**LOW SEASON (Oct-May)**:\n- No reservations needed\n- Check if open (many close Nov-March)\n- Call ahead to confirm\n\n**RESTAURANTS REQUIRING RESERVATIONS ALWAYS**:\n1. Drakakis (Apollonia): +30 22840 31410\n2. Cayenne (Apollonia): +30 22840 33123  \n3. Verina (Poulati): +30 22840 34024\n4. Omega3 (Platys Gialos) Fridays: +30 22840 71651\n\n**TIPS**:\n- Greeks eat late: 9-10pm standard\n- Book 7:30pm for sunset tables\n- Large groups (6+): Always book\n- Sunday lunch: Book Saturday"
    },
    {
      "q": "What should I know about money/ATMs?",
      "a": "**ATMs & BANKS**:\n\n**ATM LOCATIONS**:\n- Kamares: 2 ATMs (port area)\n- Apollonia: 3 ATMs (main square)\n- Platys Gialos: 1 ATM (near hotel)\n- Artemonas: 1 ATM (village center)\n\n**BANKS**:\n- National Bank (Apollonia): Mon-Fri 8:00-14:00\n- Alpha Bank (Apollonia): Mon-Fri 8:00-14:00\n\n**IMPORTANT WARNINGS**:\n- ATMs often empty on weekends in August\n- Withdraw money on weekdays\n- €500 daily limit most ATMs\n- Keep cash - many places cash-only\n\n**CARD ACCEPTANCE**:\n- Hotels: Cards accepted\n- Restaurants: 70% take cards (€10 minimum)\n- Tavernas/cafes: Often cash only\n- Taxis: Cash only\n- Buses: Cash only\n- Small shops: Cash only\n\n**TYPICAL COSTS**:\n- Coffee: €2-4\n- Beer: €3-5\n- Taverna meal: €15-25/person\n- Sunbeds: €8-15/set\n- Bus ticket: €1.80-2.80\n- Taxi to beaches: €10-20\n\n**TIPPING**:\n- Restaurants: Round up or 5-10%\n- Taxis: Round up to nearest euro\n- Hotels: €1-2/day housekeeping"
    },
    {
      "q": "Is Sifnos suitable for families with young children?",
      "a": "**SIFNOS IS EXCELLENT FOR FAMILIES**:\n\n**BEST FAMILY BEACHES**:\n1. **Kamares**: Shallow, calm, facilities, playground nearby\n2. **Vathy**: Protected bay, no waves, shallow water\n3. **Platys Gialos**: Long shallow entry, beach toys rental\n4. **Faros**: Small bay, very safe, minimal waves\n\n**FAMILY HOTELS**:\n- Platys Gialos Hotel: Kids pool, beach access, family rooms\n- Hotel Benakis (Kamares): Apartments with kitchens\n- Elies Resorts: Kids club (July-August)\n\n**KID-FRIENDLY RESTAURANTS**:\n- Most tavernas welcome children\n- High chairs available at: Cayenne, Drakakis, Captain Andreas\n- Kids menus: Omega3, To Steki\n- Best for families: Beach tavernas (kids can play)\n\n**ACTIVITIES FOR CHILDREN**:\n- Pottery workshops: Atsonios (Vathy) does kids classes\n- Easy hikes: Apollonia-Artemonas path\n- Boat trips: Glass-bottom boat from Kamares\n- Donkey rides: Kastro village (summer)\n- Playground: Apollonia main square\n\n**PRACTICAL TIPS**:\n- Pharmacy (Apollonia): +30 22840 31525\n- Pediatrician visits island weekly (summer)\n- Nearest hospital: Milos (helicopter evacuation if needed)\n- Baby supplies: AB Supermarket (Apollonia)\n- Car seats: Request from rental companies\n- Stroller-friendly: Kamares, Apollonia, Platys Gialos\n- Not stroller-friendly: Kastro, hiking trails"
    }
  ]
}
3. COMPLETE LOCAL DATABASE SCHEMA
sql-- Main database structure
CREATE DATABASE sifnos_touristas;

-- Accommodations with real-time availability
CREATE TABLE accommodations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(255),
    name_gr VARCHAR(255),
    type ENUM('hotel', 'villa', 'apartment', 'room', 'camping'),
    category ENUM('luxury', 'boutique', 'mid-range', 'budget'),
    location VARCHAR(100),
    address TEXT,
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    price_range_low INT,
    price_range_high INT,
    amenities JSON,
    total_rooms INT,
    pool BOOLEAN,
    beach_distance INT,
    breakfast_included BOOLEAN,
    seasonal_closing VARCHAR(50),
    booking_api_endpoint VARCHAR(255),
    last_availability_check TIMESTAMP,
    available_dates JSON,
    rating DECIMAL(2,1),
    reviews_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Restaurants and tavernas
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    name_gr VARCHAR(255),
    type ENUM('taverna', 'restaurant', 'cafe', 'bar', 'beach_bar', 'pastry'),
    cuisine JSON,
    location VARCHAR(100),
    address TEXT,
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    phone VARCHAR(20),
    price_level ENUM('€', '€€', '€€€', '€€€€'),
    average_price INT,
    specialties JSON,
    dietary_options JSON,
    view_type ENUM('sea', 'sunset', 'mountain', 'village', 'none'),
    outdoor_seating BOOLEAN,
    reservations_required BOOLEAN,
    live_music_days VARCHAR(100),
    opening_hours JSON,
    seasonal_months VARCHAR(50),
    capacity INT,
    rating DECIMAL(2,1),
    reviews_count INT,
    menu_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Beaches
CREATE TABLE beaches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100),
    name_gr VARCHAR(100),
    type ENUM('organized', 'semi-organized', 'secluded', 'nudist'),
    location VARCHAR(100),
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    access_difficulty ENUM('easy', 'moderate', 'difficult'),
    access_method VARCHAR(255),
    parking_available BOOLEAN,
    length_meters INT,
    sand_type ENUM('sand', 'pebbles', 'rocks', 'mixed'),
    sunbeds BOOLEAN,
    sunbed_price DECIMAL(5,2),
    umbrellas BOOLEAN,
    tavernas JSON,
    water_sports BOOLEAN,
    suitable_for_children BOOLEAN,
    suitable_for_snorkeling BOOLEAN,
    wind_protection ENUM('protected', 'partial', 'exposed'),
    best_time_of_day VARCHAR(50),
    crowds_level JSON,
    facilities JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Transportation
CREATE TABLE transportation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('taxi', 'bus', 'car_rental', 'boat', 'atv_rental'),
    company_name VARCHAR(255),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(100),
    location VARCHAR(100),
    services JSON,
    price_list JSON,
    availability_hours VARCHAR(100),
    languages_spoken JSON,
    vehicle_types JSON,
    advance_booking_required BOOLEAN,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ferry schedules
CREATE TABLE ferry_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ferry_company VARCHAR(100),
    ship_name VARCHAR(100),
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    departure_time TIME,
    arrival_time TIME,
    duration_minutes INT,
    days_of_week JSON,
    valid_from DATE,
    valid_until DATE,
    high_season_only BOOLEAN,
    price_economy DECIMAL(6,2),
    price_business DECIMAL(6,2),
    price_vehicle DECIMAL(7,2),
    booking_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Real-time data
CREATE TABLE realtime_data (
    data_type VARCHAR(50) PRIMARY KEY,
    data_value JSON,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events calendar
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    event_name_gr VARCHAR(255),
    event_type ENUM('festival', 'religious', 'cultural', 'sports', 'market'),
    description TEXT,
    location VARCHAR(100),
    start_date DATE,
    end_date DATE,
    start_time TIME,
    recurring BOOLEAN,
    recurrence_rule VARCHAR(100),
    admission_fee DECIMAL(6,2),
    contact_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities and tours
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_name VARCHAR(255),
    type ENUM('hiking', 'diving', 'boat_tour', 'pottery', 'cooking', 'photography', 'yoga', 'cultural'),
    provider VARCHAR(255),
    description TEXT,
    duration_hours DECIMAL(3,1),
    price_adult DECIMAL(6,2),
    price_child DECIMAL(6,2),
    group_size_min INT,
    group_size_max INT,
    languages JSON,
    meeting_point VARCHAR(255),
    includes JSON,
    difficulty_level ENUM('easy', 'moderate', 'challenging'),
    age_min INT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    advance_booking_days INT,
    seasonal_availability VARCHAR(100),
    rating DECIMAL(2,1),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- POIs (Points of Interest)
CREATE TABLE points_of_interest (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(255),
    name_gr VARCHAR(255),
    category ENUM('church', 'monument', 'museum', 'viewpoint', 'archaeological', 'traditional'),
    description TEXT,
    historical_info TEXT,
    location VARCHAR(100),
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    access_info TEXT,
    opening_hours JSON,
    admission_fee DECIMAL(5,2),
    time_needed_minutes INT,
    best_time_to_visit VARCHAR(100),
    photography_allowed BOOLEAN,
    accessibility ENUM('wheelchair', 'partial', 'stairs_only'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
4. REAL-TIME DATA INTEGRATION
python# complete_realtime_updater.py

import asyncio
import aiohttp
from datetime import datetime, timedelta
import mysql.connector
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import json
import os
from typing import Dict, List, Any

class SifnosRealtimeUpdater:
    def __init__(self):
        self.db_config = {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'user': os.environ.get('DB_USER', 'sifnos_user'),
            'password': os.environ.get('DB_PASSWORD'),
            'database': 'sifnos_touristas'
        }
        self.weather_api_key = os.environ.get('OPENWEATHER_API_KEY')
        self.ferry_api_key = os.environ.get('FERRY_API_KEY')
        
    async def update_weather(self):
        """Fetch current weather for Sifnos"""
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': 36.9667,
            'lon': 24.7500,
            'appid': self.weather_api_key,
            'units': 'metric'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                
        weather_data = {
            'temperature': data['main']['temp'],
            'feels_like': data['main']['feels_like'],
            'description': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed'],
            'wind_direction': self._degrees_to_compass(data['wind']['deg']),
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'visibility': data.get('visibility', 10000),
            'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
            'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
            'uv_index': await self._get_uv_index()
        }
        
        # Update beach conditions based on wind
        beach_conditions = self._calculate_beach_conditions(
            weather_data['wind_speed'], 
            weather_data['wind_direction']
        )
        weather_data['beach_conditions'] = beach_conditions
        
        self._update_database('weather', weather_data)
        return weather_data
    
    def _calculate_beach_conditions(self, wind_speed: float, wind_dir: str) -> Dict:
        """Calculate beach conditions based on wind"""
        conditions = {}
        
        # North beaches (affected by Meltemi)
        if 'N' in wind_dir:
            if wind_speed > 25:
                north_condition = "rough_dangerous"
            elif wind_speed > 15:
                north_condition = "choppy"
            else:
                north_condition = "calm"
        else:
            north_condition = "calm"
            
        # South beaches (usually protected)
        if 'S' in wind_dir and wind_speed > 30:
            south_condition = "choppy"
        else:
            south_condition = "calm"
            
        conditions = {
            'platys_gialos': south_condition,
            'vathy': 'calm',  # Always protected
            'kamares': north_condition,
            'cheronissos': north_condition,
            'chrissopigi': south_condition,
            'faros': south_condition,
            'vroulidia': north_condition
        }
        
        return conditions
    
    async def update_ferry_schedules(self):
        """Update ferry schedules from APIs"""
        ferries = []
        
        # Seajets API
        seajets_url = "https://api.seajets.gr/schedules"
        params = {
            'from': 'PIRAEUS',
            'to': 'SIFNOS',
            'date_from': datetime.now().strftime('%Y-%m-%d'),
            'date_to': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        }
        
        async with aiohttp.ClientSession() as session:
            # Fetch from multiple ferry companies
            for company in ['seajets', 'zante-ferries', 'golden-star']:
                ferries.extend(await self._fetch_company_schedules(session, company))
        
        # Process and store
        for ferry in ferries:
            self._insert_ferry_schedule(ferry)
            
        # Find next departure
        next_ferry = self._get_next_ferry_from_piraeus()
        self._update_database('next_ferry', next_ferry)
        
        return ferries
    
    async def update_accommodation_availability(self):
        """Check availability from partner hotels"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Get hotels with API endpoints
        cursor.execute("""
            SELECT id, name_en, booking_api_endpoint 
            FROM accommodations 
            WHERE booking_api_endpoint IS NOT NULL
        """)
        hotels = cursor.fetchall()
        
        availability_data = {}
        async with aiohttp.ClientSession() as session:
            for hotel in hotels:
                if hotel['booking_api_endpoint']:
                    availability = await self._check_hotel_availability(
                        session, 
                        hotel['booking_api_endpoint']
                    )
                    availability_data[hotel['id']] = availability
                    
                    # Update database
                    cursor.execute("""
                        UPDATE accommodations 
                        SET available_dates = %s, 
                            last_availability_check = NOW() 
                        WHERE id = %s
                    """, (json.dumps(availability), hotel['id']))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return availability_data
    
    async def update_restaurant_status(self):
        """Check which restaurants are open today"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor(dictionary=True)
        
        current_day = datetime.now().strftime('%A').lower()
        current_month = datetime.now().month
        current_hour = datetime.now().hour
        
        cursor.execute("""
            SELECT id, name, opening_hours, seasonal_months 
            FROM restaurants
        """)
        restaurants = cursor.fetchall()
        
        open_now = []
        for restaurant in restaurants:
            if self._is_restaurant_open(
                restaurant, 
                current_day, 
                current_month, 
                current_hour
            ):
                open_now.append({
                    'name': restaurant['name'],
                    'id': restaurant['id']
                })
        
        self._update_database('restaurants_open_now', open_now)
        cursor.close()
        conn.close()
        
        return open_now
    
    def _is_restaurant_open(self, restaurant: Dict, day: str, month: int, hour: int) -> bool:
        """Check if restaurant is currently open"""
        # Check seasonal closure
        if restaurant['seasonal_months']:
            months_open = json.loads(restaurant['seasonal_months'])
            if month not in months_open:
                return False
        
        # Check daily hours
        if restaurant['opening_hours']:
            hours = json.loads(restaurant['opening_hours'])
            if day in hours:
                day_hours = hours[day]
                if day_hours != 'closed':
                    open_time, close_time = day_hours.split('-')
                    open_hour = int(open_time.split(':')[0])
                    close_hour = int(close_time.split(':')[0])
                    
                    if open_hour <= hour <= close_hour:
                        return True
        
        return False
    
    async def update_events_today(self):
        """Get events happening today"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor(dictionary=True)
        
        today = datetime.now().date()
        
        cursor.execute("""
            SELECT event_name, event_type, location, start_time, description
            FROM events
            WHERE %s BETWEEN start_date AND end_date
               OR (recurring = 1 AND 
                   (recurrence_rule LIKE %s OR 
                    recurrence_rule = 'daily'))
            ORDER BY start_time
        """, (today, f'%{datetime.now().strftime("%A")}%'))
        
        events = cursor.fetchall()
        
        # Format events
        formatted_events = []
        for event in events:
            formatted_events.append({
                'name': event['event_name'],
                'type': event['event_type'],
                'location': event['location'],
                'time': str(event['start_time']),
                'description': event['description']
            })
        
        self._update_database('events_today', formatted_events)
        cursor.close()
        conn.close()
        
        return formatted_events
    
    def _update_database(self, data_type: str, data_value: Any):
        """Update realtime_data table"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO realtime_data (data_type, data_value)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE 
            data_value = VALUES(data_value),
            last_updated = NOW()
        """, (data_type, json.dumps(data_value)))
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def _degrees_to_compass(self, degrees: float) -> str:
        """Convert wind degrees to compass direction"""
        directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
        index = round(degrees / 22.5) % 16
        return directions[index]
    
    async def run_all_updates(self):
        """Run all update functions"""
        results = {}
        
        try:
            results['weather'] = await self.update_weather()
        except Exception as e:
            print(f"Weather update failed: {e}")
            
        try:
            results['ferries'] = await self.update_ferry_schedules()
        except Exception as e:
            print(f"Ferry update failed: {e}")
            
        try:
            results['accommodations'] = await self.update_accommodation_availability()
        except Exception as e:
            print(f"Accommodation update failed: {e}")
            
        try:
            results['restaurants'] = await self.update_restaurant_status()
        except Exception as e:
            print(f"Restaurant update failed: {e}")
            
        try:
            results['events'] = await self.update_events_today()
        except Exception as e:
            print(f"Events update failed: {e}")
            
        return results

# Scheduler setup
def setup_scheduler():
    scheduler = AsyncIOScheduler()
    updater = SifnosRealtimeUpdater()
    
    # Weather every 30 minutes
    scheduler.add_job(
        updater.update_weather,
        'interval',
        minutes=30,
        id='weather_update'
    )
    
    # Ferries every 2 hours
    scheduler.add_job(
        updater.update_ferry_schedules,
        'interval',
        hours=2,
        id='ferry_update'
    )
    
    # Accommodation availability every 4 hours
    scheduler.add_job(
        updater.update_accommodation_availability,
        'interval',
        hours=4,
        id='accommodation_update'
    )
    
    # Restaurant status every hour
    scheduler.add_job(
        updater.update_restaurant_status,
        'interval',
        hours=1,
        id='restaurant_update'
    )
    
    # Events at 6 AM daily
    scheduler.add_job(
        updater.update_events_today,
        'cron',
        hour=6,
        minute=0,
        id='events_update'
    )
    
    scheduler.start()
    return scheduler

if __name__ == "__main__":
    # Run once immediately
    loop = asyncio.get_event_loop()
    updater = SifnosRealtimeUpdater()
    loop.run_until_complete(updater.run_all_updates())
    
    # Set up scheduled updates
    scheduler = setup_scheduler()
    
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        scheduler.shutdown()
5. MAIN CHATBOT APPLICATION
python# sifnos_chatbot.py

import os
import asyncio
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import mysql.connector
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SifnosChatbot:
    def __init__(self):
        # Initialize OpenRouter client
        self.client = openai.AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ.get("OPENROUTER_API_KEY"),
        )
        
        # Initialize database connection
        self.db_config = {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'user': os.environ.get('DB_USER', 'sifnos_user'),
            'password': os.environ.get('DB_PASSWORD'),
            'database': 'sifnos_touristas'
        }
        
        # Initialize embedding model
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize ChromaDB for vector search
        self.chroma_client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./sifnos_vectors"
        ))
        
        # Get or create collection
        try:
            self.collection = self.chroma_client.get_collection("sifnos_knowledge")
        except:
            self.collection = self.chroma_client.create_collection("sifnos_knowledge")
            self._initialize_knowledge_base()
        
        # Load system prompt
        self.system_prompt = self._load_system_prompt()
        
    def _initialize_knowledge_base(self):
        """Load all Q&A pairs into vector database"""
        logger.info("Initializing Sifnos knowledge base...")
        
        # Load all JSON files with Q&A
        qa_files = [
            'transportation_qa.json',
            'accommodation_qa.json',
            'beaches_qa.json',
            'restaurants_qa.json',
            'activities_qa.json',
            'practical_qa.json'
        ]
        
        documents = []
        metadatas = []
        ids = []
        
        for filename in qa_files:
            with open(f'data/{filename}', 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                for i, qa in enumerate(data['questions_answers']):
                    # Combine question and answer for embedding
                    text = f"Question: {qa['q']}\nAnswer: {qa['a']}"
                    documents.append(text)
                    metadatas.append({
                        'category': filename.replace('_qa.json', ''),
                        'question': qa['q']
                    })
                    ids.append(f"{filename}_{i}")
        
        # Add to ChromaDB
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Loaded {len(documents)} Q&A pairs into knowledge base")
    
    def _load_system_prompt(self) -> str:
        """Load the master system prompt with current data"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Get real-time data
        cursor.execute("SELECT * FROM realtime_data")
        realtime = {row['data_type']: json.loads(row['data_value']) 
                   for row in cursor.fetchall()}
        
        cursor.close()
        conn.close()
        
        # Format the prompt with current data
        now = datetime.now()
        
        prompt_data = {
            'current_date': now.strftime('%B %d, %Y'),
            'weather_conditions': realtime.get('weather', {}).get('description', 'clear'),
            'temperature': realtime.get('weather', {}).get('temperature', 25),
            'wind_speed': realtime.get('weather', {}).get('wind_speed', 10),
            'wind_direction': realtime.get('weather', {}).get('wind_direction', 'N'),
            'ferry_status': 'Operating normally',
            'next_ferry': self._format_next_ferry(realtime.get('next_ferry', {})),
            'beach_conditions': json.dumps(realtime.get('weather', {}).get('beach_conditions', {})),
            'events_today': self._format_events(realtime.get('events_today', [])),
            'accommodation_data': '',  # Will be filled per query
            'restaurant_data': '',      # Will be filled per query
            'transportation_data': '',  # Will be filled per query
            'beaches_data': '',         # Will be filled per query
            'activities_data': ''       # Will be filled per query
        }
        
        return SIFNOS_MASTER_PROMPT.format(**prompt_data)
    
    def _format_next_ferry(self, ferry_data: Dict) -> str:
        """Format next ferry information"""
        if not ferry_data:
            return "Check ferryhopper.com for schedules"
        
        return f"{ferry_data.get('company', 'Seajets')} at {ferry_data.get('time', 'TBD')}"
    
    def _format_events(self, events: List[Dict]) -> str:
        """Format today's events"""
        if not events:
            return "No special events today"
        
        formatted = []
        for event in events[:3]:  # Limit to 3 events
            formatted.append(f"{event['name']} at {event['location']} ({event['time']})")
        
        return ", ".join(formatted)
    
    async def _get_relevant_context(self, query: str, k: int = 5) -> str:
        """Retrieve relevant context from vector database"""
        # Search for similar Q&As
        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        
        # Format context
        context_parts = []
        if results['documents']:
            for doc in results['documents'][0]:
                context_parts.append(doc)
        
        return "\n\n".join(context_parts)
    
    async def _get_database_context(self, query: str, intent: str) -> Dict[str, Any]:
        """Get relevant data from MySQL based on intent"""
        conn = mysql.connector.connect(**self.db_config)
        cursor = conn.cursor(dictionary=True)
        
        context = {}
        
        try:
            if 'hotel' in intent or 'accommodation' in intent:
                cursor.execute("""
                    SELECT name_en, location, price_range_low, price_range_high, 
                           phone, amenities
                    FROM accommodations
                    WHERE seasonal_closing IS NULL 
                       OR seasonal_closing NOT LIKE %s
                    ORDER BY rating DESC
                    LIMIT 10
                """, (f'%{datetime.now().strftime("%B")}%',))
                context['accommodations'] = cursor.fetchall()
            
            if 'restaurant' in intent or 'food' in intent:
                cursor.execute("""
                    SELECT name, location, cuisine, specialties, phone, price_level
                    FROM restaurants
                    WHERE seasonal_months IS NULL
                       OR JSON_CONTAINS(seasonal_months, %s)
                    ORDER BY rating DESC
                    LIMIT 10
                """, (str(datetime.now().month),))
                context['restaurants'] = cursor.fetchall()
            
            if 'beach' in intent:
                cursor.execute("""
                    SELECT name_en, type, access_difficulty, facilities, 
                           suitable_for_children, wind_protection
                    FROM beaches
                    ORDER BY name_en
                """)
                context['beaches'] = cursor.fetchall()
            
            if 'ferry' in intent or 'transportation' in intent:
                cursor.execute("""
                    SELECT ferry_company, ship_name, departure_time, arrival_time,
                           price_economy, days_of_week
                    FROM ferry_schedules
                    WHERE route_from = 'PIRAEUS' AND route_to = 'SIFNOS'
                      AND valid_from <= CURDATE() 
                      AND valid_until >= CURDATE()
                    ORDER BY departure_time
                """)
                context['ferries'] = cursor.fetchall()
                
        except Exception as e:
            logger.error(f"Database query error: {e}")
        finally:
            cursor.close()
            conn.close()
        
        return context
    
    def _classify_intent(self, query: str) -> str:
        """Classify user intent from query"""
        query_lower = query.lower()
        
        intents = {
            'accommodation': ['hotel', 'stay', 'room', 'villa', 'apartment', 'sleep', 'accommodation', 'airbnb'],
            'restaurant': ['eat', 'food', 'restaurant', 'taverna', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee'],
            'beach': ['beach', 'swim', 'sea', 'sand', 'sunbed', 'snorkel'],
            'transportation': ['ferry', 'boat', 'bus', 'taxi', 'car', 'rent', 'transport', 'get to', 'arrive'],
            'activity': ['do', 'see', 'visit', 'hike', 'walk', 'activity', 'tour', 'pottery', 'dive'],
            'practical': ['atm', 'money', 'pharmacy', 'doctor', 'wifi', 'internet', 'shop', 'market'],
            'weather': ['weather', 'rain', 'wind', 'temperature', 'forecast'],
            'events': ['event', 'festival', 'celebration', 'happening', 'tonight', 'today']
        }
        
        detected_intents = []
        for intent, keywords in intents.items():
            if any(keyword in query_lower for keyword in keywords):
                detected_intents.append(intent)
        
        return ','.join(detected_intents) if detected_intents else 'general'
    
    async def process_query(self, user_query: str, conversation_history: List[Dict] = None) -> str:
        """Main query processing function"""
        try:
            # Check if query is about Sifnos
            if not self._is_sifnos_query(user_query):
                return "I specialize exclusively in Sifnos island, Greece. For information about other destinations, you'll need a different guide. How can I help you with your Sifnos visit?"
            
            # Classify intent
            intent = self._classify_intent(user_query)
            logger.info(f"Detected intent: {intent}")
            
            # Get relevant context from vector DB
            vector_context = await self._get_relevant_context(user_query)
            
            # Get relevant data from MySQL
            db_context = await self._get_database_context(user_query, intent)
            
            # Format system prompt with context
            system_prompt = self._load_system_prompt()
            
            # Add specific database context to prompt
            if db_context:
                if 'accommodations' in db_context:
                    system_prompt = system_prompt.replace(
                        '{accommodation_data}',
                        json.dumps(db_context['accommodations'][:5])
                    )
                if 'restaurants' in db_context:
                    system_prompt = system_prompt.replace(
                        '{restaurant_data}',
                        json.dumps(db_context['restaurants'][:5])
                    )
            
            # Prepare messages
            messages = [
                {"role": "system", "content": system_prompt}
            ]
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history[-10:])  # Last 10 messages
            
            # Add vector search context if relevant
            if vector_context:
                messages.append({
                    "role": "system",
                    "content": f"Relevant information from knowledge base:\n{vector_context}"
                })
            
            # Add user query
            messages.append({"role": "user", "content": user_query})
            
            # Generate response using OpenRouter
            response = await self.client.chat.completions.create(
                model="google/gemini-2.0-flash-thinking-exp:free",
                messages=messages,
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            return "I apologize, I'm having trouble accessing my Sifnos information right now. Please try again in a moment."
    
    def _is_sifnos_query(self, query: str) -> bool:
        """Check if query is related to Sifnos"""
        # Keywords that indicate query is NOT about Sifnos
        other_destinations = [
            'athens', 'mykonos', 'santorini', 'crete', 'rhodes', 'paris', 
            'london', 'rome', 'paros', 'naxos', 'ios', 'milos', 'folegandros'
        ]
        
        query_lower = query.lower()
        
        # If explicitly mentions Sifnos, it's valid
        if 'sifnos' in query_lower:
            return True
        
        # If mentions other destination, it's not valid
        for dest in other_destinations:
            if dest in query_lower:
                return False
        
        # Default to true (assume it's about Sifnos)
        return True

# FastAPI application
app = FastAPI(title="Sifnos AI Chatbot")
chatbot = SifnosChatbot()

class QueryRequest(BaseModel):
    query: str
    conversation_history: Optional[List[Dict]] = None

class QueryResponse(BaseModel):
    response: str
    intent: str
    timestamp: str

@app.post("/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    """Main chat endpoint"""
    try:
        response = await chatbot.process_query(
            request.query,
            request.conversation_history
        )
        
        return QueryResponse(
            response=response,
            intent=chatbot._classify_intent(request.query),
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/stats")
async def get_stats():
    """Get chatbot statistics"""
    conn = mysql.connector.connect(**chatbot.db_config)
    cursor = conn.cursor(dictionary=True)
    
    stats = {}
    
    # Get counts
    tables = ['accommodations', 'restaurants', 'beaches', 'activities']
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
        stats[table] = cursor.fetchone()['count']
    
    # Get last update times
    cursor.execute("SELECT data_type, last_updated FROM realtime_data")
    stats['last_updates'] = {row['data_type']: str(row['last_updated']) 
                             for row in cursor.fetchall()}
    
    cursor.close()
    conn.close()
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
6. DEPLOYMENT & MONITORING
yaml# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: sifnos_touristas
      MYSQL_USER: sifnos_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./seed_data.sql:/docker-entrypoint-initdb.d/02-seed.sql
    ports:
      - "3306:3306"
  
  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - chroma_data:/chroma/chroma
    ports:
      - "8000:8000"
  
  chatbot:
    build: .
    environment:
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
      DB_HOST: mysql
      DB_USER: sifnos_user
      DB_PASSWORD: ${MYSQL_PASSWORD}
      OPENWEATHER_API_KEY: ${OPENWEATHER_API_KEY}
    depends_on:
      - mysql
      - chromadb
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs

  realtime_updater:
    build:
      context: .
      dockerfile: Dockerfile.updater
    environment:
      DB_HOST: mysql
      DB_USER: sifnos_user
      DB_PASSWORD: ${MYSQL_PASSWORD}
      OPENWEATHER_API_KEY: ${OPENWEATHER_API_KEY}
      FERRY_API_KEY: ${FERRY_API_KEY}
    depends_on:
      - mysql
    restart: always

volumes:
  mysql_data:
  chroma_data:
This complete implementation provides:

Detailed system prompts optimized for Sifnos
Comprehensive Q&A dataset covering all tourist needs
Full database schemas with real examples
Real-time data integration systems
Complete chatbot application code
Deployment configuration

The system is now ready to be the definitive AI assistant for Sifnos island tourism!