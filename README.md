App Planning

Flight Log

-----
API
airport info
aviation api


Models
user { username: string
       password: string
       }

travel data{
    departureAirport: string
    arrivalAirport: string
    departureDate: date
    arrivalDate: date
    departureTime: string
    arrivalTime: string
}

passenger data {
    flightNumber: string
    travelDate: [Schema.Types.ObjectId, ref:'travel data']
    class: string
    seatNumber: string
    notes: string
}

flight data{
    flightNumber: [Schema.Types.ObjectId, ref:'passenger data']
    duration: string
    airline: string
    aircraftType: string
    tailNumber: string
}# flight-logs
