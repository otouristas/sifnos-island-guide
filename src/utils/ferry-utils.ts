import { format, isAfter, isBefore, isToday, parse, parseISO } from "date-fns";

// Ferry route schedule type definitions
export interface FerrySchedule {
  route: string;
  departurePort: string;
  arrivalPort: string;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string[];
  operator: string;
  vessel: string;
  season: string;
}

// Function to get ferry schedules matching a specific query
export const getFerrySchedules = (
  fromPort?: string,
  toPort?: string,
  date?: Date,
  operator?: string
): FerrySchedule[] => {
  // Filter the schedules based on the params provided
  let filteredSchedules = [...ferrySchedules];
  
  if (fromPort) {
    const fromPortLower = fromPort.toLowerCase();
    filteredSchedules = filteredSchedules.filter(
      s => s.departurePort.toLowerCase().includes(fromPortLower)
    );
  }
  
  if (toPort) {
    const toPortLower = toPort.toLowerCase();
    filteredSchedules = filteredSchedules.filter(
      s => s.arrivalPort.toLowerCase().includes(toPortLower)
    );
  }
  
  if (date) {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    filteredSchedules = filteredSchedules.filter(
      s => s.daysOfWeek.some(day => day.toLowerCase() === dayOfWeek)
    );
    
    // Also filter by season
    const month = format(date, 'MMMM').toLowerCase();
    if (month === 'june' || month === 'july' || month === 'august') {
      filteredSchedules = filteredSchedules.filter(
        s => s.season === 'Summer' || s.season === 'Year-round'
      );
    } else if (month === 'december' || month === 'january' || month === 'february') {
      filteredSchedules = filteredSchedules.filter(
        s => s.season === 'Winter' || s.season === 'Year-round'
      );
    } else {
      filteredSchedules = filteredSchedules.filter(
        s => s.season === 'Spring/Fall' || s.season === 'Year-round'
      );
    }
  }
  
  if (operator) {
    const operatorLower = operator.toLowerCase();
    filteredSchedules = filteredSchedules.filter(
      s => s.operator.toLowerCase().includes(operatorLower)
    );
  }
  
  return filteredSchedules;
};

// Function to format ferry schedule information as a readable string
export const formatFerryScheduleInfo = (schedules: FerrySchedule[]): string => {
  if (schedules.length === 0) {
    return "No ferry schedules found matching your criteria.";
  }
  
  return schedules.map(schedule => {
    return `${schedule.operator} operates from ${schedule.departurePort} to ${schedule.arrivalPort} on ${schedule.daysOfWeek.join(', ')} at ${schedule.departureTime}, arriving at ${schedule.arrivalTime}. Vessel: ${schedule.vessel}.`;
  }).join('\n\n');
};

// Function to get upcoming ferries
export const getUpcomingFerries = (
  fromPort: string,
  toPort: string,
  daysAhead: number = 7
): FerrySchedule[] => {
  const today = new Date();
  const schedules = getFerrySchedules(fromPort, toPort);
  
  // We'd need more detailed schedule data with specific dates to implement this properly
  // This is a simplified version that returns schedules with matching days
  const todayDay = format(today, 'EEEE');
  
  return schedules.filter(schedule => schedule.daysOfWeek.includes(todayDay));
};

