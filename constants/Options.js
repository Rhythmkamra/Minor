export const SelectTravelersList = [
    {
      id: 1,
      title: "Just Me",
      desc: "A sole traveler in exploration",
      people: "1",
      icon: "🧍", // Use appropriate icon
    },                        
    {
      id: 2,
      title: "A Couple",
      desc: "Two travelers in tandem",
      people: "2 People",
      icon: "👫", // Use appropriate icon
    },
    {
      id: 3,
      title: "Family",
      desc: "A group of loving adventurers",
      people: "5 to 10 People",
      icon: "👩‍👦",
    },
    {
      id: 4,
      title: "Friends",
      desc: "A bunch of thrill seekers",
      people: "3 to 5 People",
      icon: "👯‍♂️", // Use appropriate icon
    }
  ];
  
  export const selectBudgetOption = [
    {
      id: 1,
      title: "Cheap",
      desc: "Stay conscious of cost",
      icon: "💸", 
    },
    {
      id: 2,
      title: "Moderate",
      desc: "Keep cost at an average level",
      icon: "⚖️", 
    },
    {
      id: 3,
      title: "Luxury",
      desc: "Don't worry about the cost",
      icon: "💎", 
    },
    
  ];   
 
  export const moodOptions = [
    { 
      id: 1, 
      title: 'Culinary', 
      desc: 'Food tours, local cuisines, wine tasting', 
      icon: '🍽️'
    },
    { 
      id: 2, 
      title: 'Sports', 
      desc: 'Adventure, trekking, sports activities', 
      icon: '🏞️'
    },
    { 
      id: 3, 
      title: 'Cultural', 
      desc: 'Museums, heritage, art festivals', 
      icon: '🏺'
    },
    { 
      id: 4, 
      title: 'Relaxation', 
      desc: 'Beaches, spas, wellness retreats', 
      icon: '🏖️'
    },
    { 
      id: 5, 
      title: 'Nightlife', 
      desc: 'Bars, clubs, late-night events', 
      icon: '🍸'
    },
    { 
      id: 6, 
      title: 'Shopping', 
      desc: 'Local markets, street shopping, malls', 
      icon: '🛍️'
    },
  ];
  
  

  export const AI_PROMPT='Generate Travel Plan for location: {location}, for {totalDay} Days and {totalNight} Night for {traveler} with a {budget} budget with a Flight Details,Flight Price with Booking url,Hotel options list with Hotel Name,Hotel address,price,hotel image url,geo coordinates,rating,descriptions and Places to visit nearby with place Name,place details,place image url,Geo coordinate,ticket pricing, time to travel each of the location for {totalDay} days and {totalNight} Night with each day plan with best time to visit in JSON format.'
  export const AI_MOODBOARD_PROMPT = `
Plan a {mood} focused travel itinerary for {location}.
Trip Details:
- Duration: {totalDay} Days and {totalNight} Nights
- Budget: {budget}
- Number of Travelers: {travelerCount}

Focus on activities, locations, and experiences that match the {mood} theme.
Suggest cozy hotels, famous spots, local experiences related to {mood}.
`;