// Sample ferry schedule data
export const ferrySchedules: FerrySchedule[] = [
  // Piraeus to Sifnos
  {
    route: "Piraeus-Sifnos",
    departurePort: "Piraeus",
    arrivalPort: "Sifnos",
    departureTime: "07:30",
    arrivalTime: "11:00",
    daysOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    operator: "Blue Star Ferries",
    vessel: "Blue Star Delos",
    season: "Year-round"
  },
  {
    route: "Piraeus-Sifnos",
    departurePort: "Piraeus",
    arrivalPort: "Sifnos",
    departureTime: "17:00",
    arrivalTime: "19:30",
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    operator: "SeaJets",
    vessel: "WorldChampion Jet",
    season: "Summer"
  },
  {
    route: "Piraeus-Sifnos",
    departurePort: "Piraeus",
    arrivalPort: "Sifnos",
    departureTime: "15:30",
    arrivalTime: "18:45",
    daysOfWeek: ["Sunday"],
    operator: "Zante Ferries",
    vessel: "Adamantios Korais",
    season: "Year-round"
  },
  
  // Sifnos to Piraeus
  {
    route: "Sifnos-Piraeus",
    departurePort: "Sifnos",
    arrivalPort: "Piraeus",
    departureTime: "09:15",
    arrivalTime: "12:30",
    daysOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
    operator: "Blue Star Ferries",
    vessel: "Blue Star Naxos",
    season: "Year-round"
  },
  {
    route: "Sifnos-Piraeus",
    departurePort: "Sifnos",
    arrivalPort: "Piraeus",
    departureTime: "19:30",
    arrivalTime: "22:00",
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    operator: "SeaJets",
    vessel: "WorldChampion Jet",
    season: "Summer"
  },
  {
    route: "Sifnos-Piraeus",
    departurePort: "Sifnos",
    arrivalPort: "Piraeus",
    departureTime: "18:30",
    arrivalTime: "22:00",
    daysOfWeek: ["Sunday"],
    operator: "Zante Ferries",
    vessel: "Adamantios Korais",
    season: "Year-round"
  },
  {
    route: "Sifnos-Piraeus",
    departurePort: "Sifnos",
    arrivalPort: "Piraeus",
    departureTime: "14:00",
    arrivalTime: "17:30",
    daysOfWeek: ["Saturday"],
    operator: "Aegean Speed Lines",
    vessel: "Speedrunner",
    season: "Summer"
  },
  
  // Other popular routes
  {
    route: "Milos-Sifnos",
    departurePort: "Milos",
    arrivalPort: "Sifnos",
    departureTime: "10:45",
    arrivalTime: "12:15",
    daysOfWeek: ["Tuesday", "Thursday", "Saturday"],
    operator: "Aegean Speed Lines",
    vessel: "Speedrunner",
    season: "Summer"
  },
  {
    route: "Sifnos-Milos",
    departurePort: "Sifnos",
    arrivalPort: "Milos",
    departureTime: "13:30",
    arrivalTime: "15:00",
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    operator: "SeaJets",
    vessel: "Super Jet",
    season: "Summer"
  },
  {
    route: "Serifos-Sifnos",
    departurePort: "Serifos",
    arrivalPort: "Sifnos",
    departureTime: "09:30",
    arrivalTime: "10:15",
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    operator: "Aegean Speed Lines",
    vessel: "Speedrunner",
    season: "Year-round"
  },
  {
    route: "Sifnos-Serifos",
    departurePort: "Sifnos",
    arrivalPort: "Serifos",
    departureTime: "16:45",
    arrivalTime: "17:30",
    daysOfWeek: ["Tuesday", "Thursday", "Sunday"],
    operator: "Zante Ferries",
    vessel: "Adamantios Korais",
    season: "Year-round"
  },
  {
    route: "Paros-Sifnos",
    departurePort: "Paros",
    arrivalPort: "Sifnos",
    departureTime: "13:15",
    arrivalTime: "14:45",
    daysOfWeek: ["Tuesday", "Thursday", "Saturday"],
    operator: "Blue Star Ferries",
    vessel: "Blue Star Paros",
    season: "Summer"
  },
  {
    route: "Sifnos-Paros",
    departurePort: "Sifnos",
    arrivalPort: "Paros",
    departureTime: "10:30",
    arrivalTime: "12:00",
    daysOfWeek: ["Wednesday", "Friday", "Sunday"],
    operator: "SeaJets",
    vessel: "Super Jet",
    season: "Summer"
  }
];
